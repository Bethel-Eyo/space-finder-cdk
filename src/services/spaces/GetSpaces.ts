import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters) {
    if ("id" in event.queryStringParameters) {
      /**if there are queryStringParameters, then we get a single space */
      const spaceId = event.queryStringParameters["id"];
      const getItemResponse = await ddbClient.send(
        new GetItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            id: {
              S: spaceId as string,
            },
          },
        })
      );
      if (getItemResponse.Item) {
        const unmarshallItem = unmarshall(getItemResponse.Item)
        return {
          statusCode: 200,
          body: JSON.stringify(unmarshallItem),
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify(`Space with id ${spaceId} not found!`),
        };
      }
    } else {
      return {
        statusCode: 400,
        body: '{"error": "id is required"}',
      };
    }
  }

  /**If there are no queryStringParameters then we get all the spaces */
  const result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );
  const unmarshalledItems = result.Items?.map(item => unmarshall(item))
  console.log(unmarshalledItems);

  return {
    statusCode: 200,
    body: JSON.stringify(unmarshalledItems),
  };
}
