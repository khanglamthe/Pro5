import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateAccountGroupRequest } from '../../requests/CreateAccountGroupRequest'
import { getUserId } from '../utils';
import { createAccountGroup } from '../../businessLogic/accountGroup'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newAccountGroup: CreateAccountGroupRequest = JSON.parse(event.body)
    console.log('Processing event: ', event)
    const newItem = await createAccountGroup(newAccountGroup, getUserId(event))

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
      })
    }
  }
)


handler.use(
  cors({
    credentials: true
  })
)
