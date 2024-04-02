// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import awsPackage from '@aws-sdk/client-s3/package.json' assert { type: 'json' }
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

interface Versions {
  NodeJs: string
  '@aws-sdk': string
  runtime: string
  newVersion: boolean
}

const tableName = process.env.TABLE_NAME
const runtime = process.env.AWS_EXECUTION_ENV || 'unknown'
const nodeJsVersion = process.version
const sdkVersion = awsPackage.version

const main = async (): Promise<Versions> => {
  const now = new Date().toISOString()

  const getLatestCommand = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: '#runtime = :runtime',
    ExpressionAttributeNames: {
      '#runtime': 'runtime',
    },
    ExpressionAttributeValues: {
      ':runtime': runtime,
    },
    Limit: 1,
    ScanIndexForward: false,
  })
  const response = await docClient.send(getLatestCommand)

  const newVersion = !(
    response.Items &&
    response.Items.length > 0 &&
    response.Items[0].sdkVersion === sdkVersion &&
    response.Items[0].nodeJsVersion === nodeJsVersion
  )

  if (newVersion) {
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: {
        runtime,
        createdAt: now,
        sdkVersion,
        nodeJsVersion,
      },
    })
    await docClient.send(putCommand)
  }
  return {
    NodeJs: nodeJsVersion,
    '@aws-sdk': sdkVersion,
    runtime,
    newVersion,
  }
}
export const handler = main
