import { App, Stack } from '@serverless-stack/resources';
import { Duration, aws_backup, aws_kms, aws_events } from 'aws-cdk-lib';

export class AnyuppBackupStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);
    const app = this.node.root as App;

    /**
     * We only want to enable backup for some environments (environment != account)
     *
     * If we are in the dev environment, that means we are in the
     */
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

    new aws_backup.BackupVault(this, 'AnyUpp-Vault', {
      encryptionKey: backupKey,
    });
  }
}
