import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

const dynamodb = new DynamoDB({});

export async function updateItem({ id, data }: { id: string; data: any }) {
  await dynamodb.send(
    new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: id,
      },
      UpdateExpression: "set #name = :name",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": JSON.parse(data).name,
      },
      ReturnValues: "UPDATED_NEW",
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Post Updated",
    }),
  };
}
