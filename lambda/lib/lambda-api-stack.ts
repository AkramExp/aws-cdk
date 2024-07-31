import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import * as iam from "aws-cdk-lib/aws-iam";

export class LambdaApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFunction = new lambda.Function(this, "lambda-function", {
      runtime: lambda.Runtime.NODEJS_20_X,
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      handler: "index2.main",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../src")),
    });

    const listBucketsPolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:ListAllMyBuckets"],
      resources: ["arn:aws:s3:::*"],
    });

    lambdaFunction.role?.attachInlinePolicy(
      new iam.Policy(this, "list-buckets", {
        statements: [listBucketsPolicy],
      })
    );
  }
}
