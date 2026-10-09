/**
 * Universal Member Statement & Digital ID Card PDF Generator for Friends Goal Organization
 * Standardized across the brand system with Navy (#0E3B6C) and Crimson Red (#C0262D).
 */

export interface IMemberPdfData {
  _id?: string;
  memberId?: string;
  memberCode: string;
  fullName: string;
  email?: string;
  mobileNo?: string;
  phone?: string;
  bloodGroup?: string;
  profession?: string;
  nidNo?: string;
  presentAddress?: string;
  designation?: string;
  designationBn?: string;
  role?: string;
  status?: string;
  pictureUrl?: string;
  photoUrl?: string;
  createdAt?: string;
  joinedDate?: string;
  dateOfBirth?: string;
  thana?: string;
  district?: string;

  // Nominee
  nomineeName?: string;
  nomineeRelation?: string;
  nomineeNid?: string;

  // Financial Metrics
  totalDeposit?: number | string;
  profitBalance?: number | string;
  pendingWithdrawal?: number | string;
  dueAmount?: number | string;
  savingsBalance?: number | string;
  totalWithdrawn?: number | string;

  // Transaction Schedule / Collection History
  collections?: any[];
  activePaymentSchedule?: any[];
}

/**
 * Generate a consistent, official verification code: FG-VERIFY-<memberCode>-<hash>
 */
export function generateVerificationCode(memberCode: string): string {
  const code = (memberCode || "001").padStart(3, "0");
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `FG-VERIFY-${code}-${randomHex}`;
}

// ─── 1. Member Financial & Profile Statement PDF (Image 2 + Image 3 Brand Standard) ─

