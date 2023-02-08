/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { loginAsUser, render, fireEvent, within, act, waitFor } from 'test/app-test-utils'
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from 'App';

async function renderSupplyScreen({ user }) {
   if (user === undefined) {
      user = await loginAsUser()
   }
   const route = '/supplies';
   const utils = await render(<App />, { user, route });
   return { ...utils, user }
}

test('render supplies list and check button(s) are available', async () => {
   await renderSupplyScreen({})
   const addNewUserButton = await screen.findByRole('button', { name: /add new item/i });
   expect(addNewUserButton).toBeInTheDocument();

   const allItems = await screen.findAllByRole("listitem");
   expect(allItems).toHaveLength(30);
});

test('render create new supply Item', async () => {
   await renderSupplyScreen({})
   const addNewUserButton = await screen.findByRole('button', { name: /add new item/i });
   expect(addNewUserButton).toBeInTheDocument();
   await userEvent.click(addNewUserButton);

   const dianlogScreen = within(screen.getByRole('dialog'));
   const dialogElement = await screen.findByRole('dialog');

   const userInputName = dianlogScreen.getByRole('textbox', { name: /name/i });
   userEvent.type(userInputName, "Mouse");

   const userInputQuantity = dianlogScreen.getByRole('textbox', { name: /quantity/i });
   userEvent.type(userInputQuantity, "3");

   const userListDropdown = dianlogScreen.getAllByRole('button').at(1);
   fireEvent.mouseDown(userListDropdown);

   const quantityListItem = screen.getByRole('listbox');
   const listbox = within(quantityListItem);

   fireEvent.click(listbox.getByText(/pack/i));

   const submitButton = dianlogScreen.getByRole('button', { name: /add/i })
   await userEvent.click(submitButton);

   await act(async () => {
      await sleep(1100); // wait *just* a little longer than the timeout in the component
   });

   await waitFor(async () => {
      await expect(dialogElement).not.toBeInTheDocument();
   });
   // within(dianlogScreen)
   // expect(screen.getByRole('heading')).toHaveTextContent(/my account/i);
   // const submitButton = screen.getByRole('button', {name: /add/i})
   // act(() => {
   //    userEvent.click(submitButton);
   // })
});

// a helper to use promises with timeouts
function sleep(period) {
   return new Promise(resolve => setTimeout(resolve, period));
}