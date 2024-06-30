import { SNSEvent } from "aws-lambda";
import * as dotenv from "dotenv";
dotenv.config();

const webHookUrl = process.env.META_WEBHOOKURL;
const token = process.env.META_TOKEN;

const headers = new Headers({
  "Content-Type": "application/json",
});

// @ts-ignore
async function handler(event: SNSEvent, context) {
  for (const record of event.Records) {
    console.log(`Bethel, we have a problem: ${record.Sns.Message}`);
    const response = await fetch(`${webHookUrl}?access_token=${token}`, {
      method: "POST",
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: "353899672337",
        text: {
          body: `Bethel, we have a problem: ${record.Sns.Message}`,
        },
      }),
      headers: headers,
    });
    console.log(response);
  }
}

export { handler };
