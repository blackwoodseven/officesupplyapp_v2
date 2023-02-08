/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { act, render, screen, loginAsUser, waitFor } from 'test/app-test-utils';
import userEvent from '@testing-library/user-event';
import App from 'App';

async function renderUserList({ user }) {
   if (user === undefined) {
      user = await loginAsUser()
   }
   const route = '/users';
   const utils = await render(<App />, { user, route });
   return { ...utils, user }

   // const utils = await render(<UsersList />)
   // return { ...utils }
}

test('render user list and check button(s) are available', async () => {
   await renderUserList({})
   const addNewUserButton = await screen.findByRole('button', { name: /add new user/i });
   expect(addNewUserButton).toBeInTheDocument();

   const deleteUserButton = await screen.findAllByRole('button', { name: 'Delete User' });
   expect(deleteUserButton).toHaveLength(30)

   // const firstName = await screen.findByText(/che sjollem/i);
   // expect(firstName).toBeInTheDocument();

   // const email = await screen.findByText(/csjollema0@yolasite.com/i);
   // expect(email).toBeInTheDocument();

   const roleAdmin = await screen.findAllByDisplayValue(/admin/i);
   expect(roleAdmin.length).toBeGreaterThan(10);

   const roleNormal = await screen.findAllByDisplayValue(/normal/i);
   expect(roleNormal.length).toBeGreaterThan(10);
});

test('render create new user', async () => {
   await renderUserList({})
   const addNewUserButton = await screen.findByRole('button', { name: /add new user/i });
   expect(addNewUserButton).toBeInTheDocument();

   await userEvent.click(addNewUserButton);

   const userInputName = screen.getByRole('textbox', { name: /name/i })
   await userEvent.type(userInputName, "John Doe")
   expect(userInputName).toHaveValue('John Doe')

   const userInputEmail = screen.getByRole('textbox', { name: /email/i })
   await userEvent.type(userInputEmail, "John.Doe@google.com")
   expect(userInputEmail).toHaveValue("John.Doe@google.com")

   const userInputId = screen.getByRole('textbox', { name: /id/i })
   await userEvent.type(userInputId, "1211111")
   expect(userInputId).toHaveValue("1211111")

   const submitButton = screen.getByRole('button', { name: /add/i })
   await act(async () => userEvent.click(submitButton));
   setTimeout(() => {
      expect(userInputName).not.toBeInTheDocument();
      expect(userInputEmail).not.toBeInTheDocument();
      expect(userInputId).not.toBeInTheDocument();
   }, 200)
});

test('render close create new user popup', async () => {
   await renderUserList({})
   const addNewUserButton = await screen.findByRole('button', { name: /add new user/i });
   expect(addNewUserButton).toBeInTheDocument();

   await userEvent.click(addNewUserButton);
   const dialogElement = await screen.findByRole('dialog');

   const closeButton = await screen.findAllByRole('button');
   await userEvent.click(closeButton.at(0));

   await waitFor(async () => {
      await expect(dialogElement).not.toBeInTheDocument();
   });
});

test('render delete user button', async () => {
   // a helper to use promises with timeouts
   function sleep(period) {
      return new Promise(resolve => setTimeout(resolve, period));
   }
   await renderUserList({});

   const deleteUserButton = await screen.findAllByRole('button', { name: 'Delete User' });
   expect(deleteUserButton).toHaveLength(30);

   await userEvent.click(deleteUserButton.at(0));

   await act(async () => {
      await sleep(1100); // wait *just* a little longer than the timeout in the component
   });
   const newDeleteUserButton = await screen.findAllByRole('button', { name: 'Delete User' });
   expect(newDeleteUserButton).toHaveLength(29);

});