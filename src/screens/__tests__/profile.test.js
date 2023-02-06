/* eslint-disable testing-library/no-debugging-utils */
import { loginAsUser, render } from 'test/app-test-utils';
import { screen } from '@testing-library/react';
import App from 'App';
import { mockUser } from 'test/data/mockuser';

async function renderProfile({ user }) {
   if (user === undefined) {
      user = await loginAsUser()
   }
   const route = '/profile';
   const utils = await render(<App />, { user, route });
   return { ...utils, user }
}

test('render Profile page', async () => {
   await renderProfile({});

   const findEmail = await screen.findByText(mockUser.Email);
   expect(findEmail).toBeInTheDocument();

   const findName = await screen.findAllByText(mockUser.Name);
   expect(findName).toHaveLength(2);

});
