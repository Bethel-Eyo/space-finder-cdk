import * as dotenv from "dotenv";
import { resolve } from "path";

// 1. Configure dotenv to read from our `.env` file
dotenv.config({ path: resolve(__dirname, "..", "..", ".env") });

// 2. Define a TS Type to type the returned envs from our function below.
export type ConfigProps = {
  META_TOKEN: string;
  META_WEBHOOKURL: string;
};

// 3. Define a function to retrieve our env variables
export const getConfig = (): ConfigProps => ({
  META_TOKEN: process.env.META_TOKEN || "unknown",
  META_WEBHOOKURL: process.env.META_WEBHOOKURL || "unknown",
});
