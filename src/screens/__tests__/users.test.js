/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { act, render } from '@testing-library/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { waitFor } from 'test/app-test-utils'
import UsersList from "../users";

async function renderUserList() {
   const utils = await render(<UsersList />)
   return { ...utils }
}

test('render user list and check button(s) are available', async () => {
   await renderUserList()
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
   await renderUserList()
   const addNewUserButton = await screen.findByRole('button', { name: /add new user/i });
   expect(addNewUserButton).toBeInTheDocument();
   
   await userEvent.click(addNewUserButton);
   const userInputName = screen.getByRole('textbox', { name: /name/i })
   userEvent.type(userInputName, "Samarth Udgiri")
   expect(userInputName).toBeInTheDocument();

   const userInputEmail = screen.getByRole('textbox', { name: /email/i })
   userEvent.type(userInputEmail, "Samarth.udgiri@kantar.com")
   expect(userInputEmail).toBeInTheDocument();

   const userInputId = screen.getByRole('textbox', { name: /id/i })
   userEvent.type(userInputId, "1211111")
   expect(userInputId).toBeInTheDocument();

   // const submitButton = screen.getByRole('button', {name: /add/i})
   // act(() => {
   //    userEvent.click(submitButton);
   // })
});