import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

const dynamodb = new DynamoDB({});

export async function readItem({ id }: { id: string }) {
  const result = await dynamodb.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: id,
      },
    })
  );

  if (!result.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "Item not found" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
}
