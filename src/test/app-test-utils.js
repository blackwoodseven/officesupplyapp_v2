import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import * as usersDB from 'test/data/user';
import { buildUser } from './generate';
import * as auth from 'auth-provider';
import React from 'react'
import { render } from '@testing-library/react'
import AppProviders from '../context';

async function loginAsUser(userProperties) {
   // const user = buildUser(userProperties)
   const user = {
      "ID": "b72037f5-ef12-466b-a9cc-6a8b57dc8c02",
      "Name": "Samarth Udgiri Kantar",
      "Email": "samarth.udgiri.kantar@blackwoodseven.com",
      "Role": "admin",
      "CreatedAt": "2023-01-31T10:12:44.274Z",
      "UpdatedAt": "2023-01-31T17:35:49.27+05:30",
      "DeletedAt": null
   };
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


const AllTheProviders = ({ children }) => {
   return (
      <AppProviders>
         {children}
      </AppProviders>
   )
}

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { waitForLoadingToFinish, loginAsUser, customRender as render }
