/**
 * Money Receipt Generator & Verification Utility for Friends Goal Organization
 * Matches exact official PDF design template with unique authentic verification ID.
 */

export interface IReceiptData {
  receiptNo: string;
  amount: number;
  memberName: string;
  memberCode: string;
  date?: string;
  month?: string;
  admissionFee?: number | string;
  advanceFee?: number | string;
  othersFee?: number | string;
}

/**
 * Convert number amount to words (Bangladeshi Taka format)
 */
export function numberToWords(num: number): string {
  if (!num || isNaN(num) || num <= 0) return "Zero Taka Only";

  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertChunk(n: number): string {
    let str = "";
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + " ";
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + " ";
    }
    return str;
  }

  const integerPart = Math.floor(num);
  const decimalPart = Math.round((num - integerPart) * 100);

  let result = "";
  let n = integerPart;

  if (n >= 10000000) {
    result += convertChunk(Math.floor(n / 10000000)) + "Crore ";
    n %= 10000000;
  }
  if (n >= 100000) {
    result += convertChunk(Math.floor(n / 100000)) + "Lakh ";
    n %= 100000;
  }
  if (n >= 1000) {
    result += convertChunk(Math.floor(n / 1000)) + "Thousand ";
    n %= 1000;
  }
  if (n > 0) {
    result += convertChunk(n);
  }

  result = result.trim() + " Taka";

  if (decimalPart > 0) {
    result += " and " + convertChunk(decimalPart).trim() + " Paisa";
  }

  return result + " Only";
}

/**
 * Generate a unique verification ID to prove payment receipt authenticity
 */
export function generateVerificationId(receiptNo: string, memberCode: string, amount: number): string {
  const cleanReceipt = receiptNo.replace(/[^A-Z0-9]/gi, "").toUpperCase();
  const cleanMember = memberCode.replace(/[^A-Z0-9]/gi, "").padStart(3, "0");
  const rawSeed = `${cleanReceipt}-${cleanMember}-${amount}`;
  
  let hash = 0;
  for (let i = 0; i < rawSeed.length; i++) {
    hash = (hash << 5) - hash + rawSeed.charCodeAt(i);
    hash |= 0;
  }
  const hexHash = Math.abs(hash).toString(16).toUpperCase().padStart(6, "8F");
  
  return `FG-VERIFY-${cleanMember}-${hexHash.substring(0, 6)}`;
}

/**
 * Print / Render Money Receipt PDF view exactly matching requested design
 */
