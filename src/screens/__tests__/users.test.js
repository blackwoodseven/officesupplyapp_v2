/* eslint-disable testing-library/no-debugging-utils */
import { render } from '@testing-library/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { waitFor } from 'test/app-test-utils'
import UsersList from "../users";

async function renderRating() {
   const utils = await render(<UsersList />)
   return { ...utils }
}

test('render user list and check button(s) are available', async () => {
   await renderRating()
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