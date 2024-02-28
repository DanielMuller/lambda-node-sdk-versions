// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import awsPackage from '@aws-sdk/client-s3/package.json' assert { type: 'json' }

interface Versions {
  NodeJs: string
  '@aws-sdk': string
}
const main = async (): Promise<Versions> => {
  return {
    NodeJs: process.version,
    '@aws-sdk': awsPackage.version,
  }
}

export const handler = main
