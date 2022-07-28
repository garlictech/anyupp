import {
  Duration,
  aws_backup,
  aws_kms,
  aws_events,
  aws_iam,
} from 'aws-cdk-lib';
import { App, Stack } from '@serverless-stack/resources';

/**
 *
 */
export class AnyuppBackupStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);
    const app = this.node.root as App;
    const stage = app.stage;

    const dynamoBackupPlan =
      aws_backup.BackupPlan.dailyWeeklyMonthly5YearRetention(
        this,
        `${stage}-DynamoBackupPlan`,
      );
    const backupKey = new aws_kms.Key(this, `${stage}-anyupp-backup-key`);

    dynamoBackupPlan.addRule(
      new aws_backup.BackupPlanRule({
        enableContinuousBackup: true,
        deleteAfter: Duration.days(30),
      }),
    );

    dynamoBackupPlan.addRule(
      new aws_backup.BackupPlanRule({
        completionWindow: Duration.hours(2),
        startWindow: Duration.hours(1),
        scheduleExpression: aws_events.Schedule.cron({
          day: '*',
          hour: '2',
          minute: '0',
        }),
        moveToColdStorageAfter: Duration.days(20),
      }),
    );

    dynamoBackupPlan.addSelection('DynamoTables', {
      resources: [aws_backup.BackupResource.fromTag('user:Stack', stage)],
    });

    /**
     * This requires an extra one-time setup in every account/region.
     */
    const s3BackupPlan = aws_backup.BackupPlan.dailyWeeklyMonthly5YearRetention(
      this,
      `${stage}-S3BackupPlan`,
    );

    s3BackupPlan.addRule(
      new aws_backup.BackupPlanRule({
        moveToColdStorageAfter: Duration.days(20),
      }),
    );

    s3BackupPlan.addSelection('S3Buckets', {
      resources: [aws_backup.BackupResource.fromTag('user:Stack', stage)],
    });

    const adminUser = aws_iam.User.fromUserName(
      this,
      'admin-user-zsolt',
      'zsolt',
    );

    const vault = new aws_backup.BackupVault(this, 'AnyUpp-Vault', {
      encryptionKey: backupKey,
    });

    vault.blockRecoveryPointDeletion();
    vault.grant(adminUser, 'backup:DeleteRecoveryPoint');

    //TODO: copy backups to another region
  }
}
