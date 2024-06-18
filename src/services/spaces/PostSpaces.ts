import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

export async function postSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.body) {
    const randomId = v4();
    const item = JSON.parse(event.body);

    const result = await ddbClient.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          id: {
            S: randomId,
          },
          location: {
            S: item.location,
          },
        },
      })
    );

    console.log(result);

    return {
        statusCode: 201,
        body: JSON.stringify({id: randomId})
    }
  } else {
    return {
        statusCode: 400,
        body: "{\"error\": \"Request body is missing or empty\"}",
    }
  }
}
