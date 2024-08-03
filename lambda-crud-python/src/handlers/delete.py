import os
import json
import boto3

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['TABLE_NAME']
table = dynamodb.Table(table_name)

def handler(event, context):
    item_id = event['pathParameters']['id']

    try:
        response = table.delete_item(
            Key={'id': item_id},
            ConditionExpression="attribute_exists(id)"
        )

        return {
            'statusCode': 200,
            'body': json.dumps({'message': 'Item deleted successfully'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
