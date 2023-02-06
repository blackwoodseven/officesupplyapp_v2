/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { act, render, fireEvent, within } from '@testing-library/react';
import { screen } from '@testing-library/react';
import { loginAsUser } from 'test/app-test-utils'
import userEvent from '@testing-library/user-event'
import { waitFor } from 'test/app-test-utils'
import HistoryList from '../history';
import AppProviders from '../../context/index'

async function renderHistoryScreen({ user }) {
   if (user === undefined) {
      user = await loginAsUser()
   }
   const utils = await render(<HistoryList />, { wrapper: AppProviders })
   return { ...utils }
}

test('render requests list and check button(s) are available', async () => {
   await renderHistoryScreen({})

   const requestRejectedItems = await screen.findAllByText(/rejected/i);
   expect(requestRejectedItems).toHaveLength(3);

   const requestApprovedItems = await screen.findAllByText(/approved/i);
   expect(requestApprovedItems).toHaveLength(5);
});