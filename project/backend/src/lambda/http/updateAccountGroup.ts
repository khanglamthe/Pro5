import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils';

import { updateAccountGroup } from '../../businessLogic/accountGroup'
import { UpdateAccountGroupRequest } from '../../requests/UpdateAccountGroupRequest'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const accountGroupId = event.pathParameters.accountGroupId
        const updatedAccountGroup: UpdateAccountGroupRequest = JSON.parse(event.body)
        await updateAccountGroup(accountGroupId,getUserId(event), updatedAccountGroup)
        return {
            statusCode: 202,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(updatedAccountGroup)
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
