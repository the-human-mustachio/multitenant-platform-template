/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */
import "sst"
export {}
declare module "sst" {
  export interface Resource {
    "GlobalPlatformApi": {
      "type": "sst.aws.ApiGatewayV2"
      "url": string
    }
    "GlobalPlatformBucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "GlobalPlatformTable": {
      "name": string
      "type": "sst.aws.Dynamo"
    }
    "UserOrgScoppedAssumeRole": {
      "assumeRoleArn": string
      "type": "sst.sst.Linkable"
    }
  }
}