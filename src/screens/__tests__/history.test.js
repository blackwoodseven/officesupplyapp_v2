/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { loginAsUser, render } from 'test/app-test-utils';
import { screen } from '@testing-library/react';
import App from 'App';

async function renderHistoryScreen({ user }) {
   if (user === undefined) {
      user = await loginAsUser()
   }
   const route = '/history'
   const utils = await render(<App />, { user, route })
   return { ...utils, user }
}

test('render requests list and check button(s) are available', async () => {
   await renderHistoryScreen({})

   const requestRejectedItems = await screen.findAllByText(/rejected/i);
   expect(requestRejectedItems).toHaveLength(3);

   const requestApprovedItems = await screen.findAllByText(/approved/i);
   expect(requestApprovedItems).toHaveLength(5);
});