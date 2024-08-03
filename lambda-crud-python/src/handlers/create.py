import os
import json
import boto3
from uuid import uuid4

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['TABLE_NAME']
table = dynamodb.Table(table_name)

def handler(event, context):
    item = json.loads(event['body'])
    item['id'] = str(uuid4())

    table.put_item(Item=item)

    return {
        'statusCode': 201,
        'body': json.dumps(item)
    }
