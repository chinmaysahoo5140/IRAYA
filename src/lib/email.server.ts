// Server-side transactional email sender.
// Integrates with Resend or logs to console as a fallback.

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(
      `\n================= EMAIL LOG (MOCK) =================\n` +
      `To:      ${to}\n` +
      `Subject: ${subject}\n` +
      `Body:\n${html.replace(/<[^>]*>/g, " ").trim()}\n` +
      `====================================================\n`
    );
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "IRAYA Security <security@iraya.world>",
        to,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      console.error(`Resend API failed: ${res.status} ${await res.text()}`);
    }
  } catch (err) {
    console.error("Failed to send email via Resend:", err);
  }
}

export async function sendNewDeviceLoginAlert(email: string, details: { ip: string; country: string; device: string; blockUrl: string }) {
  await sendEmail({
    to: email,
    subject: "Security Alert: New sign-in detected",
    html: `
      <h2>New Sign-in Detected</h2>
      <p>We detected a new sign-in to your IRAYA account from an unrecognized device.</p>
      <ul>
        <li><strong>Device:</strong> ${details.device}</li>
        <li><strong>IP Address:</strong> ${details.ip}</li>
        <li><strong>Location:</strong> ${details.country}</li>
        <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p>If this was not you, please immediately block this session by clicking below:</p>
      <p><a href="${details.blockUrl}" style="background:#1a1a1a;color:#fff;padding:10px 20px;text-decoration:none;">Block This Session</a></p>
      <p>This link is valid for 15 minutes.</p>
    `,
  });
}

export async function sendPasswordChangedAlert(email: string, details: { ip: string; resetUrl: string }) {
  await sendEmail({
    to: email,
    subject: "Your IRAYA password was changed",
    html: `
      <h2>Password Changed</h2>
      <p>Your account password was successfully changed at ${new Date().toLocaleString()} from IP address ${details.ip}.</p>
      <p>If you did not perform this change, please immediately reset your password by clicking below:</p>
      <p><a href="${details.resetUrl}" style="background:#d93025;color:#fff;padding:10px 20px;text-decoration:none;">Reset My Password</a></p>
      <p>This link is valid for 15 minutes.</p>
    `,
  });
}

export async function sendEmailChangeAttemptAlert(oldEmail: string, details: { newEmail: string; confirmUrl: string }) {
  await sendEmail({
    to: oldEmail,
    subject: "Confirm change of email address",
    html: `
      <h2>Email Change Requested</h2>
      <p>A request was made to change your email address to <strong>${details.newEmail}</strong>.</p>
      <p>To approve this change, please click the confirmation link below:</p>
      <p><a href="${details.confirmUrl}" style="background:#1a1a1a;color:#fff;padding:10px 20px;text-decoration:none;">Confirm Email Change</a></p>
      <p>If you did not request this, you can ignore this email and your email will not be changed.</p>
      <p>This link is valid for 15 minutes.</p>
    `,
  });
}

export async function sendNewDeliveryAddressAlert(email: string, details: { label: string; address: string; removeUrl: string }) {
  await sendEmail({
    to: email,
    subject: "A new delivery address was added",
    html: `
      <h2>Delivery Address Added</h2>
      <p>A new shipping address was added to your account:</p>
      <p><strong>${details.label}:</strong> ${details.address}</p>
      <p>If this was not you, please remove it by clicking below:</p>
      <p><a href="${details.removeUrl}" style="background:#d93025;color:#fff;padding:10px 20px;text-decoration:none;">Not You? Remove Address</a></p>
      <p>This link is valid for 15 minutes.</p>
    `,
  });
}

export async function sendSuspiciousLoginBlockedAlert(email: string, details: { ip: string; country: string; city: string; device: string; verifyUrl: string }) {
  await sendEmail({
    to: email,
    subject: "Immediate Alert: Suspicious sign-in attempt blocked",
    html: `
      <h2>Suspicious Sign-in Blocked</h2>
      <p>We blocked an anomalous login attempt to your account to keep it safe.</p>
      <ul>
        <li><strong>IP Address:</strong> ${details.ip}</li>
        <li><strong>Location:</strong> ${details.city}, ${details.country}</li>
        <li><strong>Device:</strong> ${details.device}</li>
        <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p>Was this you? If you were trying to log in, you can confirm it was you by clicking below:</p>
      <p><a href="${details.verifyUrl}" style="background:#1a1a1a;color:#fff;padding:10px 20px;text-decoration:none;">Yes, It Was Me</a></p>
      <p>This link is valid for 15 minutes.</p>
    `,
  });
}

export async function sendAccountLockedAlert(email: string, details: { reason: string; unlockUrl: string }) {
  await sendEmail({
    to: email,
    subject: "Your IRAYA account has been locked",
    html: `
      <h2>Account Temporarily Locked</h2>
      <p>Your IRAYA account has been locked due to: <strong>${details.reason}</strong>.</p>
      <p>To unlock your account immediately, please follow this link:</p>
      <p><a href="${details.unlockUrl}" style="background:#1a1a1a;color:#fff;padding:10px 20px;text-decoration:none;">Unlock My Account</a></p>
      <p>This link is valid for 15 minutes.</p>
    `,
  });
}

export async function sendOrderPlacedConfirmation(email: string, details: { orderNumber: string; total: string; itemsHtml: string }) {
  await sendEmail({
    to: email,
    subject: `Order Confirmation: ${details.orderNumber}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Your order <strong>${details.orderNumber}</strong> has been successfully placed.</p>
      <h3>Order Summary</h3>
      <table style="width:100%;text-align:left;border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:1px solid #ddd;">
            <th style="padding:10px 0;">Item</th>
            <th style="padding:10px 0;text-align:right;">Quantity</th>
            <th style="padding:10px 0;text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${details.itemsHtml}
        </tbody>
      </table>
      <p style="margin-top:20px;font-size:18px;"><strong>Total:</strong> ${details.total}</p>
      <p>We will send you a shipping notification with a tracking link once your items are on the way.</p>
    `,
  });
}
