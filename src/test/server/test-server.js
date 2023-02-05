import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
   // Describe the requests to mock.
   rest.get('/usersList', (req, res, ctx) => {
      return res(
         ctx.json({
            title: 'Lord of the Rings',
            author: 'J. R. R. Tolkien',
         }),
      )
   }),
)

beforeAll(() => {
   server.listen()
})

afterAll(() => {
   server.close()
})

test('renders a book data', () => {
   // Render components, perform requests, API communication is covered.
})