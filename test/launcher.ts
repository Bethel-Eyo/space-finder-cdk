import { handler } from '../src/services/spaces/handler';

process.env.AWS_REGION = "us-east-1";
process.env.TABLE_NAME = "SpaceTable-0affccfd1adb"
handler(
  {
    httpMethod: "POST",
    body: JSON.stringify({
      location: "Dundalk",
    }),
  } as any,
  {} as any
);
