import { APIGatewayProxyEvent } from "aws-lambda";
import { createEc2 } from "../handlers/ec2/create";

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    switch (event.httpMethod) {
      case "POST":
        return await createEc2(event.body);
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid HTTP method" }),
        };
    }
  } catch (error) {
    console.log("This is an error", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
