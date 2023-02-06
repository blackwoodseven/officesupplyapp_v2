/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-debugging-utils */
import { act, render } from '@testing-library/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { waitFor } from 'test/app-test-utils'
import UsersList from "../users";
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
   rest.post('/usersList', (req, res, ctx) => {
      return res(
         ctx.json({
            "id": 30,
            "name": "Jaime Widocks",
            "email": "jwidockst@issuu.com",
            "gender": "Male",
            "role": "normal"
         }),
      )
   }),
)

// beforeAll(() => {
//    server.listen()
// })

// afterAll(() => {
//    server.close()
// })

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