/**
 * Member Profile & ID Card PDF Generator for Friends Goal Organization
 */
import { IMemberDashboardSummary } from "./memberDashboardApi";

export function printMemberProfilePdf(summary: IMemberDashboardSummary): void {
  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups for this website to print the profile.");
    return;
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate some totals
  const totalDeposit = (Number(summary.totalDeposit) || 0).toLocaleString("en-US");
  const dueAmount = (Number(summary.dueAmount) || 0).toLocaleString("en-US");
  const profitBalance = (Number(summary.profitBalance) || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // Schedule Table Rows
  const scheduleList = Array.isArray(summary.activePaymentSchedule)
    ? summary.activePaymentSchedule
    : [];
  let scheduleRowsHtml = "";

  if (scheduleList.length === 0) {
    scheduleRowsHtml = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 15px; color: #888;">
          No recent or upcoming schedule found.
        </td>
      </tr>
    `;
  } else {
    scheduleList.forEach((row, idx) => {
      const isPaid = row.status === "Paid";
      const isDue = row.status === "Due";
      const statusColor = isPaid
        ? "color: #00B074; background: #EAF8F1; border: 1px solid #00B074;"
        : isDue
        ? "color: #F59E0B; background: #FFFBEB; border: 1px solid #FDE68A;"
        : "color: #3B82F6; background: #EFF6FF; border: 1px solid #BFDBFE;";

      scheduleRowsHtml += `
        <tr>
          <td style="padding: 12px 10px; border-bottom: 1px solid #EEEEEE; font-weight: bold;">${row.month || "Monthly Collection"}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #EEEEEE; color: #555;">${row.paymentDate || "15th of month"}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #EEEEEE; font-weight: bold; font-family: monospace; font-size: 14px;">৳${(Number(row.amount) || 0).toLocaleString()}</td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #EEEEEE;">
            <span style="display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; ${statusColor}">${row.status}</span>
          </td>
        </tr>
      `;
    });
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Member Profile & ID - ${summary.memberCode}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&display=swap');
        
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
          background-color: #F3F4F6;
          color: #1A1A1A;
        }

        .page-container {
          width: 210mm; /* A4 width */
          min-height: 297mm; /* A4 height */
          background-color: #FFFFFF;
          margin: 20px auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          padding: 40px;
        }

        /* Header Area */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #E5E7EB;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .brand-area {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #B81D24;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 900;
          font-size: 24px;
        }

        .brand-text h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -0.5px;
          color: #1A1A1A;
        }
        .brand-text .highlight { color: #B81D24; }
        .brand-text p {
          margin: 4px 0 0;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #2B388F;
        }

        .id-badge {
          background-color: #2B5A27;
          color: #FFFFFF;
          padding: 10px 20px;
          border-radius: 8px;
          text-align: right;
        }
        .id-badge-title {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          opacity: 0.8;
          font-weight: 700;
        }
        .id-badge-value {
          font-size: 22px;
          font-weight: 900;
          margin-top: 2px;
          font-family: monospace;
        }

        /* Profile Section */
        .profile-section {
          display: flex;
          gap: 30px;
          margin-bottom: 40px;
          background: #F9FAFB;
          padding: 25px;
          border-radius: 16px;
          border: 1px solid #E5E7EB;
        }
        .profile-image-container {
          width: 140px;
          height: 180px;
          background-color: #E5E7EB;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          border: 4px solid #FFFFFF;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .profile-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .profile-details {
          flex: 1;
        }
        .profile-name {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 5px 0;
          color: #1A1A1A;
        }
        .profile-role {
          display: inline-block;
          background: #1A1A1A;
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 4px 10px;
          border-radius: 4px;
          margin-bottom: 20px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .info-label {
          font-size: 10px;
          color: #6B7280;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: #1A1A1A;
        }

        /* Financial Snapshot */
        .section-title {
          font-size: 18px;
          font-weight: 800;
          color: #1A1A1A;
          margin: 0 0 15px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #E5E7EB;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        .stat-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
        }
        .stat-card.highlight {
          background: #2B5A27;
          border-color: #2B5A27;
          color: #FFFFFF;
        }
        .stat-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #6B7280;
          margin-bottom: 10px;
        }
        .stat-card.highlight .stat-label {
          color: rgba(255,255,255,0.7);
        }
        .stat-value {
          font-size: 28px;
          font-weight: 800;
          font-family: 'Playfair Display', serif;
        }

        /* Transaction History */
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        th {
          text-align: left;
          padding: 12px 10px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #6B7280;
          border-bottom: 2px solid #E5E7EB;
        }

        /* Footer */
        .footer {
          margin-top: auto;
          border-top: 1px solid #E5E7EB;
          padding-top: 20px;
          text-align: center;
          font-size: 11px;
          color: #9CA3AF;
        }

      </style>
    </head>
    <body>
      <div class="page-container">
        
        <!-- Header -->
        <div class="header">
          <div class="brand-area">
            <div class="logo-circle">FG</div>
            <div class="brand-text">
              <h1>Friends <span class="highlight">Goal</span></h1>
              <p>Let's Go Together</p>
            </div>
          </div>
          <div class="id-badge">
            <div class="id-badge-title">Member ID</div>
            <div class="id-badge-value">${summary.memberCode}</div>
          </div>
        </div>

        <!-- Profile Section -->
        <div class="profile-section">
          <div class="profile-image-container">
            <img src="${summary.pictureUrl || 'https://via.placeholder.com/150'}" alt="Profile Image" />
          </div>
          <div class="profile-details">
            <h2 class="profile-name">${summary.fullName}</h2>
            <div class="profile-role">${summary.role === "admin" || summary.role === "superAdmin" ? "Administrator" : "Member"}</div>
            
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">${summary.email}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Blood Group</span>
                <span class="info-value">${summary.bloodGroup || 'N/A'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Date of Birth</span>
                <span class="info-value">${summary.dateOfBirth || 'N/A'}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Location</span>
                <span class="info-value">${[summary.thana, summary.district].filter(Boolean).join(", ") || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Status -->
        <h3 class="section-title">Personal Financial Status</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-label">Total Deposit</div>
            <div class="stat-value" style="color: #2B5A27;">৳${totalDeposit}</div>
          </div>
          <div class="stat-card highlight">
            <div class="stat-label">My Profit</div>
            <div class="stat-value">৳${profitBalance}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">${Number(summary.dueAmount) < 0 ? 'Advance' : 'Due Amount'}</div>
            <div class="stat-value" style="color: ${Number(summary.dueAmount) > 0 ? '#B81D24' : '#1A1A1A'};">
              ৳${Math.abs(Number(summary.dueAmount) || 0).toLocaleString("en-US")}
            </div>
          </div>
        </div>

        <!-- Transaction History -->
        <h3 class="section-title">Payment Schedule & History</h3>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${scheduleRowsHtml}
          </tbody>
        </table>

        <!-- Footer -->
        <div class="footer">
          Document generated on ${currentDate}. This is a system-generated member profile and does not require a physical signature.<br>
          Friends Goal Organization • Dhaka, Bangladesh
        </div>
      </div>

      <script>
        // Wait for images to load before printing
        window.onload = () => {
          setTimeout(() => {
            window.print();
            // Optional: window.close() can be called after print, but often block by browsers if not user initiated.
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
