"use client";

/**
 * Template: Disbursement Approved
 * Trigger: Sent when a trustee approves a fund disbursement to a charity.
 * Recipients: Account Founder + all account users
 */

type CharityLine = {
  charity: string;
  amount: number;
};

type Props = {
  recipientName?: string;
  approvedBy?: string;
  orgName?: string;
  packageId?: string;
  approvedDate?: string;
  totalGross?: number;
  adminFee?: number;
  netTotal?: number;
  charities?: CharityLine[];
  dashboardUrl?: string;
};

const fmt = (n: number) =>
  `$${n.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`;

export function DisbursementApprovedEmail({
  recipientName = "Jane Smith",
  approvedBy = "Jane Smith (Trustee)",
  orgName = "KFC Australia Pty Ltd",
  packageId = "GIVING-221",
  approvedDate = "10 April 2026",
  totalGross = 5000,
  adminFee = 500,
  netTotal = 4500,
  charities = [
    { charity: "Red Cross Australia", amount: 2700 },
    { charity: "Salvation Army",      amount: 1350 },
    { charity: "Beyond Blue",         amount: 450  },
  ],
  dashboardUrl = "https://accounts.goodstack.io/dashboard/disbursements",
}: Props) {
  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundColor: "#FAF9F8",
        minHeight: "100%",
        padding: "40px 16px",
      }}
    >
      <table width="100%" cellPadding={0} cellSpacing={0} style={{ maxWidth: 600, margin: "0 auto" }}>
        <tbody>
          <tr>
            <td>

              {/* ── Header ── */}
              <table width="100%" cellPadding={0} cellSpacing={0} style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px 16px 0 0",
                borderBottom: "1px solid #f0ece8",
              }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "28px 40px" }}>
                      <img src="/logo.svg" alt="Goodstack Foundation Accounts" height={36} style={{ display: "block" }} />
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── Hero banner ── */}
              <table width="100%" cellPadding={0} cellSpacing={0} style={{
                background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
              }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "48px 40px", textAlign: "center" }}>
                      <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        backgroundColor: "rgba(255,255,255,0.2)",
                        margin: "0 auto 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="m2 16 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19.5 8.5c.7-.7 1.5 1.7 0 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M20 2c0 0-1.5 2.5-1.5 4.5c0 2 1.5 2 1.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 2c0 0-1.5 2.5-1.5 4.5c0 2 1.5 2 1.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p style={{
                        margin: "0 0 8px",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.8)",
                      }}>
                        Disbursement Approved
                      </p>
                      <h1 style={{
                        margin: 0,
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#ffffff",
                        lineHeight: 1.25,
                      }}>
                        {fmt(netTotal)} sent to charities
                      </h1>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── Body ── */}
              <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#ffffff" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "40px 40px 32px" }}>

                      <p style={{ margin: "0 0 16px", fontSize: 16, color: "#111827", lineHeight: 1.6 }}>
                        Hi <strong>{recipientName}</strong>,
                      </p>
                      <p style={{ margin: "0 0 28px", fontSize: 15, color: "#4b5563", lineHeight: 1.7 }}>
                        A fund disbursement from your <strong>{orgName}</strong> Foundation Account has been approved by <strong>{approvedBy}</strong> and is now being processed.
                      </p>

                      {/* Package summary card */}
                      <table width="100%" cellPadding={0} cellSpacing={0} style={{
                        backgroundColor: "#fef7f3",
                        border: "1px solid #fed7aa",
                        borderRadius: 12,
                        marginBottom: 28,
                      }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: "20px 24px" }}>
                              <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9a3412" }}>
                                Package Summary
                              </p>
                              <table width="100%" cellPadding={0} cellSpacing={0}>
                                <tbody>
                                  {[
                                    { label: "Package ID",   value: packageId },
                                    { label: "Organisation", value: orgName },
                                    { label: "Approved by",  value: approvedBy },
                                    { label: "Date",         value: approvedDate },
                                    { label: "Gross amount", value: fmt(totalGross) },
                                    { label: "Admin fee",    value: fmt(adminFee) },
                                    { label: "Net total",    value: fmt(netTotal) },
                                  ].map(({ label, value }) => (
                                    <tr key={label}>
                                      <td style={{ padding: "5px 0", fontSize: 13, color: "#6b7280", width: "40%", borderBottom: label === "Date" ? "1px solid #fed7aa" : "none", paddingBottom: label === "Date" ? 10 : undefined, marginBottom: label === "Date" ? 6 : undefined }}>{label}</td>
                                      <td style={{
                                        padding: "5px 0",
                                        fontSize: label === "Net total" ? 15 : 13,
                                        fontWeight: label === "Net total" ? 700 : 600,
                                        color: label === "Net total" ? "#f97316" : label === "Admin fee" ? "#dc2626" : "#111827",
                                        borderBottom: label === "Date" ? "1px solid #fed7aa" : "none",
                                      }}>
                                        {label === "Admin fee" ? `−${value}` : value}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Charity breakdown */}
                      <p style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#111827" }}>
                        Charity breakdown
                      </p>

                      <table width="100%" cellPadding={0} cellSpacing={0} style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        overflow: "hidden",
                        marginBottom: 32,
                      }}>
                        <tbody>
                          {/* Table header */}
                          <tr style={{ backgroundColor: "#f9fafb" }}>
                            <td style={{ padding: "10px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b7280" }}>Charity</td>
                            <td style={{ padding: "10px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#6b7280", textAlign: "right" }}>Net Amount</td>
                          </tr>
                          {charities.map((line, i) => (
                            <tr key={i} style={{ borderTop: "1px solid #f3f4f6" }}>
                              <td style={{ padding: "12px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <div style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    backgroundColor: "#f97316",
                                    flexShrink: 0,
                                  }} />
                                  <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{line.charity}</span>
                                </div>
                              </td>
                              <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#059669", textAlign: "right" }}>
                                {fmt(line.amount)}
                              </td>
                            </tr>
                          ))}
                          {/* Total row */}
                          <tr style={{ borderTop: "2px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                            <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700, color: "#111827" }}>Total</td>
                            <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 700, color: "#f97316", textAlign: "right" }}>{fmt(netTotal)}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* CTA */}
                      <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 8 }}>
                        <tbody>
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              <a
                                href={dashboardUrl}
                                style={{
                                  display: "inline-block",
                                  backgroundColor: "#f97316",
                                  color: "#ffffff",
                                  fontSize: 15,
                                  fontWeight: 700,
                                  textDecoration: "none",
                                  padding: "14px 36px",
                                  borderRadius: 50,
                                }}
                              >
                                View disbursement →
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── Divider ── */}
              <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#ffffff" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "0 40px" }}>
                      <div style={{ height: 1, backgroundColor: "#f3f4f6" }} />
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── Support note ── */}
              <table width="100%" cellPadding={0} cellSpacing={0} style={{ backgroundColor: "#ffffff" }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "24px 40px" }}>
                      <p style={{ margin: 0, fontSize: 13, color: "#9ca3af", lineHeight: 1.6 }}>
                        Questions about this disbursement? Contact us at{" "}
                        <a href="mailto:support@goodstack.io" style={{ color: "#f97316", textDecoration: "none" }}>
                          support@goodstack.io
                        </a>{" "}
                        and quote package ID <strong style={{ color: "#6b7280" }}>{packageId}</strong>.
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── Footer ── */}
              <table width="100%" cellPadding={0} cellSpacing={0} style={{
                backgroundColor: "#f9fafb",
                borderRadius: "0 0 16px 16px",
                border: "1px solid #f0ece8",
                borderTop: "none",
              }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "24px 40px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px", fontSize: 12, color: "#9ca3af" }}>
                        Goodstack Foundation Accounts · Level 5, 55 Clarence St, Sydney NSW 2000
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                        © {new Date().getFullYear()} Goodstack Pty Ltd. All rights reserved.
                        {" · "}
                        <a href="#" style={{ color: "#9ca3af" }}>Privacy Policy</a>
                        {" · "}
                        <a href="#" style={{ color: "#9ca3af" }}>Unsubscribe</a>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
