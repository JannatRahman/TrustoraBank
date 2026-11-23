import { clientPromise, getDatabase } from "@/lib/mongodb";
import {
  COLLECTIONS,
  type DbLoan,
  type DbRepayment,
  type DbBankAccount,
  type DbTransaction,
  type DbAuditLog,
  type DbNotification,
  type LoanType,
  type LoanStatus,
  type UserRole,
} from "@/types";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "@/server/auth/errors";
import { AccountService } from "@/services/accountService";
import { SettingsService } from "@/services/settingsService";
import { PinService } from "@/services/pinService";
import { TransactionService } from "@/services/transactionService";
import type {
  LoanApplicationPayload,
  AdminReviewPayload,
} from "@/validators/loanValidator";

export class LoanService {
  /**
   * Calculates monthly EMI and total payable amount using standard amortization.
   * EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
   */
  static calculateLoanTerms(
    principal: number,
    annualRatePercent: number,
    durationMonths: number
  ): { emi: number; totalPayable: number } {
    if (annualRatePercent <= 0) {
      const emi = Math.round(principal / durationMonths);
      return { emi, totalPayable: emi * durationMonths };
    }

    const monthlyRate = (annualRatePercent / 100) / 12;
    const factor = Math.pow(1 + monthlyRate, durationMonths);
    const emi = Math.round((principal * monthlyRate * factor) / (factor - 1));
    const totalPayable = emi * durationMonths;

    return { emi, totalPayable };
  }

  /**
   * Generates a loan number matching the pattern: LN-YYYY-XXXXX
   */
  static generateLoanNumber(date: Date = new Date()): string {
    const year = date.getFullYear();
    const hex = Math.random().toString(16).substring(2, 7).toUpperCase();
    return `LN-${year}-${hex}`;
  }

  /**
   * Generates repayment ID: RPY-YYYYMMDD-HEX
   */
  static generateRepaymentId(installmentNo: number, date: Date = new Date()): string {
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const hex = Math.random().toString(16).substring(2, 6).toUpperCase();
    return `RPY-${yyyymmdd}-${String(installmentNo).padStart(3, "0")}-${hex}`;
  }

  /**
   * Customer submits a new loan application.
   * Server determines the authoritative interest rate and calculates EMI & totalPayable.
   */
  static async applyForLoan(
    userEmail: string,
    userRole: UserRole,
    payload: LoanApplicationPayload
  ): Promise<DbLoan> {
    const bankAccount = await AccountService.validateAccountOwnership(
      payload.account,
      userEmail,
      userRole
    );
    AccountService.validateAccountStatus(bankAccount);

    // Fetch official interest rate from bank settings
    const settings = await SettingsService.getBankSettings();
    const interestRate = settings.loanInterestRates[payload.type] || 10;

    const { emi, totalPayable } = this.calculateLoanTerms(
      payload.amount,
      interestRate,
      payload.durationMonths
    );

    const db = await getDatabase();
    const now = new Date();
    const loanNumber = this.generateLoanNumber(now);

    const loanDoc: DbLoan = {
      loanNumber,
      applicant: userEmail.toLowerCase(),
      account: bankAccount.accountNumber,
      type: payload.type,
      amount: payload.amount,
      durationMonths: payload.durationMonths,
      interestRate,
      emi,
      totalPayable,
      monthlyIncome: payload.monthlyIncome,
      employmentStatus: payload.employmentStatus,
      description: payload.description,
      status: "PENDING",
      staffNotes: [],
      paidInstallments: 0,
      remainingBalance: totalPayable,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection<DbLoan>(COLLECTIONS.LOANS).insertOne(loanDoc);

    // Notify customer
    await db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS).insertOne({
      type: "LOAN_APPLICATION_SUBMITTED",
      user: userEmail.toLowerCase(),
      title: "Loan Application Received",
      message: `Your application for a ৳${payload.amount.toLocaleString()} ${payload.type} Loan has been received (Ref: ${loanNumber}).`,
      relatedModel: "Loan",
      relatedId: loanNumber,
      read: false,
      createdAt: now,
      updatedAt: now,
    });

    return loanDoc;
  }

