import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import env from '#start/env'

const client = new DynamoDBClient({
  region: env.get('AWS_REGION'),
  endpoint: env.get('DYNAMODB_ENDPOINT'),
  credentials: {
    accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
  },
})

const docClient = DynamoDBDocumentClient.from(client)

export default docClient
