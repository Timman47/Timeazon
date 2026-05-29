#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack.js';

const stackName = process.env.GROUP_PROJECT_STACK_NAME // maybe add which stack to the stack name eg. ambiance-timeazon-dev
const environmentName = process.env.APP_ENV || 'dev'

if (!stackName || !stackName.trim()) {
  console.error('Environment variable GROUP_PROJECT_STACK_NAME is not set')
  process.exit(1)
}

if (!['dev', 'prod'].includes(environmentName)) {
  console.error("APP ENV must be either 'dev' or 'prod'")
  process.exit(1)
}

const settings = {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT || 'NOT_SET',
    region: process.env.CDK_DEFAULT_REGION || 'NOT_SET'
  },
  stackName: stackName,
  certArn: cdk.Fn.importValue('CTASharedCertArn'), // SSL cert for HTTPS
  permissionsBoundaryPolicyName: 'scopePermissions',
  domainName: 'cta-training.academy', // Root domain
  subDomain: stackName.toLowerCase(),
  dbName: 'dev',
  vpcName: 'CTASharedVPC-vpc',
  devWebAclArn: 'arn:aws:wafv2:us-east-1:827602716979:global/webacl/ambiance-timeazon-dev-whitelist/17d3f6f4-e09e-429e-8d00-7b691ff6d7c6',
  environmentName
}

const app = new cdk.App();

if (environmentName === 'dev'){
  new CdkStack(app, 'devStack', {
    env: settings.env,
    permissionsBoundaryPolicyName: settings.permissionsBoundaryPolicyName,
    subDomain: settings.subDomain,
    stackName: settings.stackName,
    certArn: settings.certArn,
    domainName: settings.domainName,
    dbName: settings.dbName,
    vpcName: settings.vpcName,
    devWebAclArn: settings.devWebAclArn,
    environmentName : 'dev'
  });
}

if (environmentName === 'prod') {
  new CdkStack(app, 'prodStack', {
    env: settings.env,
    permissionsBoundaryPolicyName: settings.permissionsBoundaryPolicyName,
    subDomain: settings.subDomain,
    stackName: settings.stackName,
    certArn: settings.certArn,
    domainName: settings.domainName,
    dbName: settings.dbName,
    vpcName: settings.vpcName,
    devWebAclArn: undefined,
    environmentName: 'prod'
  });
}

