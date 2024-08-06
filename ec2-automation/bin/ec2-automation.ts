#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { Ec2AutomationStack } from '../lib/ec2-automation-stack';

const app = new cdk.App();
new Ec2AutomationStack(app, 'Ec2AutomationStack');
