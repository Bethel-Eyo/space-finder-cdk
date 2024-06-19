import { handler } from '../src/services/spaces/handler';

process.env.AWS_REGION = "us-east-1";
process.env.TABLE_NAME = "SpacesTable-0affcc15695b"
handler(
  {
    httpMethod: "GET",
  } as any,
  {} as any
);
