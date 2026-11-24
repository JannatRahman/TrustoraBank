import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { type DbTransaction, type DbBankAccount } from "@/types";

export interface StatementPdfOptions {
  customerName: string;
  customerEmail: string;
  account?: DbBankAccount | null;
  transactions: DbTransaction[];
  startDate?: string;
  endDate?: string;
}

export class StatementService {
  /**
   * Generates a professional multi-page PDF transaction statement using pdf-lib.
   */
  static async generateStatementPdf(options: StatementPdfOptions): Promise<Uint8Array> {
    const {
      customerName,
      customerEmail,
      account,
      transactions,
      startDate,
      endDate,
    } = options;

    const pdfDoc = await PDFDocument.create();
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const margin = 50;
    const pageWidth = 595.28; // Standard A4 width in pt
    const pageHeight = 841.89; // Standard A4 height in pt

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    // Helper: draw brand header
    const drawHeader = (currentPage: typeof page, pageNum: number, totalPagesPlaceholder = "") => {
      // Top Navy Banner Accent
      currentPage.drawRectangle({
        x: 0,
        y: pageHeight - 8,
        width: pageWidth,
        height: 8,
        color: rgb(0.067, 0.176, 0.306), // #112D4E
      });

      // Header text
      currentPage.drawText("TRUSTORA BANK", {
        x: margin,
        y: pageHeight - 40,
        size: 16,
        font: fontBold,
        color: rgb(0.067, 0.176, 0.306),
      });

      currentPage.drawText("Official Account Statement", {
        x: margin,
        y: pageHeight - 55,
        size: 9,
        font: fontRegular,
        color: rgb(0.42, 0.45, 0.5),
      });

      currentPage.drawText(`Page ${pageNum}`, {
        x: pageWidth - margin - 40,
        y: pageHeight - 40,
        size: 8,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.5),
      });
    };

    drawHeader(page, 1);
    y = pageHeight - 85;

    // Customer & Statement Info Box
    page.drawRectangle({
      x: margin,
      y: y - 75,
      width: pageWidth - 2 * margin,
      height: 75,
      color: rgb(0.976, 0.969, 0.969), // #F9F7F7
      borderColor: rgb(0.859, 0.886, 0.937), // #DBE2EF
      borderWidth: 1,
    });

    const infoCol1X = margin + 15;
    const infoCol2X = margin + 260;

