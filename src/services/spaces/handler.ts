import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpaces } from "./UpdateSpaces";
import { deleteSpaces } from "./DeleteSpaces";

const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let message: string = "";

  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, ddbClient);
        return getResponse;
      case "POST":
        const postResponse = await postSpaces(event, ddbClient);
        return postResponse;
      case "PUT":
        const putResponse = await updateSpaces(event, ddbClient);
        return putResponse;
      case "DELETE":
        const deleteResponse = await deleteSpaces(event, ddbClient);
        return deleteResponse;
      default:
        break;
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };

  return response;
}

export { handler };
