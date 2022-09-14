/* eslint-disable @typescript-eslint/no-unused-vars */
import { App, Stack } from '@serverless-stack/resources';
import { aws_config as config } from 'aws-cdk-lib';

/**
 * AWS Config requires a one-time setup per account, which creates some resources:
 * ConfigurationRecorder and a DeliveryChannel. CDK should be capable doing it, but
 * as it tries to create some IAM roles under the hood, they either failed or the update
 * failed so essentially it is not really possible to bootstrap AWS Config with CDK.
 *
 * https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_config.CfnConfigurationRecorder.html
 *
 * See related issues here: https://github.com/aws/aws-cdk/issues/5872
 * and here: https://github.com/aws/aws-cdk/issues/3577#issue-478181378
 *
 */
export class AnyuppConfigStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);
    const app = this.node.root as App;

    const lambdaFunctionPublicAccessProhibited = new config.ManagedRule(
      this,
      'LAMBDA_FUNCTION_PUBLIC_ACCESS_PROHIBITED',
      {
        identifier:
          config.ManagedRuleIdentifiers
            .LAMBDA_FUNCTION_PUBLIC_ACCESS_PROHIBITED,
      },
    );
    const lambdaDlqCheck = new config.ManagedRule(this, 'LAMBDA_DLQ_CHECK', {
      identifier: config.ManagedRuleIdentifiers.LAMBDA_DLQ_CHECK,
    });
    const secretsManagerRotationEnabledCheck = new config.ManagedRule(
      this,
      'SECRETSMANAGER_ROTATION_ENABLED_CHECK',
      {
        identifier:
          config.ManagedRuleIdentifiers.SECRETSMANAGER_ROTATION_ENABLED_CHECK,
      },
    );
    const secretsManagerScheduledRotationSuccessCheck = new config.ManagedRule(
      this,
      'SECRETSMANAGER_SCHEDULED_ROTATION_SUCCESS_CHECK',
      {
        identifier:
          config.ManagedRuleIdentifiers
            .SECRETSMANAGER_SCHEDULED_ROTATION_SUCCESS_CHECK,
      },
    );
    const ec2SecurityGroupIncomingSshDisabled = new config.ManagedRule(
      this,
      'EC2_SECURITY_GROUPS_INCOMING_SSH_DISABLED',
      {
        identifier:
          config.ManagedRuleIdentifiers
            .EC2_SECURITY_GROUPS_INCOMING_SSH_DISABLED,
      },
    );
    const ec2EbsEncryptionByDefault = new config.ManagedRule(
      this,
      'EC2_EBS_ENCRYPTION_BY_DEFAULT',
      {
        identifier: config.ManagedRuleIdentifiers.EC2_EBS_ENCRYPTION_BY_DEFAULT,
      },
    );
    const ec2InstancesInVpc = new config.ManagedRule(
      this,
      'EC2_INSTANCES_IN_VPC',
      {
        identifier: config.ManagedRuleIdentifiers.EC2_INSTANCES_IN_VPC,
      },
    );
    const ec2SecurityGroupsRestrictedIncomingTraffic = new config.ManagedRule(
      this,
      'EC2_SECURITY_GROUPS_RESTRICTED_INCOMING_TRAFFIC',
      {
        identifier:
          config.ManagedRuleIdentifiers
            .EC2_SECURITY_GROUPS_RESTRICTED_INCOMING_TRAFFIC,
      },
    );
    const ec2VolumneInUseCheck = new config.ManagedRule(
      this,
      'EC2_VOLUME_INUSE_CHECK',
      {
        identifier: config.ManagedRuleIdentifiers.EC2_VOLUME_INUSE_CHECK,
      },
    );
    const eipAttached = new config.ManagedRule(this, 'EIP_ATTACHED', {
      identifier: config.ManagedRuleIdentifiers.EIP_ATTACHED,
    });
    const elbCrossZoneLoadBalancingEnabled = new config.ManagedRule(
      this,
      'ELB_CROSS_ZONE_LOAD_BALANCING_ENABLED',
      {
        identifier:
          config.ManagedRuleIdentifiers.ELB_CROSS_ZONE_LOAD_BALANCING_ENABLED,
      },
    );
    const autoscalingGroupElbHealthcheckRequired = new config.ManagedRule(
      this,
      'AUTOSCALING_GROUP_ELB_HEALTHCHECK_REQUIRED',
      {
        identifier:
          config.ManagedRuleIdentifiers
            .AUTOSCALING_GROUP_ELB_HEALTHCHECK_REQUIRED,
      },
    );
    const albHttpToHttpsRedirectionCheck = new config.ManagedRule(
      this,
      'ALB_HTTP_TO_HTTPS_REDIRECTION_CHECK',
      {
        identifier:
          config.ManagedRuleIdentifiers.ALB_HTTP_TO_HTTPS_REDIRECTION_CHECK,
      },
    );
    const apiGwExecutionLoggingEnabled = new config.ManagedRule(
      this,
      'API_GW_EXECUTION_LOGGING_ENABLED',
      {
        identifier:
          config.ManagedRuleIdentifiers.API_GW_EXECUTION_LOGGING_ENABLED,
      },
    );
    const apiGwCacheEnabledAndEncrypted = new config.ManagedRule(
      this,
      'API_GW_CACHE_ENABLED_AND_ENCRYPTED',
      {
        identifier:
          config.ManagedRuleIdentifiers.API_GW_CACHE_ENABLED_AND_ENCRYPTED,
      },
    );
    const ebsEncryptedVolumes = new config.ManagedRule(
      this,
      'EBS_ENCRYPTED_VOLUMES',
      {
        identifier: config.ManagedRuleIdentifiers.EBS_ENCRYPTED_VOLUMES,
      },
    );
    const elbLoggingEnabled = new config.ManagedRule(
      this,
      'ELB_LOGGING_ENABLED',
      {
        identifier: config.ManagedRuleIdentifiers.ELB_LOGGING_ENABLED,
      },
    );
    const elbTlsHttpsListenersOnly = new config.ManagedRule(
      this,
      'ELB_TLS_HTTPS_LISTENERS_ONLY',
      {
        identifier: config.ManagedRuleIdentifiers.ELB_TLS_HTTPS_LISTENERS_ONLY,
      },
    );
    const guardDutyEnabledCentralized = new config.ManagedRule(
      this,
      'GUARDDUTY_ENABLED_CENTRALIZED',
      {
        identifier: config.ManagedRuleIdentifiers.GUARDDUTY_ENABLED_CENTRALIZED,
      },
    );
    const guardDutyNonArchivedFindings = new config.ManagedRule(
      this,
      'GUARDDUTY_NON_ARCHIVED_FINDINGS',
      {
        identifier:
          config.ManagedRuleIdentifiers.GUARDDUTY_NON_ARCHIVED_FINDINGS,
      },
    );
    const vpcDefaultSecurityGroupClosed = new config.ManagedRule(
      this,
      'VPC_DEFAULT_SECURITY_GROUP_CLOSED',
      {
        identifier:
          config.ManagedRuleIdentifiers.VPC_DEFAULT_SECURITY_GROUP_CLOSED,
      },
    );
    const iamAccessKeysRotatedRule = new config.ManagedRule(
      this,
      'AccessKeysRotated',
      {
        identifier: config.ManagedRuleIdentifiers.ACCESS_KEYS_ROTATED,
        inputParameters: {
          maxAccessKeyAge: 90,
        },
        maximumExecutionFrequency:
          config.MaximumExecutionFrequency.TWENTY_FOUR_HOURS,
      },
    );
    const iamPasswordPolicyRule = new config.ManagedRule(
      this,
      'IAM_PASSWORD_POLICY',
      {
        identifier: config.ManagedRuleIdentifiers.IAM_PASSWORD_POLICY,
      },
    );
    const iamRootAccessKeyCheckRule = new config.ManagedRule(
      this,
      'IAM_ROOT_ACCESS_KEY_CHECK',
      {
        identifier: config.ManagedRuleIdentifiers.IAM_ROOT_ACCESS_KEY_CHECK,
      },
    );
    const s3BucketLoggingEnabledRule = new config.ManagedRule(
      this,
      'S3_BUCKET_LOGGING_ENABLED',
      {
        identifier: config.ManagedRuleIdentifiers.S3_BUCKET_LOGGING_ENABLED,
      },
    );
    const s3BucketPublicWriteProhibitedRule = new config.ManagedRule(
      this,
      'S3_BUCKET_PUBLIC_WRITE_PROHIBITED',
      {
        identifier:
          config.ManagedRuleIdentifiers.S3_BUCKET_PUBLIC_WRITE_PROHIBITED,
      },
    );
    const s3BucketServerSideEncryptionEnabledRule = new config.ManagedRule(
      this,
      'S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED',
      {
        identifier:
          config.ManagedRuleIdentifiers
            .S3_BUCKET_SERVER_SIDE_ENCRYPTION_ENABLED,
      },
    );
    const s3BucketSLLRequestsOnlyRule = new config.ManagedRule(
      this,
      'S3_BUCKET_SSL_REQUESTS_ONLY',
      {
        identifier: config.ManagedRuleIdentifiers.S3_BUCKET_SSL_REQUESTS_ONLY,
      },
    );
    const s3BucketVersioningEnabledRule = new config.ManagedRule(
      this,
      'S3_BUCKET_VERSIONING_ENABLED',
      {
        identifier: config.ManagedRuleIdentifiers.S3_BUCKET_VERSIONING_ENABLED,
      },
    );
    const rootAccountMFAEnabledRule = new config.ManagedRule(
      this,
      'ROOT_ACCOUNT_MFA_ENABLED',
      {
        identifier: config.ManagedRuleIdentifiers.ROOT_ACCOUNT_MFA_ENABLED,
      },
    );
    const mfAEnabledForConsolAccessRule = new config.ManagedRule(
      this,
      'MFA_ENABLED_FOR_IAM_CONSOLE_ACCESS',
      {
        identifier:
          config.ManagedRuleIdentifiers.MFA_ENABLED_FOR_IAM_CONSOLE_ACCESS,
      },
    );
    const securityHubEnabledRule = new config.ManagedRule(
      this,
      'SECURITYHUB_ENABLED',
      {
        identifier: config.ManagedRuleIdentifiers.SECURITYHUB_ENABLED,
      },
    );
    const cloudTrailEnabledRule = new config.ManagedRule(
      this,
      'CLOUD_TRAIL_ENABLED',
      {
        identifier: config.ManagedRuleIdentifiers.CLOUD_TRAIL_ENABLED,
      },
    );
    const cloudTrailEncryptionEnabledRule = new config.ManagedRule(
      this,
      'CLOUD_TRAIL_ENCRYPTION_ENABLED',
      {
        identifier:
          config.ManagedRuleIdentifiers.CLOUD_TRAIL_ENCRYPTION_ENABLED,
      },
    );
    const cloudTrailCloudWatchLogsEnabledRule = new config.ManagedRule(
      this,
      'CLOUD_TRAIL_CLOUD_WATCH_LOGS_ENABLED',
      {
        identifier:
          config.ManagedRuleIdentifiers.CLOUD_TRAIL_CLOUD_WATCH_LOGS_ENABLED,
      },
    );
    /*const cloudFrontDefaultRootObjectConfiguredRule = new config.ManagedRule(
      this,
      'CLOUDFRONT_DEFAULT_ROOT_OBJECT_CONFIGURED',
      {
        identifier:
          config.ManagedRuleIdentifiers
            .CLOUDFRONT_DEFAULT_ROOT_OBJECT_CONFIGURED,
      },
    );
    const cloudFrontOriginAccessIdentityEnabledRule = new config.ManagedRule(
      this,
      'CLOUDFRONT_ORIGIN_ACCESS_IDENTITY_ENABLED',
      {
        identifier:
          config.ManagedRuleIdentifiers
            .CLOUDFRONT_ORIGIN_ACCESS_IDENTITY_ENABLED,
      },
    );
    const cloudFrontViewerPolicyHttpsRule = new config.ManagedRule(
      this,
      'CLOUDFRONT_VIEWER_POLICY_HTTPS',
      {
        identifier:
          config.ManagedRuleIdentifiers.CLOUDFRONT_VIEWER_POLICY_HTTPS,
      },
    );*/
    const dynamoDbAutoscalingEnabledRule = new config.ManagedRule(
      this,
      'DYNAMODB_AUTOSCALING_ENABLED',
      {
        identifier: config.ManagedRuleIdentifiers.DYNAMODB_AUTOSCALING_ENABLED,
      },
    );
    const dynamoDbInBackupPlanRule = new config.ManagedRule(
      this,
      'DYNAMODB_IN_BACKUP_PLAN',
      {
        identifier: config.ManagedRuleIdentifiers.DYNAMODB_IN_BACKUP_PLAN,
      },
    );
    const dynamoDbTableEncryptedKmsRule = new config.ManagedRule(
      this,
      'DYNAMODB_TABLE_ENCRYPTED_KMS',
      {
        identifier: config.ManagedRuleIdentifiers.DYNAMODB_TABLE_ENCRYPTED_KMS,
      },
    );
    const waf2LoggingEnabled = new config.ManagedRule(
      this,
      'WAFV2_LOGGING_ENABLED',
      {
        identifier: config.ManagedRuleIdentifiers.WAFV2_LOGGING_ENABLED,
      },
    );
    const vpcFlowLogsEnabled = new config.ManagedRule(
      this,
      'VPC_FLOW_LOGS_ENABLED',
      {
        identifier: config.ManagedRuleIdentifiers.VPC_FLOW_LOGS_ENABLED,
      },
    );
    const vpcSgOpenOnlytoAuthorizedPorts = new config.ManagedRule(
      this,
      'VPC_SG_OPEN_ONLY_TO_AUTHORIZED_PORTS',
      {
        identifier:
          config.ManagedRuleIdentifiers.VPC_SG_OPEN_ONLY_TO_AUTHORIZED_PORTS,
      },
    );
  }
}
