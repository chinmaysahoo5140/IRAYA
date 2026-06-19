import twilio from "twilio";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
if (!accountSid || !authToken || !verifyServiceSid) {
  throw new Error("Missing Twilio configuration environment variables.");
}
const twilioClient = twilio(accountSid, authToken);
const TWILIO_VERIFY_SERVICE_SID = verifyServiceSid;
export {
  TWILIO_VERIFY_SERVICE_SID,
  twilioClient
};
