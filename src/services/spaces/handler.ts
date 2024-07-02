import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpaces } from "./UpdateSpaces";
import { deleteSpaces } from "./DeleteSpaces";
import { JsonError, MissingFieldError } from "../shared/Validator";
import { addCorsHeader } from "../shared/Utils";
import { captureAWSv3Client } from "aws-xray-sdk-core";

const ddbClient = captureAWSv3Client(new DynamoDBClient({}));

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, ddbClient);
        addCorsHeader(getResponse);
        return getResponse;
      case "POST":
        const postResponse = await postSpaces(event, ddbClient);
        addCorsHeader(postResponse);
        return postResponse;
      case "PUT":
        const putResponse = await updateSpaces(event, ddbClient);
        addCorsHeader(putResponse);
        return putResponse;
      case "DELETE":
        const deleteResponse = await deleteSpaces(event, ddbClient);
        addCorsHeader(deleteResponse);
        return deleteResponse;
      default:
        return {
          statusCode: 405,
          body: JSON.stringify("Method not allowed"),
        };
    }
  } catch (error) {
    if (error instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }
    if (error instanceof JsonError) {
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
}

export { handler };
