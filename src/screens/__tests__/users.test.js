/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { act, render, screen, loginAsUser } from 'test/app-test-utils';
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

   const firstName = await screen.findByText(/che sjollem/i);
   expect(firstName).toBeInTheDocument();

   const email = await screen.findByText(/csjollema0@yolasite.com/i);
   expect(email).toBeInTheDocument();

   const roleAdmin = await screen.findAllByDisplayValue(/admin/i);
   expect(roleAdmin).toHaveLength(19);

   const roleNormal = await screen.findAllByDisplayValue(/normal/i);
   expect(roleNormal).toHaveLength(11);
});

test('render create new user', async () => {
   await renderUserList({})
   const addNewUserButton = await screen.findByRole('button', { name: /add new user/i });
   expect(addNewUserButton).toBeInTheDocument();

   await userEvent.click(addNewUserButton);

   const userInputName = screen.getByRole('textbox', { name: /name/i })
   await userEvent.type(userInputName, "Samarth Udgiri")
   expect(userInputName).toHaveValue('Samarth Udgiri')

   const userInputEmail = screen.getByRole('textbox', { name: /email/i })
   await userEvent.type(userInputEmail, "Samarth.udgiri@kantar.com")
   expect(userInputEmail).toHaveValue("Samarth.udgiri@kantar.com")

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