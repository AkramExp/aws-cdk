import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cdk from "aws-cdk-lib";
import * as path from "path";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class LambdaStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFunc = new lambda.Function(this, "lambda-function", {
      runtime: lambda.Runtime.NODEJS_20_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(3),
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../src")),
    });

    const api = new apigateway.LambdaRestApi(this, "HelloWorldApi", {
      handler: lambdaFunc,
      proxy: false,
    });

    const helloResource = api.root.addResource("hello");
    helloResource.addMethod("GET");
  }
}
