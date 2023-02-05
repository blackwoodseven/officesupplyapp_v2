import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import * as usersDB from 'test/data/user';
import { buildUser } from './generate';
import * as auth from 'auth-provider'

async function loginAsUser(userProperties) {
   const user = buildUser(userProperties)
   await usersDB.create(user)
   window.localStorage.setItem(auth.localStorageEmail, user.Email)
   return user
}

const waitForLoadingToFinish = () =>
   waitForElementToBeRemoved(
      () => [
         ...screen.queryAllByLabelText(/loading/i),
         ...screen.queryAllByText(/loading/i),
      ],
      { timeout: 4000 },
   )

export * from '@testing-library/react'
export { waitForLoadingToFinish, loginAsUser }
