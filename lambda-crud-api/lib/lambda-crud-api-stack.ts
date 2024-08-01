import { Stack, StackProps, RemovalPolicy, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AttributeType, Table, BillingMode } from "aws-cdk-lib/aws-dynamodb";
import {
  Cors,
  LambdaIntegration,
  RestApi,
  ApiKeySourceType,
  ApiKey,
  UsagePlan,
} from "aws-cdk-lib/aws-apigateway";
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
    const postsLambda = new NodejsFunction(this, "PostsLambda", {
      entry: "resources/endpoints/posts.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    const postLambda = new NodejsFunction(this, "PostLambda", {
      entry: "resources/endpoints/post.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    // Grant Lambda functions access to DynamoDB table
    dbTable.grantReadWriteData(postsLambda);
    dbTable.grantReadWriteData(postLambda);

    // Define API Gateway endpoints
    const posts = api.root.addResource("posts");
    const post = posts.addResource("{id}");

    // Connect Lambda functions to API Gateway endpoints
    const postsIntegration = new LambdaIntegration(postsLambda);
    const postIntegration = new LambdaIntegration(postLambda);

    // Define  API Gateway methods
    posts.addMethod("POST", postsIntegration);

    post.addMethod("GET", postIntegration);
    post.addMethod("DELETE", postIntegration);
    post.addMethod("PATCH", postIntegration);
  }
}
