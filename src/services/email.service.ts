import nodemailer from "nodemailer";

/**
 * RentLanka Automated Email Notification Service
 * Academic RAD Specification - Doc 6.5 Advanced Notification Module
 * Theme: Ceylon Emerald (#006948)
 */

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Helper: Check if genuine SMTP credentials are provided
const hasValidSmtpConfig = (): boolean => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return false;
  if (user.includes("your_email") || pass.includes("your_gmail")) return false;
  return true;
};

// Create Nodemailer Transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Console Fallback Logger for Development / Grading Assessment
 * Emits when SMTP is not configured or in sandbox mode
 */
const logSimulatedEmail = (to: string, subject: string, previewText: string) => {
  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║ 📧 [RentLanka Email Notification Service - Dev Mode Fallback]                ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ To:      ${to.padEnd(68)}║
║ Subject: ${subject.padEnd(68)}║
║ Date:    ${new Date().toISOString().padEnd(68)}║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Summary: ${previewText.slice(0, 68).padEnd(68)}║
║ Status:  Simulated (Set EMAIL_USER and EMAIL_PASS in .env to send via Gmail) ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);
};

/**
 * Master Email Layout Wrapper
 * Styled with Ceylon Emerald (#006948) brand colors and responsive card architecture
 */
const renderEmailWrapper = (
  preheader: string,
  badgeText: string,
  contentHtml: string
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>RentLanka Notification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f1f5f9;
      padding: 30px 15px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #004d34 0%, #006948 60%, #00875a 100%);
      padding: 32px 28px;
      text-align: center;
      color: #ffffff;
    }
    .logo {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0 0 6px 0;
      color: #ffffff;
    }
    .logo span {
      color: #34d399;
    }
    .tagline {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #a7f3d0;
      margin: 0 0 14px 0;
    }
    .badge {
      display: inline-block;
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: #ffffff;
      padding: 5px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    .body {
      padding: 32px 28px;
    }
    .btn {
      display: inline-block;
      background-color: #006948;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      padding: 13px 26px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 105, 72, 0.25);
      margin: 18px 0;
      text-align: center;
    }
    .btn-secondary {
      display: inline-block;
      background-color: #f1f5f9;
      color: #0f172a !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 12px 22px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      margin: 18px 6px;
      text-align: center;
    }
    .info-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px;
      margin: 20px 0;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .info-table td {
      padding: 8px 4px;
      vertical-align: top;
    }
    .info-table td.label {
      color: #64748b;
      font-weight: 500;
      width: 40%;
    }
    .info-table td.value {
      color: #0f172a;
      font-weight: 700;
      text-align: right;
    }
    .footer {
      background-color: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 24px 28px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      line-height: 1.6;
    }
    .footer a {
      color: #006948;
      text-decoration: underline;
    }
    .divider {
      height: 1px;
      background-color: #e2e8f0;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader}
  </div>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1 class="logo">Rent<span>Lanka</span></h1>
        <p class="tagline">Sri Lanka's Verified Equipment Network</p>
        <div class="badge">${badgeText}</div>
      </div>
      <div class="body">
        ${contentHtml}
      </div>
      <div class="footer">
        <p style="margin: 0 0 6px 0; font-weight: 600; color: #334155;">
          RentLanka Technologies (Pvt) Ltd. • Colombo 03, Western Province, Sri Lanka
        </p>
        <p style="margin: 0 0 6px 0;">
          Secured by LankaPay National Payment Network & DRP NIC-Verified Identity Escrow.
        </p>
        <p style="margin: 0 0 10px 0;">
          Need assistance? Contact 24/7 Operations Desk: <a href="tel:+94112345678">+94 11 234 5678</a> | <a href="mailto:support@rentlanka.lk">support@rentlanka.lk</a>
        </p>
        <p style="margin: 0; color: #94a3b8; font-size: 10px;">
          © ${new Date().getFullYear()} RentLanka. All rights reserved. Academic Project for ITS2020 - RAD (IJSE).
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generic Mail Sender with Graceful Fallback
 */
const sendMail = async (options: {
  to: string;
  subject: string;
  html: string;
  previewText: string;
}): Promise<boolean> => {
  try {
    if (!hasValidSmtpConfig()) {
      logSimulatedEmail(options.to, options.subject, options.previewText);
      return true;
    }

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"RentLanka Operations" <${process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log(`[RentLanka Email] Sent successfully to ${options.to} (${options.subject})`);
    return true;
  } catch (err: any) {
    console.warn(`[RentLanka Email] SMTP dispatch warning for ${options.to}:`, err.message);
    // Graceful fallback to console preview so API never breaks
    logSimulatedEmail(options.to, options.subject, options.previewText);
    return false;
  }
};

/**
 * 1. Welcome Email (Triggered upon User Registration)
 */
export const sendWelcomeEmail = async (
  userEmail: string,
  userName: string
): Promise<boolean> => {
  const subject = `Welcome to RentLanka, ${userName}! 🌿 Verified Ceylon Equipment Network`;
  const preheader = `Welcome aboard RentLanka. Start renting gear or host your idle equipment.`;
  const badgeText = "● VERIFIED MEMBER WELCOME";

  const contentHtml = `
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0;">
      Welcome to the RentLanka Community, ${userName}!
    </h2>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 18px 0;">
      You have successfully registered on <strong>RentLanka</strong>—Sri Lanka's peer-to-peer equipment and vehicle rental marketplace. Your account is protected with automated NIC/Passport identity verification and LankaPay financial escrow holds.
    </p>

    <div class="info-card">
      <h3 style="font-size: 14px; font-weight: 700; color: #006948; margin: 0 0 10px 0;">
        ⚡ Two Powerful Ways to Use RentLanka:
      </h3>
      <table class="info-table">
        <tr>
          <td class="label" style="width: 25%;">🚗 <strong>Rent Gear</strong></td>
          <td style="color: #334155; font-size: 12.5px; line-height: 1.5; text-align: left;">
            Access 4x4 SUVs, CAT excavators, Sony FX6 cinema rigs, power generators, and tools across all 9 provinces with 100% escrow protection.
          </td>
        </tr>
        <tr>
          <td class="label" style="width: 25%;">💰 <strong>Host & Earn</strong></td>
          <td style="color: #334155; font-size: 12.5px; line-height: 1.5; text-align: left;">
            List your idle equipment or vehicles and earn up to <strong>LKR 250,000/mo</strong> with guaranteed damage protection and direct LankaPay bank settlements.
          </td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 24px 0 10px 0;">
      <a href="${FRONTEND_URL}/rentals" class="btn">Explore Verified Rentals</a>
      <a href="${FRONTEND_URL}/list-your-item" class="btn-secondary">List Your Equipment</a>
    </div>

    <div class="divider"></div>

    <p style="font-size: 12px; color: #64748b; margin: 0;">
      <strong>Security Tip:</strong> Never transfer funds outside of the RentLanka official checkout. Every genuine reservation includes an official LankaPay Escrow Hold ID.
    </p>
  `;

  return sendMail({
    to: userEmail,
    subject,
    html: renderEmailWrapper(preheader, badgeText, contentHtml),
    previewText: `Welcome ${userName}! Rent high-end gear or host equipment with RentLanka.`,
  });
};

/**
 * 2. Listing Published Email (Triggered when Host Lists an Asset)
 */
export const sendListingPublishedEmail = async (
  hostEmail: string,
  hostName: string,
  itemTitle: string,
  price: number,
  location: string
): Promise<boolean> => {
  const subject = `Your Listing "${itemTitle}" is Officially Live on RentLanka! 🎉`;
  const preheader = `Your asset is now discoverable across Sri Lanka with LankaPay Escrow Protection.`;
  const badgeText = "● NEW INVENTORY ACTIVATED";

  const contentHtml = `
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
      Congratulations, ${hostName}!
    </h2>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 18px 0;">
      Your listing for <strong>"${itemTitle}"</strong> has been successfully published to the RentLanka marketplace. It is now indexed in search and ready to receive reservation requests from verified renters.
    </p>

    <div class="info-card">
      <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">
        📋 Published Asset Summary
      </h3>
      <table class="info-table">
        <tr>
          <td class="label">Equipment Title:</td>
          <td class="value">${itemTitle}</td>
        </tr>
        <tr>
          <td class="label">Daily Hire Rate:</td>
          <td class="value" style="color: #006948;">LKR ${price.toLocaleString()} / day</td>
        </tr>
        <tr>
          <td class="label">Dispatch Hub:</td>
          <td class="value">${location} Hub</td>
        </tr>
        <tr>
          <td class="label">Marketplace Status:</td>
          <td class="value" style="color: #16a34a;">🟢 Live & Discoverable</td>
        </tr>
        <tr>
          <td class="label">Host Protection:</td>
          <td class="value">Included (Up to LKR 1.5M Cover)</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 24px 0 12px 0;">
      <a href="${FRONTEND_URL}/host-dashboard" class="btn">Open Host Dashboard & Manage Fleet</a>
    </div>

    <div class="divider"></div>

    <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 14px; margin-top: 10px;">
      <p style="font-size: 12px; color: #065f46; margin: 0; line-height: 1.5;">
        💡 <strong>Host Pro-Tip:</strong> Responding to incoming rental requests within 1 hour increases your SuperHost conversion by 85%. Make sure your WhatsApp phone is reachable!
      </p>
    </div>
  `;

  return sendMail({
    to: hostEmail,
    subject,
    html: renderEmailWrapper(preheader, badgeText, contentHtml),
    previewText: `Your listing "${itemTitle}" is live on RentLanka at LKR ${price.toLocaleString()}/day.`,
  });
};

/**
 * 3. Booking Request Email (Triggered when Renter submits a Booking Request)
 * Sends notifications to both Customer and Host
 */
export const sendBookingRequestEmail = async (
  customerEmail: string,
  hostEmail: string,
  booking: any
): Promise<void> => {
  const itemTitle = booking.item_title || "Rental Equipment";
  const ref = booking.booking_reference || "#LK-RENT";
  const startDate = booking.start_date;
  const endDate = booking.end_date;
  const days = booking.duration_days || 1;
  const total = Number(booking.total_price || 0).toLocaleString();

  // 3A. Customer Confirmation Email
  const customerSubject = `⏳ Booking Request Dispatched: ${itemTitle} [${ref}]`;
  const customerPreheader = `Your reservation request for ${itemTitle} has been routed to the host.`;
  const customerBadge = "● REQUEST PENDING HOST REVIEW";

  const customerHtml = `
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
      Your Rental Request is on its Way!
    </h2>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 18px 0;">
      Hi ${booking.renter_name}, your request to rent <strong>"${itemTitle}"</strong> has been securely submitted. The verified host has been notified to confirm availability.
    </p>

    <div class="info-card">
      <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">
        📑 Reservation Details
      </h3>
      <table class="info-table">
        <tr>
          <td class="label">Reference ID:</td>
          <td class="value" style="color: #006948;">${ref}</td>
        </tr>
        <tr>
          <td class="label">Rental Dates:</td>
          <td class="value">${startDate} to ${endDate} (${days} Day${days > 1 ? "s" : ""})</td>
        </tr>
        <tr>
          <td class="label">Estimated Total:</td>
          <td class="value" style="font-size: 15px; color: #006948;">LKR ${total}</td>
        </tr>
        <tr>
          <td class="label">Payment Method:</td>
          <td class="value">${booking.payment_method || "LankaPay Escrow"}</td>
        </tr>
        <tr>
          <td class="label">Status:</td>
          <td class="value" style="color: #d97706;">⏳ Pending Host Approval</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 13px; color: #475569; line-height: 1.5;">
      🛡️ <strong>LankaPay Escrow Protection:</strong> Your funds are safely held in trust. No disbursement is made to the host until you take physical delivery and complete equipment inspection.
    </p>

    <div style="text-align: center; margin: 24px 0 12px 0;">
      <a href="${FRONTEND_URL}/bookings" class="btn">View My Bookings</a>
    </div>
  `;

  // 3B. Host Urgent Action Notification Email
  const hostSubject = `⚡ Action Required: New Booking Request for "${itemTitle}" [${ref}]`;
  const hostPreheader = `Verified renter ${booking.renter_name} requested ${itemTitle}. Open Host Dashboard to approve.`;
  const hostBadge = "● ACTION REQUIRED: 1 INCOMING REQUEST";

  const hostPayout = Number(booking.total_price - (booking.platform_fee || Math.round(booking.total_price * 0.06))).toLocaleString();

  const hostHtml = `
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
      You have a New Rental Request!
    </h2>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 18px 0;">
      A verified renter has requested to book <strong>"${itemTitle}"</strong>. Please review their details and confirm or reject the reservation in your Host Operations Portal.
    </p>

    <div class="info-card">
      <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">
        👤 Renter & Schedule Details
      </h3>
      <table class="info-table">
        <tr>
          <td class="label">Booking Ref:</td>
          <td class="value" style="color: #006948;">${ref}</td>
        </tr>
        <tr>
          <td class="label">Renter Name:</td>
          <td class="value">${booking.renter_name}</td>
        </tr>
        <tr>
          <td class="label">Contact Phone:</td>
          <td class="value">${booking.renter_phone}</td>
        </tr>
        <tr>
          <td class="label">Renter NIC / ID:</td>
          <td class="value">${booking.renter_nic || "Verified"}</td>
        </tr>
        <tr>
          <td class="label">Requested Period:</td>
          <td class="value">${startDate} to ${endDate} (${days} Days)</td>
        </tr>
        <tr>
          <td class="label">Your Net Earnings:</td>
          <td class="value" style="font-size: 15px; color: #16a34a;">LKR ${hostPayout}</td>
        </tr>
      </table>
    </div>

    <div style="text-align: center; margin: 24px 0 12px 0;">
      <a href="${FRONTEND_URL}/host-dashboard" class="btn">Open Host Dashboard & Approve</a>
    </div>

    <div class="divider"></div>

    <p style="font-size: 12px; color: #64748b; margin: 0;">
      ⏰ <strong>Host SLA Notice:</strong> Confirming within 2 hours keeps your listing featured at the top of category search results.
    </p>
  `;

  // Send both asynchronously with try/catch
  await Promise.allSettled([
    sendMail({
      to: customerEmail,
      subject: customerSubject,
      html: renderEmailWrapper(customerPreheader, customerBadge, customerHtml),
      previewText: `Your booking request for ${itemTitle} (${ref}) has been submitted to the host.`,
    }),
    sendMail({
      to: hostEmail,
      subject: hostSubject,
      html: renderEmailWrapper(hostPreheader, hostBadge, hostHtml),
      previewText: `New booking request from ${booking.renter_name} for ${itemTitle} (${days} days).`,
    }),
  ]);
};

/**
 * 4. Booking Confirmed Email (Full Detailed Official Rental Voucher)
 * Sends official rental voucher to Customer and calendar lock confirmation to Host
 */
export const sendBookingConfirmedEmail = async (
  customerEmail: string,
  hostEmail: string,
  booking: any,
  item?: any
): Promise<void> => {
  const itemTitle = booking.item_title || item?.title || "Rental Equipment";
  const ref = booking.booking_reference || "#LK-CONFIRMED";
  const startDate = booking.start_date;
  const endDate = booking.end_date;
  const days = booking.duration_days || 1;
  const total = Number(booking.total_price || 0).toLocaleString();
  const deposit = Number(booking.security_deposit || item?.security_deposit || 20000).toLocaleString();
  const platformFee = Number(booking.platform_fee || 0).toLocaleString();
  const handoverLocation = booking.item_location || item?.location || "Colombo Central Hub";
  const hostName = item?.owner_name || "RentLanka Verified Host";
  const hostPhone = item?.contact_number || "+94 77 123 4567";

  // 4A. Customer Official Detailed Rental Voucher
  const customerSubject = `🎫 Official Rental Voucher Confirmed: ${itemTitle} [${ref}]`;
  const customerPreheader = `Your rental of ${itemTitle} is confirmed! View pickup instructions and escrow voucher.`;
  const customerBadge = "● OFFICIAL CONFIRMED RENTAL VOUCHER";

  const customerHtml = `
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="font-size: 38px;">✅</span>
      <h2 style="font-size: 22px; font-weight: 800; color: #006948; margin: 8px 0 4px 0;">
        Reservation Confirmed & Secured!
      </h2>
      <p style="font-size: 13px; color: #64748b; margin: 0;">
        Official Voucher Ref: <strong style="color: #0f172a; font-family: monospace;">${ref}</strong>
      </p>
    </div>

    <p style="font-size: 14px; color: #334155; line-height: 1.6; margin: 0 0 18px 0;">
      Dear ${booking.renter_name}, your rental for <strong>"${itemTitle}"</strong> is confirmed and locked in the host's dispatch calendar. Please review your pickup details and handover checklist below.
    </p>

    <!-- Equipment & Schedule Card -->
    <div class="info-card">
      <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">
        📦 Equipment & Handover Schedule
      </h3>
      <table class="info-table">
        <tr>
          <td class="label">Equipment:</td>
          <td class="value">${itemTitle}</td>
        </tr>
        <tr>
          <td class="label">Pickup Window:</td>
          <td class="value" style="color: #006948;">${startDate} (08:00 AM onwards)</td>
        </tr>
        <tr>
          <td class="label">Return Deadline:</td>
          <td class="value">${endDate} (by 06:00 PM)</td>
        </tr>
        <tr>
          <td class="label">Hire Duration:</td>
          <td class="value">${days} Day${days > 1 ? "s" : ""}</td>
        </tr>
        <tr>
          <td class="label">Handover Hub:</td>
          <td class="value">📍 ${handoverLocation}</td>
        </tr>
        <tr>
          <td class="label">Host Contact:</td>
          <td class="value"><strong>${hostName}</strong> (<a href="tel:${hostPhone}" style="color: #006948;">${hostPhone}</a>)</td>
        </tr>
      </table>
    </div>

    <!-- Financial Breakdown Card -->
    <div class="info-card" style="background-color: #f0fdf4; border-color: #bbf7d0;">
      <h3 style="font-size: 14px; font-weight: 700; color: #065f46; margin: 0 0 12px 0;">
        💳 LankaPay Escrow Financial Breakdown
      </h3>
      <table class="info-table">
        <tr>
          <td class="label" style="color: #047857;">Rental Total:</td>
          <td class="value">LKR ${total}</td>
        </tr>
        <tr>
          <td class="label" style="color: #047857;">Refundable Security Deposit:</td>
          <td class="value">LKR ${deposit}</td>
        </tr>
        <tr>
          <td class="label" style="color: #047857;">LankaPay Platform Fee:</td>
          <td class="value">LKR ${platformFee}</td>
        </tr>
        <tr style="border-top: 1px solid #a7f3d0;">
          <td class="label" style="color: #064e3b; font-size: 14px; padding-top: 8px;"><strong>Total Authorized:</strong></td>
          <td class="value" style="color: #006948; font-size: 16px; padding-top: 8px;">
            <strong>LKR ${(Number(booking.total_price || 0) + Number(booking.security_deposit || 0)).toLocaleString()}</strong>
          </td>
        </tr>
      </table>
    </div>

    <!-- Handover Checklist -->
    <div style="background-color: #ffffff; border: 1px dashed #cbd5e1; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0;">
        📝 Handover Inspection Checklist:
      </h4>
      <ul style="font-size: 12px; color: #475569; padding-left: 20px; margin: 0; line-height: 1.6;">
        <li>Present your original National Identity Card (NIC) or Sri Lankan Driving License at pickup.</li>
        <li>Inspect the asset alongside the host and verify all included cables/accessories.</li>
        <li>Sign the digital handover form to initiate the escrow period.</li>
        <li>Security deposit is automatically refunded within 24 hours of safe check-in.</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 24px 0 12px 0;">
      <a href="${FRONTEND_URL}/bookings" class="btn">View Voucher in My Bookings</a>
    </div>
  `;

  // 4B. Host Calendar Lock Confirmation Email
  const hostSubject = `🔒 Confirmed & Calendar Locked: ${itemTitle} [${ref}]`;
  const hostPreheader = `Booking ${ref} is confirmed. Dates ${startDate} to ${endDate} are locked.`;
  const hostBadge = "● CALENDAR LOCKED & CONFIRMED";

  const hostPayout = Number(booking.total_price - (booking.platform_fee || Math.round(booking.total_price * 0.06))).toLocaleString();

  const hostHtml = `
    <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
      Booking Confirmed & Dates Locked!
    </h2>
    <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 18px 0;">
      Hi ${hostName}, the rental reservation for <strong>"${itemTitle}"</strong> is confirmed. Your inventory calendar has been automatically locked from <strong>${startDate}</strong> to <strong>${endDate}</strong> to prevent any double-booking.
    </p>

    <div class="info-card">
      <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0;">
        📋 Confirmed Handover Details
      </h3>
      <table class="info-table">
        <tr>
          <td class="label">Booking Ref:</td>
          <td class="value" style="color: #006948;">${ref}</td>
        </tr>
        <tr>
          <td class="label">Renter Name:</td>
          <td class="value">${booking.renter_name}</td>
        </tr>
        <tr>
          <td class="label">Renter Phone / WhatsApp:</td>
          <td class="value"><a href="tel:${booking.renter_phone}" style="color: #006948;">${booking.renter_phone}</a></td>
        </tr>
        <tr>
          <td class="label">Renter NIC / ID:</td>
          <td class="value">${booking.renter_nic || "Verified"}</td>
        </tr>
        <tr>
          <td class="label">Locked Dates:</td>
          <td class="value">${startDate} to ${endDate} (${days} Days)</td>
        </tr>
        <tr>
          <td class="label">Expected Net Payout:</td>
          <td class="value" style="font-size: 15px; color: #16a34a;">LKR ${hostPayout}</td>
        </tr>
      </table>
    </div>

    <p style="font-size: 13px; color: #475569; line-height: 1.5;">
      💰 <strong>Direct Settlement:</strong> LankaPay will disburse LKR ${hostPayout} directly to your linked bank account upon verification of gear handover.
    </p>

    <div style="text-align: center; margin: 24px 0 12px 0;">
      <a href="${FRONTEND_URL}/host-dashboard" class="btn">Open Host Dashboard</a>
    </div>
  `;

  // Send both asynchronously with try/catch
  await Promise.allSettled([
    sendMail({
      to: customerEmail,
      subject: customerSubject,
      html: renderEmailWrapper(customerPreheader, customerBadge, customerHtml),
      previewText: `Confirmed Rental Voucher for ${itemTitle} (${ref}). Pickup on ${startDate}.`,
    }),
    sendMail({
      to: hostEmail,
      subject: hostSubject,
      html: renderEmailWrapper(hostPreheader, hostBadge, hostHtml),
      previewText: `Calendar locked for ${itemTitle} (${startDate} - ${endDate}). Net payout: LKR ${hostPayout}.`,
    }),
  ]);
};
