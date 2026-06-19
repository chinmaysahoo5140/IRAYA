import twilio from "twilio";

let client: ReturnType<typeof twilio> | null = null;

export const getTwilioClient = (): ReturnType<typeof twilio> => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Missing Twilio configuration environment variables (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN).");
  }

  if (!client) {
    client = twilio(accountSid, authToken);
  }
  return client;
};

export const getVerifyServiceSid = (): string => {
  const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!verifyServiceSid) {
    throw new Error("Missing Twilio Verify Service SID environment variable (TWILIO_VERIFY_SERVICE_SID).");
  }

  return verifyServiceSid;
};
