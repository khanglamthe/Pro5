import { AccountGroupAccess } from '../dataLayer/accountGroupAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { AccountGroupItem } from '../models/AccountGroupItem'
import { CreateAccountGroupRequest } from '../requests/CreateAccountGroupRequest'
import { UpdateAccountGroupRequest } from '../requests/UpdateAccountGroupRequest'
import * as uuid from 'uuid'

const accountGroupAccess = new AccountGroupAccess()
const attachmentUtils = new AttachmentUtils()


export async function getAccountGroupByUserId(userId: string): Promise<AccountGroupItem[]> {
  return accountGroupAccess.getAccountGroupByUserId(userId)
}

export async function deleteAccountGroupById(accountGroupId: string, userId: string) {
  accountGroupAccess.deleteAccountGroupById(accountGroupId, userId)
}

export async function updateAccountGroup(accountGroupId: string, userId: string, updateAccountGroup: UpdateAccountGroupRequest) {
  accountGroupAccess.updateAccountGroup(accountGroupId, userId, updateAccountGroup)
}

export async function createAccountGroup(
  createAccountGroupRequest: CreateAccountGroupRequest,
  jwtToken: string
): Promise<AccountGroupItem> {

  const itemId = uuid.v4()

  return await accountGroupAccess.createAccountGroup({
    accountGroupId: itemId,
    createdAt: new Date().toISOString(),
    name: createAccountGroupRequest.name,
    description: createAccountGroupRequest.description,
    attachmentUrl: await attachmentUtils.createAttachmentURL(itemId),
    userId: jwtToken
  })
}