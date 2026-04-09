/**
 * Generates and downloads an ABA (Australian Banking Association) file
 * for a single processed fund transfer to a charity.
 *
 * ABA file spec: DE/NAB standard (fixed-width 120-char records)
 * Record types: 0 = header, 1 = detail, 7 = file total
 */

function pad(str: string, len: number, char = " ", right = false): string {
  const s = String(str).slice(0, len);
  const padding = char.repeat(len - s.length);
  return right ? padding + s : s + padding;
}

function padRight(str: string, len: number, char = " "): string {
  return pad(str, len, char, true);
}

function formatABADate(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  return `${dd}${mm}${yy}`;
}

function centsStr(amount: number, len: number): string {
  const cents = Math.round(amount * 100);
  return String(cents).padStart(len, "0");
}

export type ABATransactionParams = {
  /** The giving package ID e.g. GIVING-221 */
  packageId: string;
  /** Charity name */
  charityName: string;
  /** Net amount transferred (AUD) */
  netAmount: number;
  /** Charity BSB (use a placeholder if unknown) */
  charityBsb?: string;
  /** Charity account number (placeholder if unknown) */
  charityAccount?: string;
};

export function downloadABA(params: ABATransactionParams): void {
  const {
    packageId,
    charityName,
    netAmount,
    charityBsb = "032-085",      // placeholder BSB
    charityAccount = "123456789", // placeholder account
  } = params;

  const date = formatABADate();
  const description = pad(`G2G ${packageId}`, 12);

  // ── Record 0: File header (120 chars) ────────────────────────────────────────
  // pos 1      : record type "0"
  // pos 2-18   : BSB + account (blank for header)
  // pos 19-20  : reserved (blank)
  // pos 21-22  : sequence number
  // pos 23-25  : bank abbreviation
  // pos 26-32  : reserved
  // pos 33-58  : user name (26 chars)
  // pos 59-64  : user ID (APCA number, 6 digits)
  // pos 65-76  : file description (12 chars)
  // pos 77-82  : date (DDMMYY)
  // pos 83-86  : time (blank — optional)
  // pos 87-120 : reserved blanks
  const header =
    "0" +
    "      " +               // BSB (blank for header)
    "         " +            // account (blank)
    "  " +                   // reserved
    "01" +                   // sequence
    "GST" +                  // bank abbreviation (Goodstack)
    "       " +              // reserved
    pad("GOODSTACK FA", 26) +
    "977777" +               // APCA user ID (placeholder)
    description +
    date +
    "    " +                 // time (optional)
    " ".repeat(36);          // reserved

  // ── Record 1: Detail transaction (120 chars) ──────────────────────────────────
  // pos 1      : record type "1"
  // pos 2-8    : BSB "032-085"
  // pos 9-17   : account number (right-justified, blank-filled)
  // pos 18     : indicator (blank = standard, W/X/Y/Z = withholding)
  // pos 19-20  : transaction code "50" = credit
  // pos 21-28  : amount in cents (8 digits)
  // pos 29-54  : title of account (26 chars)
  // pos 55-79  : lodgement ref (18 chars — right filled)
  // pos 80-87  : trace BSB
  // pos 88-96  : trace account
  // pos 97-112 : remitter name (16 chars)
  // pos 113-120: withholding tax (8 zeros if none)
  const bsbFormatted = charityBsb.replace(/[^0-9]/g, "").slice(0, 6);
  const bsbStr = `${bsbFormatted.slice(0, 3)}-${bsbFormatted.slice(3)}`;
  const acctStr = padRight(charityAccount.replace(/\s/g, "").slice(0, 9), 9);
  const amountStr = centsStr(netAmount, 8);
  const accountTitle = pad(charityName.slice(0, 26), 26);
  const lodgementRef = pad(packageId.slice(0, 18), 18);
  const traceBsb = "032-085";
  const traceAcct = padRight("999999999", 9);
  const remitter = pad("GOODSTACK FA", 16);

  const detail =
    "1" +
    bsbStr +
    acctStr +
    " " +      // indicator
    "50" +     // credit transaction code
    amountStr +
    accountTitle +
    lodgementRef +
    traceBsb +
    traceAcct +
    remitter +
    "00000000"; // withholding tax (zero)

  // ── Record 7: File total (120 chars) ─────────────────────────────────────────
  // pos 1      : record type "7"
  // pos 2-8    : "999-999"
  // pos 9-17   : blank
  // pos 18-26  : net total (9 digits, right-justified)
  // pos 27-35  : credit total (9 digits)
  // pos 36-44  : debit total (9 digits, zeros)
  // pos 45-54  : reserved blanks
  // pos 55-57  : count of detail records (right-justified, space-filled)
  // pos 58-120 : reserved blanks
  const netTotalStr = centsStr(netAmount, 10);
  const creditTotalStr = centsStr(netAmount, 10);
  const debitTotalStr = "0000000000";
  const recordCount = padRight("1", 6);

  const trailer =
    "7" +
    "999-999" +
    "         " +      // blank account
    netTotalStr +
    creditTotalStr +
    debitTotalStr +
    " ".repeat(24) +   // reserved
    recordCount +
    " ".repeat(40);    // reserved

  const content = [header, detail, trailer].join("\r\n") + "\r\n";

  // ── Trigger download ──────────────────────────────────────────────────────────
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${packageId}-${charityName.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "")}.aba`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
