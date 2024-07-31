import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cdk from "aws-cdk-lib";
import * as lamba from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class LambdaDynamoDbStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const s3Bucket = new cdk.aws_s3.Bucket(this, "s3Bucket", {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const dynamoTable = new dynamodb.Table(this, "dynamoTable", {
      tableName: "MyTable",
      partitionKey: { name: "user_id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "created_at", type: dynamodb.AttributeType.NUMBER },
    });

    const lambdaFucn = new lamba.Function(this, "lambdaFunc", {
      functionName: "lambdaFunc",
      runtime: lamba.Runtime.NODEJS_20_X,
      memorySize: 1024,
      handler: "index.handler",
      code: lamba.Code.fromAsset(path.join(__dirname, "/../src")),
      initialPolicy: [
        new cdk.aws_iam.PolicyStatement({
          effect: cdk.aws_iam.Effect.ALLOW,
          actions: ["s3:*"],
          resources: [s3Bucket.bucketArn],
        }),
        new cdk.aws_iam.PolicyStatement({
          effect: cdk.aws_iam.Effect.ALLOW,
          actions: ["dynamodb:*"],
          resources: [dynamoTable.tableArn],
        }),
      ],
    });

    dynamoTable.grantReadWriteData(lambdaFucn);

    s3Bucket.grantReadWrite(lambdaFucn);
  }
}