  /**
   * Banking Staff adds an internal review note to a loan application.
   */
  static async addStaffNote(
    loanNumber: string,
    staffEmail: string,
    note: string
  ): Promise<DbLoan> {
    const db = await getDatabase();
    const collection = db.collection<DbLoan>(COLLECTIONS.LOANS);

    const loan = await collection.findOne({ loanNumber: loanNumber.trim() });
    if (!loan) {
      throw new NotFoundError(`Loan ${loanNumber} was not found.`);
    }

    const newNote = {
      staff: staffEmail.toLowerCase(),
      note: note.trim(),
      createdAt: new Date(),
    };

    const updated = await collection.findOneAndUpdate(
      { loanNumber: loan.loanNumber },
      {
        $push: { staffNotes: newNote },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      throw new BadRequestError("Failed to add staff note.");
    }

    return updated;
  }

  /**
   * Banking Staff forwards a loan application to Admin for final approval.
   * Staff cannot review or forward their own personal loan application!
   */
  static async forwardToAdmin(
    loanNumber: string,
    staffEmail: string
  ): Promise<DbLoan> {
    const db = await getDatabase();
    const collection = db.collection<DbLoan>(COLLECTIONS.LOANS);

    const loan = await collection.findOne({ loanNumber: loanNumber.trim() });
    if (!loan) {
      throw new NotFoundError(`Loan ${loanNumber} was not found.`);
    }

    if (loan.applicant.toLowerCase() === staffEmail.toLowerCase()) {
      throw new ForbiddenError("Staff members cannot review or forward their own loan applications.");
    }

    if (loan.status !== "PENDING" && loan.status !== "UNDER_REVIEW") {
      throw new BadRequestError(`Loan ${loanNumber} cannot be forwarded (current status: ${loan.status}).`);
    }

    const now = new Date();
    const updated = await collection.findOneAndUpdate(
      { loanNumber: loan.loanNumber },
      {
        $set: {
          status: "FORWARDED_TO_ADMIN",
          forwardedBy: staffEmail.toLowerCase(),
          forwardedAt: now,
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      throw new BadRequestError("Failed to forward loan to admin.");
    }

    return updated;
  }

  /**
   * Admin approves a loan application.
   */
  static async approveLoan(
    loanNumber: string,
    adminEmail: string,
    options: { approvedAmount?: number; interestRate?: number; durationMonths?: number } = {}
  ): Promise<DbLoan> {
    const db = await getDatabase();
    const collection = db.collection<DbLoan>(COLLECTIONS.LOANS);

    const loan = await collection.findOne({ loanNumber: loanNumber.trim() });
    if (!loan) {
      throw new NotFoundError(`Loan ${loanNumber} was not found.`);
    }

    if (loan.status === "APPROVED" || loan.status === "ACTIVE" || loan.status === "COMPLETED") {
      throw new BadRequestError(`Loan ${loanNumber} has already been approved.`);
    }

    if (loan.status === "REJECTED") {
      throw new BadRequestError(`Loan ${loanNumber} was previously rejected.`);
    }

    const amount = options.approvedAmount || loan.amount;
    const rate = options.interestRate || loan.interestRate;
    const duration = options.durationMonths || loan.durationMonths;

    const { emi, totalPayable } = this.calculateLoanTerms(amount, rate, duration);
    const now = new Date();

    const updated = await collection.findOneAndUpdate(
      { loanNumber: loan.loanNumber },
      {
        $set: {
          status: "APPROVED",
          amount,
          interestRate: rate,
          durationMonths: duration,
          emi,
          totalPayable,
          remainingBalance: totalPayable,
          approvedBy: adminEmail.toLowerCase(),
          approvedAt: now,
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      throw new BadRequestError("Failed to approve loan.");
    }

    // Customer Notification
    await db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS).insertOne({
      type: "LOAN_APPROVED",
      user: loan.applicant.toLowerCase(),
      title: "Loan Approved",
      message: `Your ${loan.type} loan ${loanNumber} for ৳${amount.toLocaleString()} has been approved. Awaiting disbursement.`,
      relatedModel: "Loan",
      relatedId: loanNumber,
      read: false,
      createdAt: now,
      updatedAt: now,
    });

    return updated;
  }

  /**
   * Admin or Staff rejects a loan application with a required reason.
   */
  static async rejectLoan(
    loanNumber: string,
    reviewerEmail: string,
    reviewerRole: UserRole,
    reason: string
  ): Promise<DbLoan> {
    const db = await getDatabase();
    const collection = db.collection<DbLoan>(COLLECTIONS.LOANS);

    const loan = await collection.findOne({ loanNumber: loanNumber.trim() });
    if (!loan) {
      throw new NotFoundError(`Loan ${loanNumber} was not found.`);
    }

    if (reviewerRole === "banking-staff" && loan.applicant.toLowerCase() === reviewerEmail.toLowerCase()) {
      throw new ForbiddenError("Staff members cannot review or reject their own loan applications.");
    }

    if (loan.status === "ACTIVE" || loan.status === "COMPLETED") {
      throw new BadRequestError(`Cannot reject an active or completed loan.`);
    }

    const now = new Date();
    const updated = await collection.findOneAndUpdate(
      { loanNumber: loan.loanNumber },
      {
        $set: {
          status: "REJECTED",
          rejectedBy: reviewerEmail.toLowerCase(),
          rejectedAt: now,
          rejectionReason: reason.trim(),
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      throw new BadRequestError("Failed to reject loan.");
    }

    // Customer Notification
    await db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS).insertOne({
      type: "LOAN_REJECTED",
      user: loan.applicant.toLowerCase(),
      title: "Loan Application Declined",
      message: `Your loan application ${loanNumber} was not approved. Reason: ${reason}`,
      relatedModel: "Loan",
      relatedId: loanNumber,
      read: false,
      createdAt: now,
      updatedAt: now,
    });

    return updated;
  }

  /**
   * Disburses an approved loan to the customer's account.
   * Atomically:
   * 1. Credits customer account by principal amount.
   * 2. Sets loan status to ACTIVE and records disbursement timestamp and transaction ID.
   * 3. Creates LOAN_DISBURSEMENT transaction.
   * 4. Generates the full N-month installment schedule in Repayments collection.
   * 5. Creates audit log and customer notification.
   */
  static async disburseLoan(
    loanNumber: string,
    adminEmail: string
  ): Promise<{ loan: DbLoan; transaction: DbTransaction }> {
    const db = await getDatabase();
    const loansCol = db.collection<DbLoan>(COLLECTIONS.LOANS);
    const accountsCol = db.collection<DbBankAccount>(COLLECTIONS.ACCOUNTS);
    const repaymentsCol = db.collection<DbRepayment>(COLLECTIONS.REPAYMENTS);
    const txCol = db.collection<DbTransaction>(COLLECTIONS.TRANSACTIONS);
    const auditCol = db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS);
    const notifCol = db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS);

    const loan = await loansCol.findOne({ loanNumber: loanNumber.trim() });
    if (!loan) {
      throw new NotFoundError(`Loan ${loanNumber} was not found.`);
    }

    if (loan.status !== "APPROVED") {
      throw new BadRequestError(`Only approved loans can be disbursed (current status: ${loan.status}).`);
    }

    if (loan.disbursedAt || loan.disbursementTransaction) {
      throw new BadRequestError(`Loan ${loanNumber} has already been disbursed.`);
    }

    const account = await AccountService.getAccountByNumber(loan.account);
    if (!account) {
      throw new NotFoundError(`Target bank account ${loan.account} was not found.`);
    }
    AccountService.validateAccountStatus(account);

    const client = await clientPromise;
    const session = client.startSession();

    let disbursedLoan: DbLoan | null = null;
    let disburseTx: DbTransaction | null = null;
    const now = new Date();
    const txId = TransactionService.generateTransactionId(now);

    // Calculate first due date (30 days from now)
    const firstDueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    try {
      await session.withTransaction(async () => {
        // Step 1: Transition loan to ACTIVE
        const loanUp = await loansCol.findOneAndUpdate(
          { loanNumber: loan.loanNumber, status: "APPROVED" },
          {
            $set: {
              status: "ACTIVE",
              disbursedAt: now,
              disbursementTransaction: txId,
              nextDueDate: firstDueDate,
              updatedAt: now,
            },
          },
          { session, returnDocument: "after" }
        );

        if (!loanUp) {
          throw new BadRequestError("Loan was already disbursed concurrently.");
        }
        disbursedLoan = loanUp;

        // Step 2: Credit customer account
        const accUp = await accountsCol.findOneAndUpdate(
          { accountNumber: loan.account, status: "ACTIVE" },
          {
            $inc: { balance: loan.amount },
            $set: { updatedAt: now },
          },
          { session, returnDocument: "after" }
        );

        if (!accUp) {
          throw new BadRequestError("Failed to credit account: Account may be inactive.");
        }

        // Step 3: Insert LOAN_DISBURSEMENT transaction
        disburseTx = {
          transactionId: txId,
          type: "LOAN_DISBURSEMENT",
          status: "COMPLETED",
          receiverAccount: loan.account,
          amount: loan.amount,
          fee: 0,
          description: `Loan disbursement - ${loan.loanNumber}`,
          initiatedBy: adminEmail.toLowerCase(),
          processedBy: adminEmail.toLowerCase(),
          loanId: loan.loanNumber,
          receiverBalanceAfter: accUp.balance,
          createdAt: now,
          updatedAt: now,
        };
        await txCol.insertOne(disburseTx, { session });

        // Step 4: Generate Full Repayment Installment Schedule
        const monthlyInterestRate = (loan.interestRate / 100) / 12;
        let remainingPrincipal = loan.amount;
        const repaymentDocs: DbRepayment[] = [];

        for (let i = 1; i <= loan.durationMonths; i++) {
          const installmentDueDate = new Date(now.getTime() + i * 30 * 24 * 60 * 60 * 1000);
          const interestPortion = Math.round(remainingPrincipal * monthlyInterestRate);
          const principalPortion = loan.emi - interestPortion;
          remainingPrincipal = Math.max(0, remainingPrincipal - principalPortion);

          repaymentDocs.push({
            repaymentId: this.generateRepaymentId(i, now),
            loan: loan.loanNumber,
            customer: loan.applicant.toLowerCase(),
            account: loan.account,
            installmentNo: i,
            dueDate: installmentDueDate,
            amountDue: loan.emi,
            principalAmount: Math.max(0, principalPortion),
            interestAmount: interestPortion,
            amountPaid: 0,
            status: "PENDING",
            createdAt: now,
            updatedAt: now,
          });
        }

        await repaymentsCol.insertMany(repaymentDocs, { session });

        // Step 5: Audit Log
        await auditCol.insertOne(
          {
            performedBy: adminEmail.toLowerCase(),
            role: "ADMIN",
            action: "LOAN_DISBURSED",
            targetType: "Loan",
            target: loan.loanNumber,
            description: `Disbursed ৳${loan.amount.toLocaleString()} for loan ${loan.loanNumber} to account ${loan.account}`,
            metadata: {
              loanNumber: loan.loanNumber,
              amount: loan.amount,
              account: loan.account,
              transactionId: txId,
            },
            createdAt: now,
          },
          { session }
        );

        // Step 6: Customer Notification
        await notifCol.insertOne(
          {
            type: "LOAN_DISBURSED",
            user: loan.applicant.toLowerCase(),
            title: "Loan Disbursed",
            message: `Your ${loan.type} loan funds of ৳${loan.amount.toLocaleString()} have been credited to your account ${loan.account}. Transaction ID: ${txId}.`,
            relatedModel: "Loan",
            relatedId: loan.loanNumber,
            read: false,
            createdAt: now,
            updatedAt: now,
          },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    if (!disbursedLoan || !disburseTx) {
      throw new BadRequestError("Failed to disburse loan.");
    }

    return { loan: disbursedLoan, transaction: disburseTx };
  }

  /**
   * Customer pays an installment towards their active loan using their PIN.
   * Atomically:
   * 1. Verifies PIN & account status/balance.
   * 2. Debits customer account.
   * 3. Sets repayment status to PAID.
   * 4. Updates loan remainingBalance, paidInstallments, nextDueDate.
   * 5. If all installments paid, transitions loan to COMPLETED.
   * 6. Creates LOAN_REPAYMENT transaction, audit log & notification.
   */
  static async payInstallment(
    loanNumber: string,
    installmentNo: number,
    userEmail: string,
    pin: string,
    paymentAccount?: string
  ): Promise<{ repayment: DbRepayment; transaction: DbTransaction; remainingBalance: number }> {
    const db = await getDatabase();
    const loansCol = db.collection<DbLoan>(COLLECTIONS.LOANS);
    const repaymentsCol = db.collection<DbRepayment>(COLLECTIONS.REPAYMENTS);
    const accountsCol = db.collection<DbBankAccount>(COLLECTIONS.ACCOUNTS);
    const txCol = db.collection<DbTransaction>(COLLECTIONS.TRANSACTIONS);
    const auditCol = db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS);
    const notifCol = db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS);

    // 1. Fetch Loan
    const loan = await loansCol.findOne({ loanNumber: loanNumber.trim() });
    if (!loan) {
      throw new NotFoundError(`Loan ${loanNumber} was not found.`);
    }

    if (loan.applicant.toLowerCase() !== userEmail.toLowerCase()) {
      throw new ForbiddenError("Access denied. You can only pay installments for your own loans.");
    }

    if (loan.status !== "ACTIVE") {
      throw new BadRequestError(`Cannot pay installments on a loan with status ${loan.status}.`);
    }

    // 2. Fetch Repayment Installment
    const repayment = await repaymentsCol.findOne({
      loan: loan.loanNumber,
      installmentNo,
    });

    if (!repayment) {
      throw new NotFoundError(`Installment #${installmentNo} for loan ${loanNumber} was not found.`);
    }

    if (repayment.status === "PAID") {
      throw new BadRequestError(`Installment #${installmentNo} has already been paid.`);
    }

    // Pre-check sequential payment requirement
    if (installmentNo > 1) {
      const priorUnpaid = await repaymentsCol.findOne(
        {
          loan: loan.loanNumber,
          installmentNo: { $lt: installmentNo },
          status: { $ne: "PAID" },
        },
        { sort: { installmentNo: 1 } }
      );

      if (priorUnpaid) {
        throw new BadRequestError(
          `Cannot pay installment #${installmentNo}. Preceding installment #${priorUnpaid.installmentNo} must be paid first. Loans must be repaid sequentially.`
        );
      }
    }

    // 3. Verify PIN
    await PinService.verifyTransactionPin(userEmail, pin);

    // 4. Validate Payment Account
    const debitAccountNumber = paymentAccount || loan.account;
    const debitAccount = await AccountService.validateAccountOwnership(
      debitAccountNumber,
      userEmail,
      "customer"
    );
    AccountService.validateAccountStatus(debitAccount);

    const available = debitAccount.balance - debitAccount.minBalance;
    if (repayment.amountDue > available) {
      throw new BadRequestError(
        `Insufficient available funds to pay installment. Required: ৳${repayment.amountDue.toLocaleString()}, Available: ৳${Math.max(0, available).toLocaleString()}.`
      );
    }

    // 5. Atomic MongoDB Execution
    const client = await clientPromise;
    const session = client.startSession();

    let completedRepayment: DbRepayment | null = null;
    let repaymentTx: DbTransaction | null = null;
    let newRemainingBalance: number = loan.remainingBalance ?? loan.totalPayable;
    const now = new Date();
    const txId = TransactionService.generateTransactionId(now);

    try {
      await session.withTransaction(async () => {
        // Step A: Enforce sequential repayment inside atomic session
        if (installmentNo > 1) {
          const unpaidPreceding = await repaymentsCol.findOne(
            {
              loan: loan.loanNumber,
              installmentNo: { $lt: installmentNo },
              status: { $ne: "PAID" },
            },
            { session, sort: { installmentNo: 1 } }
          );

          if (unpaidPreceding) {
            throw new BadRequestError(
              `Cannot pay installment #${installmentNo}. Preceding installment #${unpaidPreceding.installmentNo} is still unpaid. Loans must be repaid sequentially.`
            );
          }
        }

        // Step B: Conditionally update repayment record to PAID
        const repUp = await repaymentsCol.findOneAndUpdate(
          {
            loan: loan.loanNumber,
            installmentNo,
            status: { $ne: "PAID" },
          },
          {
            $set: {
              status: "PAID",
              amountPaid: repayment.amountDue,
              paidAt: now,
              transaction: txId,
              updatedAt: now,
            },
          },
          { session, returnDocument: "after" }
        );

        if (!repUp) {
          throw new BadRequestError("Installment was already paid concurrently.");
        }
        completedRepayment = repUp;

        // Step B: Debit customer account
        const accUp = await accountsCol.findOneAndUpdate(
          {
            accountNumber: debitAccountNumber,
            status: "ACTIVE",
            balance: { $gte: repayment.amountDue + debitAccount.minBalance },
          },
          {
            $inc: { balance: -repayment.amountDue },
            $set: { updatedAt: now },
          },
          { session, returnDocument: "after" }
        );

        if (!accUp) {
          throw new BadRequestError("Insufficient funds or account status changed during transaction.");
        }

        // Step C: Update Loan record
        newRemainingBalance = Math.max(
          0,
          (loan.remainingBalance ?? loan.totalPayable) - repayment.amountDue
        );
        const newPaidInstallments = (loan.paidInstallments || 0) + 1;
        const isLoanFullyRepaid = newPaidInstallments >= loan.durationMonths || newRemainingBalance <= 0;

        // Find next due date if any remain
        const nextInstallment = await repaymentsCol.findOne(
          {
            loan: loan.loanNumber,
            installmentNo: { $gt: installmentNo },
            status: { $ne: "PAID" },
          },
          { sort: { installmentNo: 1 }, session }
        );

        await loansCol.updateOne(
          { loanNumber: loan.loanNumber },
          {
            $set: {
              paidInstallments: newPaidInstallments,
              remainingBalance: newRemainingBalance,
              status: isLoanFullyRepaid ? "COMPLETED" : "ACTIVE",
              nextDueDate: nextInstallment ? nextInstallment.dueDate : undefined,
              updatedAt: now,
            },
          },
          { session }
        );

        // Step D: Create LOAN_REPAYMENT transaction record
        repaymentTx = {
          transactionId: txId,
          type: "LOAN_REPAYMENT",
          status: "COMPLETED",
          senderAccount: debitAccountNumber,
          amount: repayment.amountDue,
          fee: 0,
          description: `Loan repayment - ${loan.loanNumber} installment ${installmentNo}/${loan.durationMonths}`,
          initiatedBy: userEmail.toLowerCase(),
          loanId: loan.loanNumber,
          installmentNo,
          senderBalanceAfter: accUp.balance,
          createdAt: now,
          updatedAt: now,
        };
        await txCol.insertOne(repaymentTx, { session });

        // Step E: Audit Log
        await auditCol.insertOne(
          {
            performedBy: userEmail.toLowerCase(),
            role: "CUSTOMER",
            action: "LOAN_INSTALLMENT_PAID",
            targetType: "Loan",
            target: loan.loanNumber,
            description: `Paid installment #${installmentNo} of ৳${repayment.amountDue.toLocaleString()} for loan ${loan.loanNumber}`,
            metadata: {
              loanNumber: loan.loanNumber,
              installmentNo,
              amount: repayment.amountDue,
              transactionId: txId,
              isFullyRepaid: isLoanFullyRepaid,
            },
            createdAt: now,
          },
          { session }
        );

        // Step F: Notification
        await notifCol.insertOne(
          {
            type: "LOAN_INSTALLMENT_PAID",
            user: userEmail.toLowerCase(),
            title: isLoanFullyRepaid ? "Loan Fully Repaid!" : "Installment Payment Successful",
            message: isLoanFullyRepaid
              ? `Congratulations! Your ${loan.type} loan ${loan.loanNumber} has been fully paid off.`
              : `Installment #${installmentNo} of ৳${repayment.amountDue.toLocaleString()} has been paid successfully. Remaining balance: ৳${newRemainingBalance.toLocaleString()}.`,
            relatedModel: "Loan",
            relatedId: loan.loanNumber,
            read: false,
            createdAt: now,
            updatedAt: now,
          },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    if (!completedRepayment || !repaymentTx) {
      throw new BadRequestError("Failed to process installment payment.");
    }

    return {
      repayment: completedRepayment,
      transaction: repaymentTx,
      remainingBalance: newRemainingBalance,
    };
  }

  /**
   * Retrieves loan by loanNumber with authorization checks.
   */
  static async getLoanByNumber(
    loanNumber: string,
    userEmail: string,
    userRole: UserRole
  ): Promise<DbLoan> {
    const db = await getDatabase();
    const loan = await db
      .collection<DbLoan>(COLLECTIONS.LOANS)
      .findOne({ loanNumber: loanNumber.trim() });

    if (!loan) {
      throw new NotFoundError(`Loan ${loanNumber} was not found.`);
    }

    if (userRole === "customer" && loan.applicant.toLowerCase() !== userEmail.toLowerCase()) {
      throw new ForbiddenError("Access denied. You can only view your own loans.");
    }

    // Hide staff notes from customer view
    if (userRole === "customer") {
      delete loan.staffNotes;
    }

    return loan;
  }

  /**
   * Lists loans with role-based filtering and pagination.
   */
  static async listLoans(
    userEmail: string,
    userRole: UserRole,
    query: {
      status?: LoanStatus;
      type?: LoanType;
      applicant?: string;
      page?: number;
      limit?: number;
    } = {}
  ) {
    const db = await getDatabase();
    const collection = db.collection<DbLoan>(COLLECTIONS.LOANS);
    const filter: Record<string, unknown> = {};

    if (userRole === "customer") {
      filter.applicant = userEmail.toLowerCase();
    } else {
      if (query.applicant) {
        filter.applicant = query.applicant.toLowerCase().trim();
      }
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.type) {
      filter.type = query.type;
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const [loans, total] = await Promise.all([
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    // Strip internal notes if customer
    if (userRole === "customer") {
      for (const l of loans) {
        delete l.staffNotes;
      }
    }

    return {
      loans,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieves the full repayment schedule for a loan.
   */
  static async getLoanRepayments(
    loanNumber: string,
    userEmail: string,
    userRole: UserRole
  ): Promise<DbRepayment[]> {
    // Check permission to view loan first
    await this.getLoanByNumber(loanNumber, userEmail, userRole);

    const db = await getDatabase();
    return db
      .collection<DbRepayment>(COLLECTIONS.REPAYMENTS)
      .find({ loan: loanNumber.trim() })
      .sort({ installmentNo: 1 })
      .toArray();
  }
}
