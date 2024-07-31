#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { LambdaStack } from "../lib/lambda-stack";
import { LambdaApiStack } from "../lib/lambda-api-stack";
import { LambdaDynamoDbStack } from "./../lib/lambda-dynamodb-stack";

const app = new cdk.App();
new LambdaStack(app, "LambdaStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

new LambdaApiStack(app, "LambdaApiStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

new LambdaDynamoDbStack(app, "LambdaDynamoDbStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
