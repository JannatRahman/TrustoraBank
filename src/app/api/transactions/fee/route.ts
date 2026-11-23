import { NextRequest, NextResponse } from "next/server";
import { requireAuth, handleApiError } from "@/server/auth";
import { SettingsService } from "@/services/settingsService";
import { AccountService } from "@/services/accountService";
import { validateAmount, validateAccountNumber } from "@/validators/accountValidator";

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const searchParams = request.nextUrl.searchParams;

    const rawAmount = searchParams.get("amount");
    const senderAccount = searchParams.get("senderAccount");
    const receiverAccount = searchParams.get("receiverAccount");

    const amount = validateAmount(rawAmount);

    let isOwnAccount = false;
    if (senderAccount && receiverAccount) {
      const validSender = validateAccountNumber(senderAccount);
      const validReceiver = validateAccountNumber(receiverAccount);

      const [senderDoc, receiverDoc] = await Promise.all([
        AccountService.getAccountByNumber(validSender),
        AccountService.getAccountByNumber(validReceiver),
      ]);

      if (senderDoc && receiverDoc) {
        isOwnAccount = senderDoc.owner.toLowerCase() === receiverDoc.owner.toLowerCase();
      }
    }

    const fee = await SettingsService.calculateTransferFee(amount, isOwnAccount);

    return NextResponse.json({
      success: true,
      data: {
        amount,
        fee,
        totalDebit: amount + fee,
        isOwnAccount,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
