import { Stack, StackProps } from "aws-cdk-lib";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";

import { Construct } from "constructs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

export class Ec2AutomationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFunc = new NodejsFunction(this, "ItemsLambda", {
      entry: "src/endpoints/ec2.ts",
      handler: "handler",
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
    });

    lambdaFunc.addToRolePolicy(
      new PolicyStatement({
        actions: [
          "ec2:RunInstances",
          "ec2:CreateTags",
          "ec2:DescribeInstances",
          "ec2:DescribeInstanceStatus",
          "ec2:DescribeImages",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeSubnets",
          "ec2:DescribeKeyPairs",
          "ec2:DescribeInstanceTypes",
          "iam:PassRole",
        ],
        resources: ["*"],
      })
    );

    const api = new RestApi(this, "Ec2Api", {
      restApiName: "Ec2Api",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    const ec2 = api.root.addResource("ec2");

    ec2.addMethod("POST", new LambdaIntegration(lambdaFunc));

    // Body type to pass in POST request
    //   {
    //     "ImageId": "ami-0ad21ae1d0696ad58",
    //     "InstanceType": "t2.micro",
    //     "MinCount": 1,
    //     "MaxCount": 1
    //     "Name": "myEc2"
    // }
  }
}
