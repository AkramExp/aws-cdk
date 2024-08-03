#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LambdaCrudPythonStack } from '../lib/lambda-crud-python-stack';

const app = new cdk.App();
new LambdaCrudPythonStack(app, 'LambdaCrudPythonStack');
