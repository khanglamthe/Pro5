import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createAccountGroup, deleteAccountGroup, getAccountGroups, patchAccountGroup } from '../api/account-groups-api'
import Auth from '../auth/Auth'
import { AccountGroup } from '../types/AccountGroup'

interface AccountGroupsProps {
  auth: Auth
  history: History
}

interface AccountGroupsState {
  accountGroups: AccountGroup[]
  newAccountGroupName: string
  newDescription: string
  loadingAccountGroups: boolean
}

export class AccountGroups extends React.PureComponent<AccountGroupsProps, AccountGroupsState> {
  state: AccountGroupsState = {
    accountGroups: [],
    newAccountGroupName: '',
    newDescription: '',
    loadingAccountGroups: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newAccountGroupName: event.target.value })
  }

  handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newDescription: event.target.value })
  }

  onEditButtonClick = (accountGroupId: string) => {
    this.props.history.push(`/accountGroups/${accountGroupId}/edit`)
  }

  onAccountGroupCreate = async () => {
    try {
      const newAccountGroup = await createAccountGroup(this.props.auth.getIdToken(), {
        name: this.state.newAccountGroupName,
        description: this.state.newDescription
      })
      console.log(newAccountGroup)
      this.setState({
        accountGroups: [...this.state.accountGroups, newAccountGroup],
        newAccountGroupName: ''
      })
    } catch {
      alert('AccountGroup creation failed')
    }
  }

  onAccountGroupDelete = async (accountGroupId: string) => {
    try {
      await deleteAccountGroup(this.props.auth.getIdToken(), accountGroupId)
      this.setState({
        accountGroups: this.state.accountGroups.filter(accountGroup => accountGroup.accountGroupId !== accountGroupId)
      })
    } catch {
      alert('AccountGroup deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const accountGroups = await getAccountGroups(this.props.auth.getIdToken())
      console.log()
      this.setState({
        accountGroups,
        loadingAccountGroups: false
      })
    } catch (e) {
      alert(`Failed to fetch accountGroups: ${(e as Error).message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">ACCOUNT GROUPS</Header>

        {this.renderCreateAccountGroupInput()}
        {this.renderHeader()}
        {this.renderAccountGroups()}
      </div>
    )
  }

  renderCreateAccountGroupInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Account name"
            onChange={this.handleNameChange}
          />

        </Grid.Column>
        <Grid.Column width={16} style={{ marginBottom: 10 }}>
          <Input
            fluid
            placeholder="Account description"
            onChange={this.handleDescriptionChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Button color='blue' onClick={() => this.onAccountGroupCreate()}>
            CREATE NEW ACCOUNT
          </Button>
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderHeader() {
    return (
      <Grid padded>
      <Grid.Row>
        <Grid.Column width={3} style={{ marginRight: 13 }}>
          <Header as="h4">Name</Header>
        </Grid.Column>
        <Grid.Column width={3} style={{ marginRight: 13 }}>
          <Header as="h4">Description</Header>
        </Grid.Column>
        <Grid.Column width={4} style={{ marginRight: 13 }}>
          <Header as="h4">Image</Header>
        </Grid.Column>
        <Grid.Column width={3} style={{ marginRight: 16 }}>
          <Header as="h4">Date</Header>
        </Grid.Column>
        <Grid.Column width={2}>
          <Header as="h4">Action</Header>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
      </Grid>
    )
  }

  renderAccountGroups() {
    if (this.state.loadingAccountGroups) {
      return this.renderLoading()
    }

    return this.renderAccountGroupsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading ACCOUNTGROUP's
        </Loader>
      </Grid.Row>
    )
  }

  renderAccountGroupsList() {
    return (
      <Grid padded>
        {this.state.accountGroups.map((accountGroup, pos) => {
          return (
            <Grid.Row key={accountGroup.accountGroupId}>
              <Grid.Column width={3} verticalAlign="top">
                <h5>{accountGroup.name}</h5>
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {accountGroup.description}
              </Grid.Column>
              <Grid.Column width={4} floated="right">
                {accountGroup.attachmentUrl && (
                  <Image src={accountGroup.attachmentUrl} onError={(event: { target: { style: { display: string } } }) => event.target.style.display = 'none'} alt=" This is account image!" size="small" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {accountGroup.createdAt}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(accountGroup.accountGroupId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onAccountGroupDelete(accountGroup.accountGroupId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
