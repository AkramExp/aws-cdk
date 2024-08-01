import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

interface IPost {
  title: string;
  description: string;
  author: string;
  publicationDate: string;
}

const dynamodb = new DynamoDB({});

export async function createItem(body: string | null) {
  const uuid = randomUUID();

  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing body" }),
    };
  }

  const bodyParsed = JSON.parse(body) as IPost;

  await dynamodb.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: {
        id: uuid,
        ...bodyParsed,
      },
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Item created", itemId: uuid }),
  };
}