    // Col 1: Customer Details
    page.drawText("Account Holder:", { x: infoCol1X, y: y - 20, size: 8, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(customerName || "Valued Customer", { x: infoCol1X, y: y - 32, size: 10, font: fontBold, color: rgb(0.067, 0.176, 0.306) });
    page.drawText(customerEmail, { x: infoCol1X, y: y - 44, size: 8, font: fontRegular, color: rgb(0.25, 0.45, 0.69) });

    if (account) {
      page.drawText(`Account: ${account.accountNumber} (${account.type})`, {
        x: infoCol1X,
        y: y - 58,
        size: 8,
        font: fontRegular,
        color: rgb(0.2, 0.2, 0.2),
      });
    } else {
      page.drawText("Statement Scope: All Linked Accounts", {
        x: infoCol1X,
        y: y - 58,
        size: 8,
        font: fontRegular,
        color: rgb(0.2, 0.2, 0.2),
      });
    }

    // Col 2: Statement Period & Date
    const periodStr = `${startDate || "Account Inception"} to ${endDate || "Present"}`;
    page.drawText("Statement Period:", { x: infoCol2X, y: y - 20, size: 8, font: fontRegular, color: rgb(0.4, 0.4, 0.4) });
    page.drawText(periodStr, { x: infoCol2X, y: y - 32, size: 9, font: fontBold, color: rgb(0.067, 0.176, 0.306) });
    page.drawText(`Generated on: ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`, {
      x: infoCol2X,
      y: y - 46,
      size: 8,
      font: fontRegular,
      color: rgb(0.4, 0.4, 0.4),
    });

    y -= 105;

    // Table Header
    const colX = {
      date: margin,
      id: margin + 65,
      type: margin + 180,
      description: margin + 250,
      amount: margin + 380,
      status: margin + 445,
    };

    const drawTableHeader = (p: typeof page, currY: number) => {
      p.drawRectangle({
        x: margin,
        y: currY - 18,
        width: pageWidth - 2 * margin,
        height: 18,
        color: rgb(0.94, 0.95, 0.98),
      });

      p.drawText("DATE", { x: colX.date + 4, y: currY - 13, size: 7, font: fontBold, color: rgb(0.2, 0.3, 0.4) });
      p.drawText("TRANSACTION ID", { x: colX.id, y: currY - 13, size: 7, font: fontBold, color: rgb(0.2, 0.3, 0.4) });
      p.drawText("TYPE", { x: colX.type, y: currY - 13, size: 7, font: fontBold, color: rgb(0.2, 0.3, 0.4) });
      p.drawText("DESCRIPTION", { x: colX.description, y: currY - 13, size: 7, font: fontBold, color: rgb(0.2, 0.3, 0.4) });
      p.drawText("AMOUNT (BDT)", { x: colX.amount, y: currY - 13, size: 7, font: fontBold, color: rgb(0.2, 0.3, 0.4) });
      p.drawText("STATUS", { x: colX.status, y: currY - 13, size: 7, font: fontBold, color: rgb(0.2, 0.3, 0.4) });
    };

    drawTableHeader(page, y);
    y -= 24;

    // Empty state
    if (transactions.length === 0) {
      page.drawText("No transactions found for the specified period and filters.", {
        x: margin + 15,
        y: y - 20,
        size: 9,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.5),
      });
      y -= 40;
    } else {
      let pageNum = 1;

      for (const tx of transactions) {
        // Page overflow check (leave 60pt for footer)
        if (y < margin + 60) {
          // Add new page
          pageNum++;
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          drawHeader(page, pageNum);
          y = pageHeight - 80;
          drawTableHeader(page, y);
          y -= 24;
        }

        const dateStr = tx.createdAt
          ? new Date(tx.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })
          : "N/A";

        const txId = (tx.transactionId || String(tx._id)).slice(0, 18);
        const desc = (tx.description || tx.type).slice(0, 24);
        const amountStr = `${tx.type === "WITHDRAWAL" ? "-" : "+"}BDT ${tx.amount.toLocaleString("en-BD")}`;
        const statusStr = tx.status || "COMPLETED";

        const amountColor =
          tx.type === "WITHDRAWAL"
            ? rgb(0.7, 0.1, 0.1) // Red
            : tx.type === "DEPOSIT"
            ? rgb(0.05, 0.55, 0.25) // Green
            : rgb(0.067, 0.176, 0.306);

        // Row border
        page.drawLine({
          start: { x: margin, y: y - 5 },
          end: { x: pageWidth - margin, y: y - 5 },
          thickness: 0.5,
          color: rgb(0.9, 0.9, 0.9),
        });

        page.drawText(dateStr, { x: colX.date + 4, y, size: 7.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
        page.drawText(txId, { x: colX.id, y, size: 7.5, font: fontBold, color: rgb(0.25, 0.45, 0.69) });
        page.drawText(tx.type, { x: colX.type, y, size: 7.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });
        page.drawText(desc, { x: colX.description, y, size: 7.5, font: fontRegular, color: rgb(0.3, 0.3, 0.3) });
        page.drawText(amountStr, { x: colX.amount, y, size: 8, font: fontBold, color: amountColor });
        page.drawText(statusStr, { x: colX.status, y, size: 7.5, font: fontRegular, color: rgb(0.2, 0.2, 0.2) });

        y -= 18;
      }
    }

    // Statement Disclaimer / Security Notice at bottom
    page.drawText(
      "This document is an electronically generated statement issued by Trustora Bank. Financial transactions are recorded in BDT.",
      {
        x: margin,
        y: margin - 15,
        size: 6.5,
        font: fontRegular,
        color: rgb(0.5, 0.5, 0.5),
      }
    );

    return await pdfDoc.save();
  }

  /**
   * Generates a cleanly escaped CSV string for customer transactions.
   */
  static generateStatementCsv(transactions: DbTransaction[]): string {
    const headers = [
      "Transaction ID",
      "Date",
      "Type",
      "Description",
      "Amount (BDT)",
      "Fee (BDT)",
      "Account Number",
      "Status",
    ];

    const rows = transactions.map((tx) => {
      const date = tx.createdAt
        ? new Date(tx.createdAt).toISOString().slice(0, 10)
        : "N/A";
      const accountNum = tx.senderAccount || tx.receiverAccount || "N/A";

      return [
        tx.transactionId || String(tx._id),
        date,
        tx.type,
        tx.description || "",
        String(tx.amount),
        String(tx.fee || 0),
        accountNum,
        tx.status,
      ].map((val) => `"${String(val).replace(/"/g, '""')}"`);
    });

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }
}
