/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { loginAsUser, render, act } from 'test/app-test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import Profile from 'screens/profile';

async function renderProfile({ user }) {
   if (user === undefined) {
      user = await loginAsUser()
   }
   await act(async () => {
      const utils = await render(<Profile />)
      return { ...utils, user }
   })
}

test('render Profile page', async () => {
   const { user } = await renderProfile({});
   const findEmail = await screen.findByText(user.Email);
   expect(findEmail).toBeInTheDocument();

   const findName = await screen.findByText(user.Name);
   expect(findName).toBeInTheDocument();

});

// test('render create new user', async () => {

// });