import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Alarm, Metric, Unit } from "aws-cdk-lib/aws-cloudwatch";
import { SnsAction } from "aws-cdk-lib/aws-cloudwatch-actions";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";
import { LambdaSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";
import { join } from "path";
import { getConfig } from "../Config";

const config = getConfig();
export class MonitorStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const webhookLambda = new NodejsFunction(this, "WebhookLambda", {
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      entry: join(__dirname, "..", "..", "services", "monitor", "handler.ts"),
      environment: {
        META_WEBHOOKURL: config.META_WEBHOOKURL,
        META_TOKEN: config.META_TOKEN
      }
    });

    const alarmTopic = new Topic(this, "SpacesAlarmTopic", {
      displayName: "SpacesAlarmTopic",
      topicName: "SpacesAlarmTopic",
    });

    alarmTopic.addSubscription(new LambdaSubscription(webhookLambda));

    const spacesApi4xxAlarm = new Alarm(this, "SpaceApi4xxAlarm", {
      metric: new Metric({
        metricName: "4XXError",
        namespace: "AWS/ApiGateway",
        period: Duration.minutes(1),
        statistic: "Sum",
        unit: Unit.COUNT,
        dimensionsMap: {
          ApiName: "SpacesApi",
        },
      }),
      evaluationPeriods: 1,
      threshold: 5,
      alarmName: "SpaceApi4xxAlarm",
    });

    const topicAction = new SnsAction(alarmTopic);
    spacesApi4xxAlarm.addAlarmAction(topicAction);
    spacesApi4xxAlarm.addOkAction(topicAction);
  }
}
