/**
 * Universal PDF Design System & Brand Palette for Friends Goal Organization
 * Primary Navy Blue: #0E3B6C
 * Accent Crimson Red: #C0262D
 */

export const PDF_THEME = {
  colors: {
    primaryNavy: "#0E3B6C",
    primaryNavyRgb: [14, 59, 108] as [number, number, number],
    primaryNavyDark: "#0A294B",
    accentRed: "#C0262D",
    accentRedRgb: [192, 38, 45] as [number, number, number],
    accentRedLight: "#FEF2F2",
    accentRedBorder: "#FECACA",
    neutralDark: "#0F172A",
    neutralBody: "#334155",
    neutralMuted: "#64748B",
    bgWhite: "#FFFFFF",
    bgSlate: "#F1F5F9",
    bgLight: "#F8FAFC",
    borderColor: "#E2E8F0",
    borderDark: "#CBD5E1",
    successGreen: "#059669",
    successBg: "#ECFDF5",
    warningAmber: "#D97706",
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  branding: {
    orgName: "Friends Goal",
    subTitle: "Financial Cooperative Society (Somiti)",
    slogan: "LET'S GO TOGETHER",
    website: "www.friendsgoal.com",
    footerDisclaimer: "This is an auto-generated document, no signature required.",
  },
} as const;

/**
 * Generate a consistent official verification hash: FG-VERIFY-<prefix>-<hash>
 */
export function generateVerificationId(prefix: string = "REC"): string {
  const cleanPrefix = (prefix || "DOC").replace(/[^A-Z0-9]/gi, "").toUpperCase().padStart(3, "0");
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `FG-VERIFY-${cleanPrefix}-${randomHex}`;
}

/**
 * Shared CSS styles for all browser-printed PDF templates
 */
export function generateUniversalPdfStyles(): string {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

    @media print {
      @page {
        size: A4 portrait;
        margin: 0;
      }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        background: #FFFFFF !important;
        padding: 0 !important;
      }
      .no-print {
        display: none !important;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #F8FAFC;
      color: #0F172A;
      display: flex;
      justify-content: center;
      padding: 24px;
    }

    .pdf-container {
      width: 210mm;
      min-height: 297mm;
      background: #FFFFFF;
      padding: 32px 36px 24px 36px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    }

    /* ── Header ── */
    .pdf-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 16px;
      border-bottom: 2.5px solid #0E3B6C;
      margin-bottom: 20px;
    }

    .pdf-logo-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .pdf-logo-circle {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: 3px solid #0E3B6C;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 900;
      color: #C0262D;
      background: #FFFFFF;
      transform: rotate(-10deg);
      box-shadow: 0 2px 4px rgba(14, 59, 108, 0.12);
    }

    .pdf-brand-title {
      font-size: 22px;
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.5px;
    }
    .pdf-brand-title .friends { color: #0E3B6C; }
    .pdf-brand-title .goal { color: #C0262D; }

    .pdf-slogan-pill {
      display: inline-block;
      margin-top: 4px;
      background: #0E3B6C;
      color: #FFFFFF;
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 1.2px;
      padding: 2.5px 8px;
      border-radius: 4px;
      text-transform: uppercase;
    }

    .pdf-doc-meta {
      text-align: right;
    }

    .pdf-doc-title {
      font-size: 17px;
      font-weight: 900;
      color: #0E3B6C;
      letter-spacing: 0.2px;
      text-transform: uppercase;
    }

    .pdf-doc-date {
      font-size: 11.5px;
      font-weight: 600;
      color: #64748B;
      margin-top: 3px;
    }

    .pdf-doc-web {
      font-size: 11px;
      font-weight: 700;
      color: #C0262D;
      text-decoration: none;
      margin-top: 2px;
      display: inline-block;
    }

    /* ── Metric Cards ── */
    .metric-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 20px;
    }

    .metric-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }

    .metric-box-label {
      font-size: 10px;
      font-weight: 800;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .metric-box-val {
      font-size: 15px;
      font-weight: 900;
      color: #0F172A;
    }

    /* ── Standard Table ── */
    .brand-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 24px;
    }

    .brand-table thead th {
      background-color: #0E3B6C;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 10px 12px;
      border: none;
    }

    .brand-table tbody tr {
      border-bottom: 1px solid #E2E8F0;
    }

    .brand-table tbody tr:nth-child(even) {
      background-color: #F8FAFC;
    }

    .brand-table tbody td {
      padding: 9px 12px;
      font-size: 11.5px;
      color: #334155;
    }

    /* ── Verification Bar ── */
    .verification-bar {
      margin-top: 18px;
      padding: 9px 16px;
      background: #F8FAFC;
      border: 1px dashed #0E3B6C;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .verification-badge {
      background: #0E3B6C;
      color: #FFFFFF;
      font-size: 9.5px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
    }

    .verification-id {
      font-family: monospace;
      font-weight: 700;
      font-size: 12px;
      color: #1E293B;
      margin-left: 8px;
    }

    .verification-status {
      font-size: 11px;
      font-weight: 700;
      color: #059669;
    }

    .footer-note {
      font-size: 11px;
      font-weight: 600;
      color: #0F172A;
      margin-top: 14px;
      margin-bottom: 12px;
    }

    /* ── Bottom Dual-Tone Accent Bar ── */
    .bottom-banner {
      height: 18px;
      display: flex;
      position: relative;
      overflow: hidden;
      margin-left: -36px;
      margin-right: -36px;
      margin-bottom: -24px;
    }

    .banner-red {
      background-color: #C0262D;
      width: 53%;
      height: 100%;
      clip-path: polygon(0 0, 100% 0, 94% 100%, 0 100%);
    }

    .banner-blue {
      background-color: #0E3B6C;
      width: 49%;
      height: 100%;
      margin-left: -2%;
      clip-path: polygon(6% 0, 100% 0, 100% 100%, 0 100%);
    }
  `;
}

/**
 * Generate standardized Header HTML
 */
export function generateBrandHeaderHtml(options: {
  title: string;
  date?: string;
  website?: string;
}): string {
  const currentDate =
    options.date ||
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const web = options.website || PDF_THEME.branding.website;

  return `
    <div class="pdf-header">
      <div class="pdf-logo-group">
        <div class="pdf-logo-circle">FG</div>
        <div>
          <div class="pdf-brand-title">
            <span class="friends">Friends</span> <span class="goal">Goal</span>
          </div>
          <div class="pdf-slogan-pill">${PDF_THEME.branding.slogan}</div>
        </div>
      </div>
      <div class="pdf-doc-meta">
        <div class="pdf-doc-title">${options.title}</div>
        <div class="pdf-doc-date">Date: ${currentDate}</div>
        <div class="pdf-doc-web">${web}</div>
      </div>
    </div>
  `;
}

/**
 * Generate standardized Footer HTML with disclaimer and dual-color diagonal accent bar
 */
export function generateBrandFooterHtml(options?: {
  verificationId?: string;
  verificationStatus?: string;
}): string {
  const vId = options?.verificationId || generateVerificationId("FG");
  const vStatus = options?.verificationStatus || "Valid Official System Generated Document";

  return `
    <div>
      <div class="verification-bar">
        <div>
          <span class="verification-badge">VERIFIED AUTHENTIC</span>
          <span class="verification-id">UNIQUE ID: ${vId}</span>
        </div>
        <div class="verification-status">✓ ${vStatus}</div>
      </div>
      <div class="footer-note">${PDF_THEME.branding.footerDisclaimer}</div>
      <div class="bottom-banner">
        <div class="banner-red"></div>
        <div class="banner-blue"></div>
      </div>
    </div>
  `;
}
