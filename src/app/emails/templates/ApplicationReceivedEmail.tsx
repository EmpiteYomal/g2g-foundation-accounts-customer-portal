"use client";

/**
 * Template: Application Received
 * Trigger: Sent immediately after a user completes the onboarding flow and submits their application.
 * Recipients: Account Founder (primary trustee)
 */

type Props = {
  founderName?: string;
  orgName?: string;
  submittedDate?: string;
  referenceNumber?: string;
};

export function ApplicationReceivedEmail({
  founderName = "Jane Smith",
  orgName = "KFC Australia Pty Ltd",
  submittedDate = "10 April 2026",
  referenceNumber = "APP-00842",
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
                      {/* Inbox icon */}
                      <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        backgroundColor: "rgba(255,255,255,0.12)",
                        margin: "0 auto 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 8C4 6.9 4.9 6 6 6H24C25.1 6 26 6.9 26 8V20C26 21.1 25.1 22 24 22H6C4.9 22 4 21.1 4 20V8Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M4 9L15 16L26 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                        Application Submitted
                      </p>
                      <h1 style={{
                        margin: 0,
                        fontSize: 28,
                        fontWeight: 700,
                        color: "#ffffff",
                        lineHeight: 1.25,
                      }}>
                        We&apos;ve received your application
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
                        Hi <strong>{founderName}</strong>,
                      </p>
                      <p style={{ margin: "0 0 24px", fontSize: 15, color: "#4b5563", lineHeight: 1.7 }}>
                        Thank you for applying for a Goodstack Foundation Account for <strong>{orgName}</strong>. Our team will review your application and documents — we&apos;ll be in touch within <strong>1–2 business days</strong>.
                      </p>

                      {/* Reference card */}
                      <table width="100%" cellPadding={0} cellSpacing={0} style={{
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 12,
                        marginBottom: 32,
                      }}>
                        <tbody>
                          <tr>
                            <td style={{ padding: "20px 24px" }}>
                              <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#64748b" }}>
                                Submission Summary
                              </p>
                              <table width="100%" cellPadding={0} cellSpacing={0}>
                                <tbody>
                                  {[
                                    { label: "Reference", value: referenceNumber },
                                    { label: "Organisation", value: orgName },
                                    { label: "Submitted by", value: founderName },
                                    { label: "Date submitted", value: submittedDate },
                                    { label: "Status", value: "Under Review" },
                                  ].map(({ label, value }) => (
                                    <tr key={label}>
                                      <td style={{ padding: "5px 0", fontSize: 13, color: "#6b7280", width: "40%" }}>{label}</td>
                                      <td style={{ padding: "5px 0", fontSize: 13, fontWeight: 600, color: label === "Status" ? "#d97706" : "#111827" }}>
                                        {label === "Status" ? (
                                          <span style={{
                                            display: "inline-block",
                                            backgroundColor: "#fef3c7",
                                            color: "#d97706",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            padding: "2px 8px",
                                            borderRadius: 20,
                                            border: "1px solid #fde68a",
                                          }}>
                                            {value}
                                          </span>
                                        ) : value}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* What happens next */}
                      <p style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111827" }}>
                        What happens next?
                      </p>

                      {[
                        {
                          num: "1",
                          color: "#f97316",
                          title: "Organisation review",
                          desc: "Our team will review and verify your organisation details submitted during onboarding.",
                        },
                        {
                          num: "2",
                          color: "#f97316",
                          title: "Account activation",
                          desc: "Once approved, you'll receive a confirmation email and your Foundation Account will be ready to use.",
                        },
                      ].map((step) => (
                        <table key={step.num} width="100%" cellPadding={0} cellSpacing={0} style={{ marginBottom: 14 }}>
                          <tbody>
                            <tr>
                              <td style={{ verticalAlign: "top", width: 36 }}>
                                <div style={{
                                  width: 26,
                                  height: 26,
                                  borderRadius: "50%",
                                  backgroundColor: step.color,
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

                      {/* Info box */}
                      <table width="100%" cellPadding={0} cellSpacing={0} style={{ marginTop: 28 }}>
                        <tbody>
                          <tr>
                            <td style={{
                              backgroundColor: "#eff6ff",
                              border: "1px solid #bfdbfe",
                              borderRadius: 12,
                              padding: "16px 20px",
                            }}>
                              <p style={{ margin: 0, fontSize: 13, color: "#1e40af", lineHeight: 1.6 }}>
                                <strong>Keep an eye on your inbox.</strong> We may reach out if we need any additional information about your organisation. Please quote your reference number <strong>{referenceNumber}</strong> in any correspondence.
                              </p>
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
                        Questions about your application? Contact us at{" "}
                        <a href="mailto:support@goodstack.io" style={{ color: "#f97316", textDecoration: "none" }}>
                          support@goodstack.io
                        </a>{" "}
                        and quote your reference <strong style={{ color: "#6b7280" }}>{referenceNumber}</strong>.
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
