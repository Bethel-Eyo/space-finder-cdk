import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function updateSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters && "id" in event.queryStringParameters && event.body) {
    const parsedBody = JSON.parse(event.body)
    const spaceId = event.queryStringParameters["id"];
    const requestBodyKey = Object.keys(parsedBody)[0]; // get the first item/attribute being updated
    const requestBodyValue = parsedBody[requestBodyKey];

    const updateResult = await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: {
            S: spaceId as string,
          },
        },
        UpdateExpression: "set #attributeName = :attributeNewValue",
        ExpressionAttributeValues: {
          ":attributeNewValue": {
            S: requestBodyValue,
          },
        },
        ExpressionAttributeNames: {
          "#attributeName": requestBodyKey,
        },
        ReturnValues: "UPDATED_NEW",
      })
    );

    return {
      statusCode: 204,
      body: JSON.stringify(updateResult.Attributes),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify("Please provide the right args!!"),
  };
}
