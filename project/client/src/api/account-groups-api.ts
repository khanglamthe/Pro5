import { apiEndpoint } from '../config'
import { AccountGroup } from '../types/AccountGroup';
import { CreateAccountGroupRequest } from '../types/CreateAccountGroupRequest';
import Axios from 'axios'
import { UpdateAccountGroupRequest } from '../types/UpdateAccountGroupRequest';

export async function getAccountGroups(idToken: string): Promise<AccountGroup[]> {
  console.log('Fetching account groups')

  const response = await Axios.get(`${apiEndpoint}/account-groups`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('AccountGroup:', response.data)
  return response.data.items
}

export async function createAccountGroup(
  idToken: string,
  newAccountGroup: CreateAccountGroupRequest
): Promise<AccountGroup> {
  const response = await Axios.post(`${apiEndpoint}/account-groups`,  JSON.stringify(newAccountGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.newItem
}

export async function patchAccountGroup(
  idToken: string,
  accountGroupId: string,
  updatedAccountGroup: UpdateAccountGroupRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/account-groups/${accountGroupId}`, JSON.stringify(updatedAccountGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteAccountGroup(
  idToken: string,
  accountGroupId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/account-groups/${accountGroupId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  accountGroupId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/account-groups/${accountGroupId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
