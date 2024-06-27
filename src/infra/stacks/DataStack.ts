import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, Table as DynamodbTable, ITable } from "aws-cdk-lib/aws-dynamodb";
import { Bucket, HttpMethods, IBucket, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../Utils";

export class DataStack extends Stack {
  public readonly spacesTable: ITable;
  public readonly photosBucket: IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    this.spacesTable = new DynamodbTable(this, "SpacesTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: `SpacesTable-${suffix}`, // this should be dynamic to avoid tables using same names
    });

    this.photosBucket = new Bucket(this, 'SpaceFinderPhotos', {
      bucketName: `space-finder-photos-${suffix}`,
      cors: [{
        allowedMethods: [
          HttpMethods.HEAD,
          HttpMethods.GET,
          HttpMethods.PUT
        ],
        allowedOrigins: ["*"],
        allowedHeaders: ["*"]
      }],
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      // accessControl: BucketAccessControl.PUBLIC_READ // said to currently not be working
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }
    });

    new CfnOutput(this, "SpaceFinderPhotosBucketName", {
      value: this.photosBucket.bucketName
    })
  }
}
