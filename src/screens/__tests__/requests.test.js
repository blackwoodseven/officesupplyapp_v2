/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { screen } from '@testing-library/react';
import { loginAsUser, render } from 'test/app-test-utils'
import App from 'App';

async function renderRequestScreen({ user }) {
   if (user === undefined) {
      user = await loginAsUser()
   }
   const route = `/my-request`
   const utils = await render(<App />, { user, route })
   return { ...utils, user }
}

test('render requests list and check button(s) are available', async () => {
   await renderRequestScreen({})
   const requestSuppliesButton = await screen.findByRole('button', { name: /request supplies/i });
   expect(requestSuppliesButton).toBeInTheDocument();

   const requestItems = await screen.findAllByText(/pending/i);
   expect(requestItems).toHaveLength(3);
   // const coffeeItem = await screen.findAllByText(/coffee/i);
   // expect(coffeeItem).toHaveLength(10);

   // const allItems = await screen.findAllByRole("listitem");
   // expect(allItems).toHaveLength(53);
});

// test('render create new supply Item', async () => {
//    await renderRequestScreen()
//    const requestSuppliesButton = await screen.findByRole('button', { name: /add new item/i });
//    expect(requestSuppliesButton).toBeInTheDocument();
//    await userEvent.click(requestSuppliesButton);

//    const dianlogScreen = within(screen.getByRole('dialog'));

//    const userInputName = dianlogScreen.getByRole('textbox', { name: /name/i });
//    userEvent.type(userInputName, "Mouse");

//    const userInputQuantity = dianlogScreen.getByRole('textbox', { name: /quantity/i });
//    userEvent.type(userInputQuantity, "3");

//    const userListDropdown = dianlogScreen.getAllByRole('button').at(1);
//    fireEvent.mouseDown(userListDropdown);

//    const quantityListItem = screen.getByRole('listbox');
//    const listbox = within(quantityListItem);

//    fireEvent.click(listbox.getByText(/pack/i));

//    const submitButton = dianlogScreen.getByRole('button', { name: /add/i })
//    await fireEvent.click(submitButton);
//    await userEvent.click(submitButton);
//    // within(dianlogScreen)
//    // expect(screen.getByRole('heading')).toHaveTextContent(/my account/i);
//    // const submitButton = screen.getByRole('button', {name: /add/i})
//    // act(() => {
//    //    userEvent.click(submitButton);
//    // })
// });