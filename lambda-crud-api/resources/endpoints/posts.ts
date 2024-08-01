import { APIGatewayProxyEvent } from "aws-lambda";
import { createItem } from "../handlers/posts/create";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    switch (event.httpMethod) {
      case "POST":
        return await createItem(event.body);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid HTTP method" }),
        };
    }
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
