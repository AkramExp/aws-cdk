import { APIGatewayProxyEvent } from "aws-lambda";
import { deleteItem } from "../handlers/posts/delete";
import { updateItem } from "../handlers/posts/update";
import { readItem } from "../handlers/posts/read";

export const handler = async (event: APIGatewayProxyEvent) => {
  const id = event.pathParameters?.id;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing path parameter: id" }),
    };
  }

  try {
    switch (event.httpMethod) {
      case "GET":
        return await readItem({ id });
      case "DELETE":
        return await deleteItem({ id });
      case "PATCH":
        return await updateItem({ id, data: event.body });
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
