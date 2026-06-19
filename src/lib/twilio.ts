import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifyServiceSid) {
  throw new Error("Missing Twilio configuration environment variables.");
}

export const twilioClient = twilio(accountSid, authToken);
export const TWILIO_VERIFY_SERVICE_SID = verifyServiceSid;