export function printMemberStatementPdf(member: IMemberPdfData, collections?: any[]): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups for this website to print the statement.");
    return;
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const memberCode = member.memberCode || member.memberId || "001";
  const fullName = member.fullName || "Member";
  const designation = member.designation || (member.role === "admin" || member.role === "superAdmin" ? "Administrator" : "Member");
  const phone = member.mobileNo || member.phone || "N/A";
  const email = member.email || "N/A";
  const nid = member.nidNo || "N/A";
  const address = member.presentAddress || [member.thana, member.district].filter(Boolean).join(", ") || "Dhaka, Bangladesh";
  const status = (member.status || "active").toUpperCase();
  const joinedDate = member.createdAt || member.joinedDate || "05-Oct-2025";
  const formattedJoinedDate = joinedDate ? new Date(joinedDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "05-Oct-2025";

  // Financial Metrics
  const totalDepositVal = Number(member.totalDeposit) || 0;
  const profitBalanceVal = Number(member.profitBalance) || 0;
  const pendingWithdrawalVal = Number(member.pendingWithdrawal) || 0;
  const dueAmountVal = Number(member.dueAmount) || 0;

  // Nominee Details
  const nomineeName = member.nomineeName || "N/A";
  const nomineeRelation = member.nomineeRelation || "N/A";
  const nomineeNid = member.nomineeNid || "N/A";

  const verificationId = generateVerificationCode(memberCode);

  // History Rows
  const historyList = collections && collections.length > 0
    ? collections
    : Array.isArray(member.activePaymentSchedule) && member.activePaymentSchedule.length > 0
    ? member.activePaymentSchedule
    : [];

  let historyRowsHtml = "";
  if (historyList.length === 0) {
    historyRowsHtml = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 22px 14px; color: #64748B; font-size: 12px; font-style: italic;">
          No transaction history recorded for this member.
        </td>
      </tr>
    `;
  } else {
    historyList.slice(0, 10).forEach((item: any, idx: number) => {
      const dateStr = item.paymentDate
        ? new Date(item.paymentDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })
        : item.month || currentDate;
      const type = item.type || item.paymentMethod || "Deposit / Monthly Fee";
      const ref = item.receiptNo || `REC-${1000 + idx}`;
      const amt = Number(item.amount) || 1000;
      const rowStatus = item.status || "Paid";
      const isPaid = String(rowStatus).toLowerCase().includes("paid");
      const statusBadge = isPaid
        ? "background: #ECFDF5; color: #059669; border: 1px solid #A7F3D0;"
        : "background: #FEF2F2; color: #C0262D; border: 1px solid #FECACA;";
      const remarks = item.note || `Monthly collection of BDT ${amt.toLocaleString()}`;

      historyRowsHtml += `
        <tr style="border-bottom: 1px solid #E2E8F0; background-color: ${idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'};">
          <td style="padding: 10px 12px; font-size: 11.5px; color: #334155; font-weight: 600;">${dateStr}</td>
          <td style="padding: 10px 12px; font-size: 11.5px; color: #0E3B6C; font-weight: 700; text-transform: capitalize;">${type}</td>
          <td style="padding: 10px 12px; font-size: 11px; font-family: monospace; font-weight: 700; color: #475569;">${ref}</td>
          <td style="padding: 10px 12px; font-size: 12px; font-weight: 800; color: #0F172A; text-align: right;">BDT ${amt.toLocaleString()}.00</td>
          <td style="padding: 10px 12px; text-align: center;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; ${statusBadge}">${rowStatus}</span>
          </td>
          <td style="padding: 10px 12px; font-size: 11px; color: #64748B;">${remarks}</td>
        </tr>
      `;
    });
  }

  const initialLetter = fullName.trim().charAt(0).toUpperCase() || "M";
  const avatarHtml = member.pictureUrl || member.photoUrl
    ? `<img src="${member.pictureUrl || member.photoUrl}" alt="${fullName}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;" />`
    : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; color: #0E3B6C; background: #E2E8F0;">${initialLetter}</div>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Member Statement - ${memberCode} - Friends Goal</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
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
          background-color: #F1F5F9;
          color: #0F172A;
          display: flex;
          justify-content: center;
          padding: 20px;
        }

        .statement-card {
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
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 2.5px solid #0E3B6C;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-badge {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2.5px solid #0E3B6C;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 900;
          color: #C0262D;
          background: #FFFFFF;
          flex-shrink: 0;
        }

        .logo-title {
          font-size: 22px;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }
        .logo-title .friends { color: #0E3B6C; }
        .logo-title .goal { color: #C0262D; }

        .logo-subtitle {
          margin-top: 4px;
          display: inline-block;
          background-color: #0E3B6C;
          color: #FFFFFF;
          font-size: 9px;
          font-weight: 800;
          padding: 2px 9px;
          border-radius: 12px;
          letter-spacing: 0.8px;
        }

        .org-desc {
          font-size: 10px;
          color: #64748B;
          font-weight: 600;
          margin-top: 3px;
        }

        .header-meta {
          text-align: right;
        }

        .statement-title {
          font-size: 16px;
          font-weight: 900;
          color: #0E3B6C;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .statement-meta-text {
          font-size: 11px;
          color: #475569;
          font-weight: 600;
          margin-top: 3px;
        }

        /* ── Member & Nominee Box ── */
        .member-box {
          margin-top: 20px;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 18px 20px;
          display: grid;
          grid-template-columns: 1.35fr 1fr;
          gap: 20px;
        }

        .member-info-col {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .member-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          border: 3px solid #FFFFFF;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
          overflow: hidden;
          flex-shrink: 0;
          background: #E2E8F0;
        }

        .member-details {
          flex: 1;
        }

        .member-name {
          font-size: 17px;
          font-weight: 900;
          color: #0F172A;
          text-transform: uppercase;
          line-height: 1.2;
        }

        .member-id-pill {
          font-size: 11px;
          font-weight: 700;
          color: #0E3B6C;
          margin-top: 3px;
        }

        .member-meta-grid {
          margin-top: 8px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3px;
          font-size: 11.5px;
          color: #334155;
        }

        .meta-label {
          font-weight: 700;
          color: #64748B;
        }

        .nominee-col {
          border-left: 1px solid #E2E8F0;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .nominee-title {
          font-size: 12.5px;
          font-weight: 800;
          color: #0E3B6C;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .nominee-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 4px;
          font-size: 11.5px;
          color: #334155;
        }

        .status-badge-row {
          margin-top: 10px;
        }

        .status-pill {
          display: inline-block;
          background: #ECFDF5;
          color: #059669;
          border: 1px solid #A7F3D0;
          font-size: 10.5px;
          font-weight: 800;
          padding: 3px 12px;
          border-radius: 20px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        /* ── Metric Cards ── */
        .metrics-grid {
          margin-top: 18px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .metric-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 12px 14px;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
        }

        .metric-card-label {
          font-size: 10px;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-card-value {
          font-size: 16px;
          font-weight: 900;
          margin-top: 4px;
          letter-spacing: -0.3px;
        }

        /* ── Table Area ── */
        .table-section {
          margin-top: 22px;
          flex: 1;
        }

        .table-title {
          font-size: 12.5px;
          font-weight: 800;
          color: #0E3B6C;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .table-title::before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #C0262D;
          border-radius: 50%;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          overflow: hidden;
        }

        .history-table th {
          background-color: #0E3B6C;
          color: #FFFFFF;
          font-size: 10.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          padding: 10px 12px;
          text-align: left;
        }

        .history-table td {
          vertical-align: middle;
        }

        /* ── Verification Box ── */
        .verification-bar {
          margin-top: 20px;
          padding: 9px 16px;
          background-color: #F8FAFC;
          border: 1px dashed #0E3B6C;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .verification-badge {
          background-color: #0E3B6C;
          color: white;
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
          font-size: 11.5px;
          color: #1E293B;
          margin-left: 8px;
        }

        .verification-status {
          font-size: 11px;
          font-weight: 700;
          color: #059669;
        }

        /* ── Footer ── */
        .footer-note {
          margin-top: 14px;
          font-size: 11px;
          font-weight: 700;
          color: #1E293B;
          text-align: left;
        }

        .bottom-banner {
          margin-top: 10px;
          margin-left: -36px;
          margin-right: -36px;
          margin-bottom: -24px;
          height: 18px;
          display: flex;
          position: relative;
          overflow: hidden;
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
      </style>
    </head>
    <body>
      <div class="statement-card">
        <div>
          <!-- Header -->
          <div class="header">
            <div class="logo-area">
              <div class="logo-badge">FG</div>
              <div>
                <div class="logo-title">
                  <span class="friends">Friends</span> <span class="goal">Goal</span>
                </div>
                <div class="logo-subtitle">LET'S GO TOGETHER</div>
                <div class="org-desc">Financial Cooperative Society (Somiti)</div>
              </div>
            </div>

            <div class="header-meta">
              <div class="statement-title">Member Financial Statement</div>
              <div class="statement-meta-text">www.friendsgoal.com</div>
              <div class="statement-meta-text">Generated: ${currentDate}</div>
            </div>
          </div>

          <!-- Member Profile & Nominee Card -->
          <div class="member-box">
            <div class="member-info-col">
              <div class="member-avatar">
                ${avatarHtml}
              </div>
              <div class="member-details">
                <div class="member-name">${fullName}</div>
                <div class="member-id-pill">ID: <strong>${memberCode}</strong> | ${designation}</div>
                
                <div class="member-meta-grid">
                  <div><span class="meta-label">Phone:</span> ${phone}</div>
                  <div><span class="meta-label">Email:</span> ${email}</div>
                  <div><span class="meta-label">NID:</span> ${nid}</div>
                  <div><span class="meta-label">Address:</span> ${address}</div>
                </div>
              </div>
            </div>

            <div class="nominee-col">
              <div>
                <div class="nominee-title">Nominee & Account Details</div>
                <div class="nominee-grid">
                  <div><span class="meta-label">Nominee Name:</span> ${nomineeName}</div>
                  <div><span class="meta-label">Relationship:</span> ${nomineeRelation}</div>
                  <div><span class="meta-label">Nominee NID:</span> ${nomineeNid}</div>
                  <div><span class="meta-label">Joined Date:</span> ${formattedJoinedDate}</div>
                </div>
              </div>
              <div class="status-badge-row">
                <span class="status-pill">${status}</span>
              </div>
            </div>
          </div>

          <!-- Financial Summary Metric Cards -->
          <div class="metrics-grid">
            <div class="metric-card" style="border-top: 3px solid #0E3B6C;">
              <div class="metric-card-label">Total Deposit</div>
              <div class="metric-card-value" style="color: #0E3B6C;">BDT ${totalDepositVal.toLocaleString()}.00</div>
            </div>

            <div class="metric-card" style="border-top: 3px solid #0288D1;">
              <div class="metric-card-label">Profit Balance</div>
              <div class="metric-card-value" style="color: #0288D1;">BDT ${profitBalanceVal.toLocaleString()}.00</div>
            </div>

            <div class="metric-card" style="border-top: 3px solid #D97706;">
              <div class="metric-card-label">Pending Withdrawal</div>
              <div class="metric-card-value" style="color: #D97706;">BDT ${pendingWithdrawalVal.toLocaleString()}.00</div>
            </div>

            <div class="metric-card" style="border-top: 3px solid ${dueAmountVal > 0 ? '#C0262D' : '#059669'};">
              <div class="metric-card-label">Current Due</div>
              <div class="metric-card-value" style="color: ${dueAmountVal > 0 ? '#C0262D' : '#059669'};">BDT ${dueAmountVal.toLocaleString()}.00</div>
            </div>
          </div>

          <!-- Transaction Table -->
          <div class="table-section">
            <div class="table-title">Transaction & Payment History</div>
            <table class="history-table">
              <thead>
                <tr>
                  <th style="width: 15%;">Date</th>
                  <th style="width: 20%;">Type</th>
                  <th style="width: 15%;">Ref / Receipt</th>
                  <th style="width: 18%; text-align: right;">Amount</th>
                  <th style="width: 12%; text-align: center;">Status</th>
                  <th style="width: 20%;">Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${historyRowsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <!-- Verification Bar -->
          <div class="verification-bar">
            <div>
              <span class="verification-badge">VERIFIED AUTHENTIC</span>
              <span class="verification-id">UNIQUE ID: ${verificationId}</span>
            </div>
            <div class="verification-status">✓ Valid Official Member Financial Statement</div>
          </div>

          <!-- Auto-generated footer note -->
          <div class="footer-note">This is an auto-generated document, no signature required.</div>

          <!-- Bottom Dual-Tone Accent Bar -->
          <div class="bottom-banner">
            <div class="banner-red"></div>
            <div class="banner-blue"></div>
          </div>
        </div>
      </div>

      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}


// ─── 2. Digital ID Card PDF (Front & Back View matching Image 1 + Image 3) ────

export function printMemberIdCardPdf(member: IMemberPdfData): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups for this website to print the ID card.");
    return;
  }

  const memberCode = (member.memberCode || member.memberId || "001").padStart(3, "0");
  const fullName = (member.fullName || "MEMBER NAME").toUpperCase();
  const designation = (member.designation || (member.role === "admin" || member.role === "superAdmin" ? "PRESIDENT" : "MEMBER")).toUpperCase();
  const phone = member.mobileNo || member.phone || "01774-987030";
  const joinedDate = member.createdAt || member.joinedDate || "05-Oct-2025";
  const formattedJoinDate = joinedDate ? new Date(joinedDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "05-Oct-2025";
  const status = (member.status || "ACTIVE").toUpperCase();

  const verificationId = `FG-VERIFY-${memberCode}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const initialLetter = fullName.trim().charAt(0).toUpperCase() || "J";
  const avatarHtml = member.pictureUrl || member.photoUrl
    ? `<img src="${member.pictureUrl || member.photoUrl}" alt="${fullName}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;" />`
    : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 52px; font-weight: 900; color: #1E3A5F; background: #CBD5E1;">${initialLetter}</div>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Official ID Card - ${memberCode} - Friends Goal</title>
      <style>
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
          flex-direction: column;
          align-items: center;
          padding: 30px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 900;
          color: #0E3B6C;
          letter-spacing: -0.3px;
        }

        .page-subtitle {
          font-size: 13px;
          color: #64748B;
          font-weight: 600;
          margin-top: 4px;
        }

        .cards-container {
          display: flex;
          gap: 36px;
          justify-content: center;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        /* ── Common Card Frame ── */
        .id-card {
          width: 320px;
          height: 500px;
          background-color: #FFFFFF;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(14, 59, 108, 0.1);
          border: 1px solid #E2E8F0;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* ── FRONT CARD ── */
        .front-top-red {
          height: 6px;
          background-color: #C0262D;
          width: 100%;
        }

        .front-header {
          height: 175px;
          background: linear-gradient(180deg, #0E3B6C 0%, #133863 100%);
          border-radius: 0 0 50% 50% / 0 0 40px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 14px;
          position: relative;
        }

        .brand-pill {
          background-color: #FFFFFF;
          border-radius: 24px;
          padding: 5px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.12);
        }

        .pill-logo-badge {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1.5px solid #0E3B6C;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 900;
          color: #C0262D;
          background: #FFFFFF;
        }

        .pill-brand-text {
          font-size: 13.5px;
          font-weight: 900;
          line-height: 1;
        }
        .pill-brand-text .f { color: #0E3B6C; }
        .pill-brand-text .g { color: #C0262D; }

        .avatar-wrapper {
          position: absolute;
          bottom: -55px;
          left: 50%;
          transform: translateX(-50%);
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 5px solid #FFFFFF;
          box-shadow: 0 6px 16px rgba(0,0,0,0.14);
          overflow: hidden;
          background-color: #CBD5E1;
          z-index: 10;
        }

        .front-body {
          padding-top: 64px;
          padding-left: 24px;
          padding-right: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .member-title-name {
          font-size: 19px;
          font-weight: 900;
          color: #0F172A;
          letter-spacing: 0.5px;
          line-height: 1.2;
        }

        .member-designation {
          font-size: 12.5px;
          font-weight: 800;
          color: #0E3B6C;
          letter-spacing: 1px;
          margin-top: 4px;
        }

        .meta-table {
          width: 86%;
          margin-top: 18px;
          text-align: left;
          font-size: 12px;
          line-height: 1.8;
        }

        .meta-table td:first-child {
          font-weight: 700;
          color: #64748B;
          width: 38%;
        }

        .meta-table td:nth-child(2) {
          font-weight: 700;
          color: #64748B;
          width: 8%;
        }

        .meta-table td:last-child {
          font-weight: 800;
          color: #0F172A;
        }

        .status-active-text {
          color: #059669 !important;
          font-weight: 900 !important;
        }

        .front-bottom-wrapper {
          width: 100%;
        }

        .front-bottom-red {
          height: 2.5px;
          background-color: #C0262D;
          width: 100%;
        }

        .front-footer {
          height: 38px;
          background: linear-gradient(180deg, #0E3B6C 0%, #133863 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.2px;
        }

        /* ── BACK CARD ── */
        .back-card {
          padding: 24px 22px 0 22px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .back-header-title {
          font-size: 13.5px;
          font-weight: 900;
          color: #0E3B6C;
          text-align: center;
          letter-spacing: 0.8px;
        }

        .back-divider {
          width: 90%;
          height: 2px;
          background-color: #0E3B6C;
          margin: 7px auto 14px auto;
        }

        .terms-list {
          font-size: 10px;
          color: #334155;
          line-height: 1.55;
          padding-left: 6px;
          padding-right: 6px;
        }

        .terms-item {
          margin-bottom: 8px;
          display: flex;
          gap: 6px;
        }

        .terms-num {
          font-weight: 800;
          color: #0E3B6C;
        }

        /* QR Code Simulation Block */
        .qr-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 12px 0;
        }

        .qr-box {
          width: 100px;
          height: 100px;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qr-svg {
          width: 100%;
          height: 100%;
        }

        .verification-code-text {
          font-family: monospace;
          font-size: 9.5px;
          font-weight: 700;
          color: #475569;
          margin-top: 6px;
        }

        .signature-area {
          text-align: center;
          width: 70%;
          margin: 6px auto 14px auto;
        }

        .signature-line {
          border-top: 1.5px solid #0E3B6C;
          margin-bottom: 4px;
        }

        .signature-text {
          font-size: 10.5px;
          font-weight: 700;
          color: #1E293B;
        }

        .back-bottom-wrapper {
          margin-left: -22px;
          margin-right: -22px;
        }
      </style>
    </head>
    <body>
      <div class="page-header no-print">
        <h1 class="page-title">FRIENDS GOAL</h1>
        <p class="page-subtitle">Official Member Digital Identification Card</p>
      </div>

      <div class="cards-container">
        <!-- ── FRONT VIEW ── -->
        <div class="id-card">
          <div>
            <div class="front-top-red"></div>
            <div class="front-header">
              <div class="brand-pill">
                <div class="pill-logo-badge">FG</div>
                <div class="pill-brand-text">
                  <span class="f">Friends</span> <span class="g">Goal</span>
                </div>
              </div>

              <div class="avatar-wrapper">
                ${avatarHtml}
              </div>
            </div>

            <div class="front-body">
              <h2 class="member-title-name">${fullName}</h2>
              <div class="member-designation">${designation}</div>

              <table class="meta-table">
                <tr>
                  <td>ID NO</td>
                  <td>:</td>
                  <td>${memberCode}</td>
                </tr>
                <tr>
                  <td>PHONE</td>
                  <td>:</td>
                  <td>${phone}</td>
                </tr>
                <tr>
                  <td>JOIN DATE</td>
                  <td>:</td>
                  <td>${formattedJoinDate}</td>
                </tr>
                <tr>
                  <td>STATUS</td>
                  <td>:</td>
                  <td class="status-active-text">${status}</td>
                </tr>
              </table>
            </div>
          </div>

          <div class="front-bottom-wrapper">
            <div class="front-bottom-red"></div>
            <div class="front-footer">
              WWW.FRIENDSGOAL.COM
            </div>
          </div>
        </div>

        <!-- ── BACK VIEW ── -->
        <div class="id-card back-card">
          <div>
            <h3 class="back-header-title">TERMS & CONDITIONS</h3>
            <div class="back-divider"></div>

            <div class="terms-list">
              <div class="terms-item">
                <span class="terms-num">1.</span>
                <span>This card is the property of Friends Goal Financial Cooperative Society.</span>
              </div>
              <div class="terms-item">
                <span class="terms-num">2.</span>
                <span>If found, please return to: 158/1B(4th Floor), Moynarbagh, Uttar Badda, Dhaka-1212.</span>
              </div>
              <div class="terms-item">
                <span class="terms-num">3.</span>
                <span>Cardholder must present this ID for official transactions.</span>
              </div>
            </div>

            <!-- Clean Vector QR Code Simulation Block -->
            <div class="qr-section">
              <div class="qr-box">
                <svg class="qr-svg" viewBox="0 0 100 100" fill="#0E3B6C">
                  <!-- QR Finder Corners -->
                  <rect x="5" y="5" width="28" height="28" fill="#0E3B6C" rx="3"/>
                  <rect x="9" y="9" width="20" height="20" fill="#FFFFFF" rx="2"/>
                  <rect x="13" y="13" width="12" height="12" fill="#0E3B6C" rx="1"/>

                  <rect x="67" y="5" width="28" height="28" fill="#0E3B6C" rx="3"/>
                  <rect x="71" y="9" width="20" height="20" fill="#FFFFFF" rx="2"/>
                  <rect x="75" y="13" width="12" height="12" fill="#0E3B6C" rx="1"/>

                  <rect x="5" y="67" width="28" height="28" fill="#0E3B6C" rx="3"/>
                  <rect x="9" y="71" width="20" height="20" fill="#FFFFFF" rx="2"/>
                  <rect x="13" y="75" width="12" height="12" fill="#0E3B6C" rx="1"/>

                  <!-- QR Data Matrix Dots -->
                  <rect x="39" y="8" width="8" height="8" rx="1"/>
                  <rect x="53" y="14" width="8" height="8" rx="1"/>
                  <rect x="39" y="22" width="8" height="8" rx="1"/>
                  <rect x="10" y="42" width="8" height="8" rx="1"/>
                  <rect x="24" y="48" width="8" height="8" rx="1"/>
                  <rect x="42" y="42" width="16" height="16" fill="#C0262D" rx="2"/>
                  <rect x="68" y="42" width="8" height="8" rx="1"/>
                  <rect x="82" y="48" width="8" height="8" rx="1"/>
                  <rect x="46" y="68" width="8" height="8" rx="1"/>
                  <rect x="60" y="74" width="8" height="8" rx="1"/>
                  <rect x="74" y="68" width="8" height="8" rx="1"/>
                  <rect x="84" y="80" width="8" height="8" rx="1"/>
                  <rect x="46" y="84" width="8" height="8" rx="1"/>
                </svg>
              </div>
              <div class="verification-code-text">${verificationId}</div>
            </div>

            <div class="signature-area">
              <div class="signature-line"></div>
              <div class="signature-text">Authorized Signature</div>
            </div>
          </div>

          <div class="back-bottom-wrapper">
            <div class="front-bottom-red"></div>
            <div class="front-footer">
              LET'S GO TOGETHER
            </div>
          </div>
        </div>
      </div>

      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Backward compatibility helper for existing references
 */
export function printMemberProfilePdf(summary: any): void {
  printMemberStatementPdf(summary);
}
