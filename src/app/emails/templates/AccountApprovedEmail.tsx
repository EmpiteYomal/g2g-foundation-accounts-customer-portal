"use client";

/**
 * Template: Account Approved
 * Trigger: Sent when G2G staff approve a Foundation Account application.
 * Recipients: Account Founder (primary trustee)
 */

type Props = {
  founderName?: string;
  orgName?: string;
  accountNumber?: string;
  approvedDate?: string;
  dashboardUrl?: string;
};

export function AccountApprovedEmail({
  founderName = "Jane Smith",
  orgName = "KFC Australia Pty Ltd",
  accountNumber = "GFA-00421",
  approvedDate = "10 April 2026",
  dashboardUrl = "https://accounts.goodstack.io/dashboard",
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
      {/* Outer wrapper */}
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
                      <img
                        src="/logo.svg"
                        alt="Goodstack Foundation Accounts"
                        height={36}
                        style={{ display: "block" }}
                      />
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
                      {/* Checkmark icon */}
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
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M6 16L13 23L26 9"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
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
                        Foundation Account
                      </p>
                      <h1 style={{
                        margin: 0,
                        fontSize: 30,
                        fontWeight: 700,
                        color: "#ffffff",
                        lineHeight: 1.2,
                      }}>
                        Your account is approved!
                      </h1>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* ── Body ── */}
              <table width="100%" cellPadding={0} cellSpacing={0} style={{
                backgroundColor: "#ffffff",
              }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "40px 40px 32px" }}>

                      {/* Greeting */}
                      <p style={{ margin: "0 0 16px", fontSize: 16, color: "#111827", lineHeight: 1.6 }}>
                        Hi <strong>{founderName}</strong>,
                      </p>
                      <p style={{ margin: "0 0 24px", fontSize: 15, color: "#4b5563", lineHeight: 1.7 }}>
                        Great news — the G2G team has reviewed and approved your Foundation Account application for <strong>{orgName}</strong>. Your account is now active and ready to use.
                      </p>

                      {/* Account detail card */}
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
                                Account Details
                              </p>
                              <table width="100%" cellPadding={0} cellSpacing={0}>
                                <tbody>
                                  {[
                                    { label: "Organisation", value: orgName },
                                    { label: "Account Number", value: accountNumber },
                                    { label: "Account Holder", value: founderName },
                                    { label: "Approval Date", value: approvedDate },
                                  ].map(({ label, value }) => (
                                    <tr key={label}>
                                      <td style={{ padding: "5px 0", fontSize: 13, color: "#6b7280", width: "40%" }}>{label}</td>
                                      <td style={{ padding: "5px 0", fontSize: 13, fontWeight: 600, color: "#111827" }}>{value}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* What's next */}
                      <p style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111827" }}>
                        What you can do now
                      </p>

                      {[
                        {
                          num: "1",
                          title: "Access your dashboard",
                          desc: "View your Foundation Account balance, transaction history, and giving reports.",
                        },
                        {
                          num: "2",
                          title: "Invite your team",
                          desc: "Add additional trustees and report viewers to your Foundation Account.",
                        },
                        {
                          num: "3",
                          title: "Donate to charities",
                          desc: "Browse G2G-verified charities and submit fund disbursements for trustee approval.",
                        },
                      ].map((step) => (
                        <table key={step.num} width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 12 }}>
                          <tbody>
                            <tr>
                              <td style={{ verticalAlign: "top", width: 36 }}>
                                <div style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: "50%",
                                  backgroundColor: "#f97316",
                                  color: "#fff",
                                  fontSize: 12,
                                  fontWeight: 700,
                                  textAlign: "center",
                                  lineHeight: "26px",
                                }}>
                                  {step.num}
                                </div>
                              </td>
                              <td style={{ verticalAlign: "top", paddingLeft: 8 }}>
                                <p style={{ margin: "2px 0 2px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{step.title}</p>
                                <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{step.desc}</p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      ))}

                      {/* CTA button */}
                      <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: 32, marginBottom: 8 }}>
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
                                Go to your dashboard →
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
                        Need help getting started? Contact our support team at{" "}
                        <a href="mailto:support@goodstack.io" style={{ color: "#f97316", textDecoration: "none" }}>
                          support@goodstack.io
                        </a>{" "}
                        or visit our{" "}
                        <a href="#" style={{ color: "#f97316", textDecoration: "none" }}>
                          Help Centre
                        </a>.
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
