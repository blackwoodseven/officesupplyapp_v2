/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { loginAsUser } from 'test/app-test-utils';
import { act, render } from '@testing-library/react';
import { screen } from '@testing-library/react';
import React from 'react';
// import userEvent from '@testing-library/user-event';
// import { waitFor } from 'test/app-test-utils';
import Profile from 'screens/profile';
import AppProviders from '../../context/index'

async function renderProfile({ user }) {
   if (user === undefined) {
      user = await loginAsUser()
   }
   const utils = await render(<Profile />, { wrapper: await act(async () => <AppProviders />) })
   return { ...utils, user }
}

test('render Profile page', async () => {
   const { profilePage, user } = await renderProfile({});

   const findEmail = await screen.findByText(user.Email);
   expect(findEmail).toBeInTheDocument();

   const findName = await screen.findByText(user.Name);
   expect(findName).toBeInTheDocument();
   // screen.debug();
});

// test('render create new user', async () => {

// });