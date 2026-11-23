/**
 * Trustora Bank - Core Database & Domain Types
 * Strict types representing MongoDB collections and documents
 */

export const COLLECTIONS = {
  USER: "user",
  SESSION: "session",
  ACCOUNT: "account",
  VERIFICATION: "verification",
  ACCOUNTS: "Accounts",
  TRANSACTIONS: "Transactions",
  LOANS: "Loans",
  REPAYMENTS: "Repayments",
  REQUESTS: "Requests",
  NOTIFICATIONS: "Notifications",
  TRANSACTION_PINS: "transactionPins",
  AUDIT_LOGS: "auditLogs",
  BANK_SETTINGS: "bankSettings",
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

// User & Auth
export type UserRole = "admin" | "banking-staff" | "customer";
export type CustomerStatus = "ACTIVE" | "DEACTIVATED" | "BLOCKED";
export type KycStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type KycDocumentType = "NATIONAL_ID" | "PASSPORT" | "DRIVING_LICENSE";

export interface DbUser {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  role: UserRole;
  status?: CustomerStatus;
  statusReason?: string;
  statusUpdatedBy?: string;
  statusUpdatedAt?: string | Date;
  kycStatus?: KycStatus;
  kycDocumentType?: KycDocumentType;
  kycDocumentNumber?: string;
  kycSubmittedAt?: string | Date;
  kycReviewedBy?: string;
  kycReviewedAt?: string | Date;
  kycRejectionReason?: string;
  image?: string | null;
  phone?: string;
  address?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// Bank Account
export type AccountType = "SAVINGS" | "CURRENT" | "BUSINESS";
export type AccountStatus = "ACTIVE" | "FROZEN" | "CLOSED";

export interface DbBankAccount {
  _id?: string;
  owner: string; // User email
  accountNumber: string;
  type: AccountType;
  openingBalance: number;
  balance: number;
  status: AccountStatus;
  dailyLimit: number;
  maxTransaction: number;
  minBalance: number;
  createdBy: string; // Staff/Admin email
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Transaction
export type TransactionType =
  | "TRANSFER"
  | "DEPOSIT"
  | "WITHDRAWAL"
  | "LOAN_DISBURSEMENT"
  | "LOAN_REPAYMENT";

export type TransactionStatus =
  | "COMPLETED"
  | "PENDING"
  | "FAILED"
  | "REJECTED"
  | "REVERSED";

export interface DbTransaction {
  _id?: string;
  transactionId: string;
  fee: number;
  status: TransactionStatus;
  type: TransactionType;
  senderAccount?: string;
  receiverAccount?: string;
  amount: number;
  description: string;
  initiatedBy: string; // User/Staff/Admin email
  processedBy?: string;
  requestId?: string;
  loanId?: string;
  installmentNo?: number;
  senderBalanceAfter?: number;
  receiverBalanceAfter?: number;
  idempotencyKey?: string;
  flagged?: boolean;
  flagReason?: string;
  flaggedBy?: string;
  flaggedAt?: string | Date;
  riskLevel?: "LOW" | "MEDIUM" | "HIGH";
  reviewStatus?: "PENDING_REVIEW" | "REVIEWED" | "CLEARED" | "ESCALATED" | "REVERSED";
  reviewedBy?: string;
  reviewedAt?: string | Date;
  internalNotes?: string;
  reversedAt?: string | Date;
  reversedBy?: string;
  reversalReason?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Loan
export type LoanType =
  | "PERSONAL"
  | "HOME"
  | "BUSINESS"
  | "EDUCATION"
  | "CAR";

export type LoanStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "FORWARDED_TO_ADMIN"
  | "APPROVED"
  | "ACTIVE"
  | "COMPLETED"
  | "REJECTED";

export interface LoanStaffNote {
  staff: string;
  note: string;
  createdAt: string | Date;
}

export interface DbLoan {
  _id?: string;
  loanNumber: string;
  applicant: string; // User email
  account: string; // Account number
  type: LoanType;
  amount: number;
  durationMonths: number;
  interestRate: number;
  emi: number;
  totalPayable: number;
  monthlyIncome: number;
  employmentStatus: string;
  description: string;
  status: LoanStatus;
  staffNotes?: LoanStaffNote[];
  forwardedBy?: string;
  forwardedAt?: string | Date;
  reviewedBy?: string;
  reviewedAt?: string | Date;
  approvedBy?: string;
  approvedAt?: string | Date;
  disbursedAt?: string | Date;
  disbursementTransaction?: string;
  paidInstallments?: number;
  remainingBalance?: number;
  nextDueDate?: string | Date;
  rejectedBy?: string;
  rejectedAt?: string | Date;
  rejectionReason?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Repayment
export type RepaymentStatus = "PAID" | "PENDING" | "OVERDUE";

export interface DbRepayment {
  _id?: string;
  repaymentId: string;
  loan: string; // Loan Number
  customer: string; // User email
  account: string; // Account number
  installmentNo: number;
  dueDate: string | Date;
  amountDue: number;
  principalAmount: number;
  interestAmount: number;
  amountPaid: number;
  status: RepaymentStatus;
  transaction?: string; // Transaction ID
  paidAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Request (Deposit/Withdrawal Requests)
export type RequestType = "WITHDRAWAL" | "DEPOSIT";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface DbRequest {
  _id?: string;
  requestId: string;
  user: string; // User email
  account: string; // Account number
  type: RequestType;
  amount: number;
  description: string;
  status: RequestStatus;
  requestedAt: string | Date;
  reviewedBy?: string;
  reviewedAt?: string | Date;
  rejectionReason?: string;
  transaction?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Transaction PIN
export interface DbTransactionPin {
  _id?: string;
  user: string; // User email
  pinHash: string; // bcrypt hash
  failedAttempts: number;
  lockedUntil?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Audit Log
export interface DbAuditLog {
  _id?: string;
  performedBy: string; // User email
  role: "STAFF" | "ADMIN" | "SYSTEM" | "CUSTOMER";
  action: string;
  targetType: string;
  target: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string | Date;
}

// Bank Settings
export interface DbBankSettings {
  _id?: string;
  key: "bank-settings";
  dailyTransferLimit: number;
  maxSingleTransaction: number;
  minAccountBalance: number;
  defaultTransactionFee: {
    percent: number;
    minimum: number;
  };
  twoFactorThreshold: number;
  loanInterestRates: {
    PERSONAL: number;
    HOME: number;
    CAR: number;
    EDUCATION: number;
    BUSINESS: number;
  };
  updatedBy: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Notification
export interface DbNotification {
  _id?: string;
  type: string;
  user: string; // User email
  title: string;
  message: string;
  relatedModel?: string;
  relatedId?: string;
  read: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}
