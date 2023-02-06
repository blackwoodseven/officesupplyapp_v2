import { render as rtlRender, screen, waitForElementToBeRemoved } from '@testing-library/react';
import * as usersDB from 'test/data/user';
// import { buildUser } from './generate';
import * as auth from 'auth-provider';
import AppProviders from '../context';
import { mockUser } from './data/mockuser';

async function loginAsUser(userProperties) {
   // const user = buildUser(userProperties)
   await usersDB.create(mockUser)
   window.localStorage.setItem(auth.localStorageEmail, mockUser.Email)
   return mockUser
}

const waitForLoadingToFinish = () =>
   waitForElementToBeRemoved(
      () => [
         ...screen.queryAllByLabelText(/loading/i),
         ...screen.queryAllByText(/loading/i),
      ],
      { timeout: 10000 },
   )

async function render(ui, { route = '/supplies', user, ...renderOptions } = {}) {
   user = typeof user === 'undefined' ? mockUser : user
   window.history.pushState({}, 'Test page', route)

   const returnValue = {
      ...rtlRender(ui, {
         wrapper: AppProviders,
         ...renderOptions,
      }),
      user,
   }

   await waitForLoadingToFinish()

   return returnValue
}

export * from '@testing-library/react'
export { waitForLoadingToFinish, loginAsUser, render }
