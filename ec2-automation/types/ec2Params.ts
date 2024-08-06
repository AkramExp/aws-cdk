// ec2-params.ts
export interface EC2Params {
  ImageId: string;
  InstanceType: string;
  MinCount?: number;
  MaxCount?: number;
  KeyName?: string;
  SecurityGroupIds?: string[];
  SubnetId?: string;
  UserData?: string; // Base64-encoded user data
  TagSpecifications?: {
    ResourceType: string;
    Tags?: {
      Key: string;
      Value: string;
    }[];
  }[];
  IamInstanceProfile?: {
    Name?: string;
    Arn?: string;
  };
  Monitoring?: {
    Enabled: boolean;
  };
  EbsOptimized?: boolean;
  InstanceInitiatedShutdownBehavior?: string;
  Placement?: {
    AvailabilityZone?: string;
    GroupName?: string;
    Tenancy?: string;
  };
}
