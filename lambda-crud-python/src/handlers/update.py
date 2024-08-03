import os
import json
import boto3

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['TABLE_NAME']
table = dynamodb.Table(table_name)

def handler(event, context):
    item_id = event['pathParameters']['id']
    updated_data = json.loads(event['body'])

    update_expression = "SET " + ", ".join(f"#{k} = :{k}" for k in updated_data.keys())
    expression_attribute_names = {f"#{k}": k for k in updated_data.keys()}
    

    try:
        response = table.update_item(
            Key={'id': item_id},
            UpdateExpression=update_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues={f":{k}": v for k, v in updated_data.items()},
            ReturnValues="UPDATED_NEW"
        )

        return {
            'statusCode': 200,
            'body': json.dumps(response['Attributes'])
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
