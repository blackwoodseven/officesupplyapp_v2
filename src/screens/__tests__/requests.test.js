/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { act, render, screen, loginAsUser, waitFor } from 'test/app-test-utils';
import userEvent from '@testing-library/user-event';
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

test('render first request list item', async () => {
   await renderRequestScreen({});

   const requestItems = await screen.findAllByText(/pending/i);
   expect(requestItems).toHaveLength(3);

   const findViewItemButton = await screen.findAllByRole('button', { name: /view list/i });
   expect(findViewItemButton).toHaveLength(requestItems.length * 2);

   await userEvent.click(findViewItemButton.at(1));

   const dialogElement = await screen.findByRole('dialog');
   expect(dialogElement).toBeInTheDocument();

   const allItems = await screen.findAllByRole("listitem");
   expect(allItems).toHaveLength(2);

   const closeButton = await screen.findByRole('button');

   await userEvent.click(closeButton);

   await waitFor(async () => {
      await expect(dialogElement).not.toBeInTheDocument();
   });
})

test('update request item to Approved', async () => {
   await renderRequestScreen({});

   const requestItems = await screen.findAllByText(/pending/i);
   expect(requestItems).toHaveLength(3);

   const findApproveButton = await screen.findAllByRole('button', { name: /approve/i });
   expect(findApproveButton).toHaveLength(requestItems.length * 2);

   await userEvent.click(findApproveButton.at(1));

   await act(async () => {
      await sleep(1100);
   });

   const newRequestItems = await screen.findAllByText(/pending/i);
   const newFindApproveButton = await screen.findAllByRole('button', { name: /approve/i });

   expect(newFindApproveButton).toHaveLength(newRequestItems.length * 2);
})

test('update request item to Rejected', async () => {
   await renderRequestScreen({});

   const requestItems = await screen.findAllByText(/pending/i);
   expect(requestItems).toHaveLength(2);

   const findRejectButton = await screen.findAllByRole('button', { name: /reject/i });
   expect(findRejectButton).toHaveLength(requestItems.length * 2);

   await userEvent.click(findRejectButton.at(1));

   await act(async () => {
      await sleep(1100);
   });

   const newRequestItems = await screen.findAllByText(/pending/i);
   const newFindRejwctButton = await screen.findAllByRole('button', { name: /reject/i });
   
   expect(newFindRejwctButton).toHaveLength(newRequestItems.length * 2);
})

// a helper to use promises with timeouts
function sleep(period) {
   return new Promise(resolve => setTimeout(resolve, period));
}