export function printMoneyReceipt(data: IReceiptData): void {
  const win = window.open("", "_blank");
  if (!win) return;

  const slNo = data.receiptNo ? data.receiptNo.replace(/^RCP-/i, "") : "732";
  const dateFormatted = data.date || new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const monthFormatted = data.month || new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const memberName = (data.memberName || "MD MASUD RANA").toUpperCase();
  const idNo = (data.memberCode || "022").padStart(3, "0");
  const amountFormatted = (Number(data.amount) || 1000).toFixed(2);
  const words = numberToWords(Number(data.amount) || 1000);
  const verificationId = generateVerificationId(data.receiptNo || "732", idNo, Number(data.amount));

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Money Receipt ${slNo} - Friends Goal</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 15mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Arial, Roboto, sans-serif;
        }
        body {
          background-color: #f3f4f6;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
        }
        .receipt-card {
          background-color: #ffffff;
          width: 100%;
          max-width: 960px;
          border-radius: 4px;
          padding: 32px 36px 0 36px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
          color: #111827;
        }
        
        /* ── Header ── */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }
        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-badge {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          border: 3.5px solid #2B388F;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 26px;
          color: #E31E24;
          transform: rotate(-10deg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }
        .logo-title {
          font-size: 26px;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }
        .logo-title .friends { color: #2B388F; }
        .logo-title .goal { color: #E31E24; }
        .logo-subtitle {
          background-color: #2B388F;
          color: #ffffff;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.2px;
          padding: 3px 8px;
          border-radius: 3px;
          display: inline-block;
          margin-top: 4px;
          text-transform: uppercase;
        }

        /* Title Box */
        .title-box {
          background-color: #B81D24;
          color: #ffffff;
          font-weight: 800;
          font-size: 22px;
          padding: 8px 36px;
          border-radius: 4px;
          text-align: center;
          margin-top: 10px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 6px rgba(184, 29, 36, 0.2);
        }

        /* Contact Details */
        .contact-info {
          font-size: 13.5px;
          font-weight: 700;
          color: #000000;
          line-height: 1.5;
        }
        .contact-item {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-bottom: 5px;
        }
        .icon-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background-color: #0288D1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        .icon-circle svg {
          width: 13px;
          height: 13px;
          fill: currentColor;
        }

        /* ── Main Content Grid ── */
        .content-grid {
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          font-size: 17px;
          font-weight: 700;
          color: #000000;
        }

        .row-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .field-label {
          font-weight: 700;
          color: #000000;
        }

        .field-value {
          font-weight: 800;
          color: #000000;
        }

        .dashed-line {
          border-bottom: 1.5px dashed #6b7280;
          display: inline-block;
          min-width: 140px;
          margin-left: 6px;
        }

        /* TAKA Box */
        .taka-container {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 6px;
        }
        .taka-label {
          font-size: 20px;
          font-weight: 900;
          color: #000000;
          letter-spacing: 0.5px;
        }
        .taka-box {
          border: 2.5px solid #000000;
          padding: 8px 32px;
          font-size: 22px;
          font-weight: 900;
          color: #000000;
          min-width: 220px;
          text-align: center;
          letter-spacing: 0.5px;
          background-color: #ffffff;
        }

        /* Unique Verification Badge */
        .verification-bar {
          margin-top: 20px;
          padding: 10px 16px;
          background-color: #f8fafc;
          border: 1px dashed #0288D1;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .verification-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .verification-badge {
          background-color: #0288D1;
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }
        .verification-id {
          font-family: monospace;
          font-weight: 700;
          font-size: 13px;
          color: #1e293b;
        }
        .verification-status {
          font-size: 11px;
          font-weight: 700;
          color: #15803d;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Auto-generated Footer Note */
        .signature-note {
          margin-top: 24px;
          text-align: left;
          font-size: 14px;
          font-weight: 700;
          color: #000000;
        }

        /* Decorative Bottom Dual Color Banner */
        .bottom-banner {
          margin-top: 12px;
          margin-left: -36px;
          margin-right: -36px;
          height: 24px;
          display: flex;
          position: relative;
          overflow: hidden;
        }
        .banner-red {
          background-color: #E31E24;
          width: 53%;
          height: 100%;
          clip-path: polygon(0 0, 100% 0, 94% 100%, 0 100%);
        }
        .banner-blue {
          background-color: #0073E6;
          width: 49%;
          height: 100%;
          margin-left: -2%;
          clip-path: polygon(6% 0, 100% 0, 100% 100%, 0 100%);
        }

        @media print {
          body {
            background: white;
            padding: 0;
          }
          .receipt-card {
            box-shadow: none;
            max-width: 100%;
            border-radius: 0;
            padding: 24px 28px 0 28px;
          }
          .no-print {
            display: none !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-card">
        <!-- ── Header ── -->
        <div class="header">
          <!-- Logo -->
          <div class="logo-area">
            <div class="logo-badge">FG</div>
            <div>
              <div class="logo-title">
                <span class="friends">Friends</span> <span class="goal">Goal</span>
              </div>
              <div class="logo-subtitle">LET'S GO TOGETHER</div>
            </div>
          </div>

          <!-- Middle Red Box -->
          <div class="title-box">
            Money Receipt
          </div>

          <!-- Contact Details -->
          <div class="contact-info">
            <div class="contact-item">
              <div class="icon-circle">
                <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              </div>
              <span>01774-987030,01710-203911</span>
            </div>
            <div class="contact-item">
              <div class="icon-circle">
                <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </div>
              <span>friends.goal@gmail.com</span>
            </div>
            <div class="contact-item">
              <div class="icon-circle">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </div>
              <span style="max-width: 250px; text-align: right;">158/1B(4th Floor), Moynarbagh, Uttar Badda, Dhaka-1212</span>
            </div>
          </div>
        </div>

        <!-- ── Main Receipt Content ── -->
        <div class="content-grid">
          <!-- Row 1: SL NO & Date -->
          <div class="row-flex">
            <div>
              <span class="field-label">SL NO : </span>
              <span class="field-value">${slNo}</span>
            </div>
            <div>
              <span class="field-label">Date: </span>
              <span class="field-value">${dateFormatted}</span>
            </div>
          </div>

          <!-- Row 2: Name & ID No -->
          <div class="row-flex">
            <div>
              <span class="field-label">Name : </span>
              <span class="field-value">${memberName}</span>
            </div>
            <div>
              <span class="field-label">ID No : </span>
              <span class="field-value">${idNo}</span>
            </div>
          </div>

          <!-- Row 3: Name of The Month -->
          <div>
            <span class="field-label">Name of The Month : </span>
            <span class="field-value">${monthFormatted}</span>
          </div>

          <!-- Row 4: Admission Fee, Advance, Other's -->
          <div class="row-flex" style="font-size: 15px;">
            <div>
              <span class="field-label">Admission Fee : </span>
              <span class="dashed-line">${data.admissionFee ? data.admissionFee : ""}</span>
            </div>
            <div>
              <span class="field-label">Advance : </span>
              <span class="dashed-line">${data.advanceFee ? data.advanceFee : ""}</span>
            </div>
            <div>
              <span class="field-label">Other's : </span>
              <span class="dashed-line">${data.othersFee ? data.othersFee : ""}</span>
            </div>
          </div>

          <!-- Row 5: Amount in Words -->
          <div>
            <span class="field-label">Amount in Words : </span>
            <span class="field-value">${words}</span>
          </div>

          <!-- Row 6: TAKA Box -->
          <div class="taka-container">
            <span class="taka-label">TAKA :</span>
            <div class="taka-box">${amountFormatted}</div>
          </div>
        </div>

        <!-- ── Authentic Verification Unique ID Bar ── -->
        <div class="verification-bar">
          <div class="verification-left">
            <span class="verification-badge">VERIFIED AUTHENTIC</span>
            <span class="verification-id">UNIQUE ID: <strong>${verificationId}</strong></span>
          </div>
          <div class="verification-status">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Valid Official Digital Payment Receipt
          </div>
        </div>

        <!-- ── Auto-generated Signature Statement ── -->
        <div class="signature-note">
          This is auto generated no need any signature
        </div>

        <!-- ── Bottom Red & Blue Bar ── -->
        <div class="bottom-banner">
          <div class="banner-red"></div>
          <div class="banner-blue"></div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  win.document.write(html);
  win.document.close();
}
