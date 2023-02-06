/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { screen } from '@testing-library/react';
import { loginAsUser, render, act } from 'test/app-test-utils'
import HistoryList from '../history';

async function renderHistoryScreen({ user }) {
   if (user === undefined) {
      user = await loginAsUser()
   }
   await act(async () => {
      const utils = await render(<HistoryList />)
      return { ...utils }
   })
}

test('render requests list and check button(s) are available', async () => {
   await renderHistoryScreen({})

   const requestRejectedItems = await screen.findAllByText(/rejected/i);
   expect(requestRejectedItems).toHaveLength(3);

   const requestApprovedItems = await screen.findAllByText(/approved/i);
   expect(requestApprovedItems).toHaveLength(5);
});