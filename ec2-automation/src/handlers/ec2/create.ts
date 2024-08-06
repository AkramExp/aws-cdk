import { EC2 } from "aws-sdk";
import { EC2Params } from "../../../types/ec2Params";

export async function createEc2(body: string | null) {
  if (!body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing body" }),
    };
  }

  const ec2Data = JSON.parse(body);

  const { ImageId, InstanceType, MinCount = 1, MaxCount = 1, Name } = ec2Data;

  console.log(Name);

  const ec2 = new EC2();

  const params: EC2.RunInstancesRequest = {
    ImageId,
    InstanceType,
    MinCount,
    MaxCount,
  };

  if (Name) {
    params.TagSpecifications = [
      {
        ResourceType: "instance",
        Tags: Name ? [{ Key: "Name", Value: Name }] : [],
      },
    ];
  }

  try {
    const data = await ec2.runInstances(params).promise();
    console.log(data);

    const instanceId = data.Instances?.[0].InstanceId;
    console.log("EC2 Instance Created with ID:", instanceId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "EC2 Instance Created",
        instanceId,
      }),
    };
  } catch (error) {
    console.error("This is an error", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to create EC2 instance", error }),
    };
  }
}
