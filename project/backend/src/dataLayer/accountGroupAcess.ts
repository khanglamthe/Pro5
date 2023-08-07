import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { AccountGroupItem } from '../models/AccountGroupItem'
import { AccountGroupUpdate } from '../models/AccountGroupUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

export class AccountGroupAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly accountIndex = process.env.ACCOUNT_GROUP_TABLE_GSI,
    private readonly accountGroupTable = process.env.ACCOUNT_GROUP_TABLE) {
  }

  async deleteAccountGroupById(accountGroupId: string, userId: string) {
    await this.docClient.delete({
      TableName: this.accountGroupTable,
      Key: {
        'accountGroupId': accountGroupId,
        'userId': userId
      }
    }).promise()
  }

  async updateAccountGroup(accountGroupId: string, userId: string, updatedAccountGroup: AccountGroupUpdate){

    await this.docClient.update({
        TableName: this.accountGroupTable,
        Key: {
            "accountGroupId": accountGroupId,
            "userId": userId
        },
        UpdateExpression: "set #name = :name, description = :description",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": updatedAccountGroup.name,
            ":description": updatedAccountGroup.description
        }
    }).promise()
}

  async getAccountGroupByUserId(userId: string): Promise<AccountGroupItem[]> {
    console.log("Called function get account")
    const result = await this.docClient.query({
      TableName: this.accountGroupTable,
      IndexName: this.accountIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
    const items = result.Items
    return items as AccountGroupItem[]
  }

  async createAccountGroup(accountGroup: AccountGroupItem): Promise<AccountGroupItem> {
    await this.docClient.put({
      TableName: this.accountGroupTable,
      Item: accountGroup
    }).promise()

    return accountGroup
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
