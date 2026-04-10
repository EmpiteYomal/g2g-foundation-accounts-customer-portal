"use client";

/**
 * Template: Password Reset
 * Trigger: Sent when a user requests a password reset.
 * Recipients: The user who requested the reset
 */

type Props = {
  recipientName?: string;
  resetUrl?: string;
  expiryMinutes?: number;
};

export function PasswordResetEmail({
  recipientName = "Jane Smith",
  resetUrl = "https://accounts.goodstack.io/reset-password?token=abc123",
  expiryMinutes = 30,
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
                          <rect x="3" y="11" width="18" height="11" rx="2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="16" r="1.5" fill="white"/>
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
                        Password Reset
                      </p>
                      <h1 style={{
                        margin: 0,
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#ffffff",
                        lineHeight: 1.25,
                      }}>
                        Reset your password
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
                      <p style={{ margin: "0 0 32px", fontSize: 15, color: "#4b5563", lineHeight: 1.7 }}>
                        We received a request to reset the password for your Goodstack Foundation Account. Click the button below to choose a new password.
                      </p>

                      {/* CTA */}
                      <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 32 }}>
                        <tbody>
                          <tr>
                            <td style={{ textAlign: "center" }}>
                              <a
                                href={resetUrl}
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
                                Reset my password →
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Expiry + fallback link */}
                      <table width="100%" cellPadding={0} cellSpacing={0} style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        marginBottom: 28,
                      }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: "18px 24px" }}>
                              <p style={{ margin: "0 0 6px", fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                                This link expires in <strong>{expiryMinutes} minutes</strong>. If the button doesn&apos;t work, copy and paste the URL below into your browser:
                              </p>
                              <p style={{
                                margin: 0,
                                fontSize: 11,
                                color: "#f97316",
                                wordBreak: "break-all",
                                lineHeight: 1.6,
                              }}>
                                {resetUrl}
                              </p>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* Security notice */}
                      <table width="100%" cellPadding={0} cellSpacing={0} style={{
                        backgroundColor: "#fef3c7",
                        border: "1px solid #fde68a",
                        borderRadius: 12,
                      }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: "16px 20px" }}>
                              <table cellPadding={0} cellSpacing={0}>
                                <tbody>
                                  <tr>
                                    <td style={{ verticalAlign: "top", paddingRight: 10 }}>
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        <line x1="12" y1="9" x2="12" y2="13" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="12" y1="17" x2="12.01" y2="17" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/>
                                      </svg>
                                    </td>
                                    <td>
                                      <p style={{ margin: 0, fontSize: 13, color: "#92400e", lineHeight: 1.6 }}>
                                        <strong>Didn&apos;t request this?</strong> If you didn&apos;t ask to reset your password, you can safely ignore this email. Your password will not change.
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
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
                        Need help? Contact us at{" "}
                        <a href="mailto:support@goodstack.io" style={{ color: "#f97316", textDecoration: "none" }}>
                          support@goodstack.io
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
