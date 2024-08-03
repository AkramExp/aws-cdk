import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, Table, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class LambdaCrudApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create  DynamoDB table
    const dbTable = new Table(this, "DbTable", {
      tableName: "DbTable",
      partitionKey: { name: "id", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    // Create our API Gateway
    const api = new RestApi(this, "RestAPI", {
      restApiName: "RestAPI",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    // Create Lambda functions to handle requests
    const itemsLambda = new NodejsFunction(this, "ItemsLambda", {
      entry: "resources/endpoints/items.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    const itemLambda = new NodejsFunction(this, "ItemLambda", {
      entry: "resources/endpoints/item.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    // Grant Lambda functions access to DynamoDB table
    dbTable.grantReadWriteData(itemsLambda);
    dbTable.grantReadWriteData(itemLambda);

    // Define API Gateway endpoints
    const items = api.root.addResource("items");
    const item = items.addResource("{id}");

    // Connect Lambda functions to API Gateway endpoints
    const itemsIntegration = new LambdaIntegration(itemsLambda);
    const itemIntegration = new LambdaIntegration(itemLambda);

    // Define  API Gateway methods
    items.addMethod("POST", itemsIntegration);

    item.addMethod("GET", itemIntegration);
    item.addMethod("DELETE", itemIntegration);
    item.addMethod("PATCH", itemIntegration);
  }
}
