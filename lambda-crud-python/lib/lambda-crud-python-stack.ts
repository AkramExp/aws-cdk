import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { Cors, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";

export class LambdaCrudPythonStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dbTable = new Table(this, "DbTable", {
      tableName: "DbTable",
      partitionKey: { name: "id", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const api = new RestApi(this, "RestApi", {
      restApiName: "RestApi",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    const createLambda = new lambda.Function(this, "CreateLambda", {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: "create.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../src/handlers")),
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    const readLambda = new lambda.Function(this, "ReadLambda", {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: "read.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../src/handlers")),
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    const updateLambda = new lambda.Function(this, "UpdateLambda", {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: "update.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../src/handlers")),
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    const deleteLambda = new lambda.Function(this, "DeleteLambda", {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: "delete.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "/../src/handlers")),
      environment: {
        TABLE_NAME: dbTable.tableName,
      },
    });

    dbTable.grantReadWriteData(createLambda);
    dbTable.grantReadWriteData(readLambda);
    dbTable.grantReadWriteData(updateLambda);
    dbTable.grantReadWriteData(deleteLambda);

    const items = api.root.addResource("items");
    const item = items.addResource("{id}");

    items.addMethod("POST", new LambdaIntegration(createLambda));
    item.addMethod("GET", new LambdaIntegration(readLambda));
    item.addMethod("PATCH", new LambdaIntegration(updateLambda));
    item.addMethod("DELETE", new LambdaIntegration(deleteLambda));
  }
}
