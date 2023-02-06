/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { loginAsUser, render, fireEvent, within } from 'test/app-test-utils'
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

   const coffeeItem = await screen.findAllByText(/coffee/i);
   expect(coffeeItem).toHaveLength(10);

   const allItems = await screen.findAllByRole("listitem");
   expect(allItems).toHaveLength(53);
});

test('render create new supply Item', async () => {
   await renderSupplyScreen({})
   const addNewUserButton = await screen.findByRole('button', { name: /add new item/i });
   expect(addNewUserButton).toBeInTheDocument();
   await userEvent.click(addNewUserButton);

   const dianlogScreen = within(screen.getByRole('dialog'));

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
   await fireEvent.click(submitButton);
   await userEvent.click(submitButton);
   // within(dianlogScreen)
   // expect(screen.getByRole('heading')).toHaveTextContent(/my account/i);
   // const submitButton = screen.getByRole('button', {name: /add/i})
   // act(() => {
   //    userEvent.click(submitButton);
   // })
});