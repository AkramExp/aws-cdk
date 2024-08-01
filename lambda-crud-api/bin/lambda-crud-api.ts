#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { LambdaCrudApiStack } from "../lib/lambda-crud-api-stack";

const app = new cdk.App();
new LambdaCrudApiStack(app, "LambdaCrudApiStackCrudApi", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
