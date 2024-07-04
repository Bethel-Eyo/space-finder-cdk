import { App } from "aws-cdk-lib";
import { MonitorStack } from "../../src/infra/stacks/MonitorStack";
import { Match, Template } from "aws-cdk-lib/assertions";

describe("MonitorStack test suite", () => {
  /** The reason why we use the beforeAll as opposed to the regular beforeEach
   * is because the process of synthesizing the stack to become a cloudformation
   * template might take time and we don't want it to be doing that before each
   * test. we don't want our test running time to be very long.
   */
  let monitorStackTemplate: Template;

  beforeAll(() => {
    const testApp = new App({
      outdir: "cdk.out",
    });

    const monitorStack = new MonitorStack(testApp, "MonitorStack");
    monitorStackTemplate = Template.fromStack(monitorStack);
  });

  test("Lambda properties", () => {
    monitorStackTemplate.hasResourceProperties("AWS::Lambda::Function", {
      Handler: "index.handler",
      Runtime: "nodejs20.x",
    });
  });

  test("Sns topic properties", () => {
    monitorStackTemplate.hasResourceProperties("AWS::SNS::Topic", {
      DisplayName: "SpacesAlarmTopic",
      TopicName: "SpacesAlarmTopic",
    });
  });

  test("Sns subscription properties - with matchers", () => {
    monitorStackTemplate.hasResourceProperties(
      "AWS::SNS::Subscription",
      Match.objectEquals({
        Protocol: "lambda",
        TopicArn: {
          Ref: Match.stringLikeRegexp("SpacesAlarmTopic"),
        },
        Endpoint: {
          "Fn::GetAtt": [Match.stringLikeRegexp("WebhookLambda"), "Arn"],
        },
      })
    );
  });

  test("Sns subscription properties - with exact values", () => {
    const snsTopic = monitorStackTemplate.findResources("AWS::SNS::Topic");
    const snsTopicName = Object.keys(snsTopic)[0];

    const lambda = monitorStackTemplate.findResources("AWS::Lambda::Function");
    const lambdaName = Object.keys(lambda)[0];

    monitorStackTemplate.hasResourceProperties("AWS::SNS::Subscription", {
      Protocol: "lambda",
      TopicArn: {
        Ref: snsTopicName,
      },
      Endpoint: {
        "Fn::GetAtt": [lambdaName, "Arn"],
      },
    });
  });
});
