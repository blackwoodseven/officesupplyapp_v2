import { rest } from 'msw';
import { match } from 'node-match-path';

import * as usersDB from 'test/data/user';
import * as userListItems from '../data/usersList/userList-items';

import * as suppliesListItems from '../data/suppliesList/suppliesList-items';
import * as requestsListItems from '../data/requestsList/requestsList-items';

import { mockUser } from 'test/data/mockuser';

let sleep = () => Promise.resolve();

function ls(key, defaultVal) {
   const lsVal = window.localStorage.getItem(key)
   let val
   if (lsVal) {
      val = Number(lsVal)
   }
   return Number.isFinite(val) ? val : defaultVal
}

const API_BASE_URL = process.env.REACT_APP_API_URL;
const AUTH_BASE_URL = process.env.REACT_APP_AUTH_URL;

const handlers = [
   rest.get(`${AUTH_BASE_URL}/login`, async (req, res, ctx) => {
      return res(ctx.json({ mockUser }))
   }),

   rest.get(`${API_BASE_URL}/userList`, async (req, res, ctx) => {
      let userList = await userListItems.getAllUser();
      return res(ctx.status(200), ctx.json(userList))
   }),
   rest.post(`${API_BASE_URL}/userList`, async (req, res, ctx) => {
      const { email } = req.body
      const userFields = { email }
      let user
      try {
         user = await usersDB.authenticate(userFields)
      } catch (error) {
         return res(
            ctx.status(400),
            ctx.json({ status: 400, message: error.message }),
         )
      }
      return res(ctx.json({ user }))
   }),
   rest.delete(`${API_BASE_URL}/userList/:userID`, async (req, res, ctx) => {
      const { userID } = req.params
      await userListItems.remove(userID)
      return res(ctx.json({ success: true }))
   }),

   rest.get(`${API_BASE_URL}/suppliesList`, async (req, res, ctx) => {
      let supplyItem = await suppliesListItems.getAllSupplies();
      return res(ctx.status(200), ctx.json(supplyItem))
   }),
   rest.post(`${API_BASE_URL}/suppliesList`, async (req, res, ctx) => {
      const data = req.body
      // const userFields = { email }
      // let user
      // try {
      //    user = await usersDB.authenticate(userFields)
      // } catch (error) {
      //    return res(
      //       ctx.status(400),
      //       ctx.json({ status: 400, message: error.message }),
      //    )
      // }
      return res(ctx.json(data))
   }),

   rest.get(`${API_BASE_URL}/requestsList`, async (req, res, ctx) => {
      let requestsItem = await requestsListItems.getAllRequests();
      return res(ctx.status(200), ctx.json(requestsItem))
   }),

   // rest.get(`${apiUrl}/me`, async (req, res, ctx) => {
   //    const user = await getUser(req)
   //    const token = getToken(req)
   //    return res(ctx.json({ user: { ...user, token } }))
   // }),

   // rest.get(`${apiUrl}/bootstrap`, async (req, res, ctx) => {
   //    const user = await getUser(req)
   //    const token = getToken(req)
   //    const lis = await listItemsDB.readByOwner(user.id)
   //    const listItemsAndBooks = await Promise.all(
   //       lis.map(async listItem => ({
   //          ...listItem,
   //          book: await booksDB.read(listItem.bookId),
   //       })),
   //    )
   //    return res(ctx.json({ user: { ...user, token }, listItems: listItemsAndBooks }))
   // }),

   // rest.get(`${apiUrl}/books`, async (req, res, ctx) => {
   //    if (!req.url.searchParams.has('query')) {
   //       return ctx.fetch(req)
   //    }
   //    const query = req.url.searchParams.get('query')

   //    let matchingBooks = []
   //    if (query) {
   //       matchingBooks = await booksDB.query(query)
   //    } else {
   //       if (getToken(req)) {
   //          const user = await getUser(req)
   //          const allBooks = await getBooksNotInUsersList(user.id)
   //          // return a random assortment of 10 books not already in the user's list
   //          matchingBooks = allBooks.slice(0, 10)
   //       } else {
   //          const allBooks = await booksDB.readManyNotInList([])
   //          matchingBooks = allBooks.slice(0, 10)
   //       }
   //    }

   //    return res(ctx.json({ books: matchingBooks }))
   // }),

   // rest.get(`${apiUrl}/books/:bookId`, async (req, res, ctx) => {
   //    const { bookId } = req.params
   //    const book = await booksDB.read(bookId)
   //    if (!book) {
   //       return res(
   //          ctx.status(404),
   //          ctx.json({ status: 404, message: 'Book not found' }),
   //       )
   //    }
   //    return res(ctx.json({ book }))
   // }),

   // rest.get(`${apiUrl}/list-items`, async (req, res, ctx) => {
   //    const user = await getUser(req)
   //    const lis = await listItemsDB.readByOwner(user.id)
   //    const listItemsAndBooks = await Promise.all(
   //       lis.map(async listItem => ({
   //          ...listItem,
   //          book: await booksDB.read(listItem.bookId),
   //       })),
   //    )
   //    return res(ctx.json({ listItems: listItemsAndBooks }))
   // }),

   // rest.post(`${apiUrl}/list-items`, async (req, res, ctx) => {
   //    const user = await getUser(req)
   //    const { bookId } = req.body
   //    const listItem = await listItemsDB.create({
   //       ownerId: user.id,
   //       bookId: bookId,
   //    })
   //    const book = await booksDB.read(bookId)
   //    return res(ctx.json({ listItem: { ...listItem, book } }))
   // }),

   // rest.put(`${apiUrl}/list-items/:listItemId`, async (req, res, ctx) => {
   //    const user = await getUser(req)
   //    const { listItemId } = req.params
   //    const updates = req.body
   //    await listItemsDB.authorize(user.id, listItemId)
   //    const updatedListItem = await listItemsDB.update(listItemId, updates)
   //    const book = await booksDB.read(updatedListItem.bookId)
   //    return res(ctx.json({ listItem: { ...updatedListItem, book } }))
   // }),

   // rest.delete(`${apiUrl}/list-items/:listItemId`, async (req, res, ctx) => {
   //    const user = await getUser(req)
   //    const { listItemId } = req.params
   //    await listItemsDB.authorize(user.id, listItemId)
   //    await listItemsDB.remove(listItemId)
   //    return res(ctx.json({ success: true }))
   // }),

   // rest.post(`${apiUrl}/profile`, async (req, res, ctx) => {
   //    // here's where we'd actually send the report to some real data store.
   //    return res(ctx.json({ success: true }))
   // }),
].map(handler => {
   const originalResolver = handler.resolver
   handler.resolver = async function resolver(req, res, ctx) {
      try {
         if (shouldFail(req)) {
            throw new Error('Request failure (for testing purposes).')
         }

         const result = await originalResolver(req, res, ctx)
         return result
      } catch (error) {
         const status = error.status || 500
         return res(
            ctx.status(status),
            ctx.json({ status, message: error.message || 'Unknown Error' }),
         )
      } finally {
         await sleep()
      }
   }
   return handler
})

function shouldFail(req) {
   if (JSON.stringify(req.body)?.includes('FAIL')) return true
   if (req.url.searchParams.toString()?.includes('FAIL')) return true
   if (process.env.NODE_ENV === 'test') return false
   const failureRate = Number(
      window.localStorage.getItem('__bookshelf_failure_rate__') || 0,
   )
   if (Math.random() < failureRate) return true
   if (requestMatchesFailConfig(req)) return true

   return false
}

function requestMatchesFailConfig(req) {
   function configMatches({ requestMethod, urlMatch }) {
      return (
         (requestMethod === 'ALL' || req.method === requestMethod) &&
         match(urlMatch, req.url.pathname).matches
      )
   }
   try {
      const failConfig = JSON.parse(
         window.localStorage.getItem('__bookshelf_request_fail_config__') || '[]',
      )
      if (failConfig.some(configMatches)) return true
   } catch (error) {
      window.localStorage.removeItem('__bookshelf_request_fail_config__')
   }
   return false
}

// const getToken = req => req.headers.get('Authorization')?.replace('Bearer ', '')

// async function getUser(req) {
//    const token = getToken(req)
//    if (!token) {
//       const error = new Error('A token must be provided')
//       error.status = 401
//       throw error
//    }
//    let userId
//    try {
//       userId = atob(token)
//    } catch (e) {
//       const error = new Error('Invalid token. Please login again.')
//       error.status = 401
//       throw error
//    }
//    const user = await usersDB.read(userId)
//    return user
// }

// async function getBooksNotInUsersList(userId) {
//    const bookIdsInUsersList = (await listItemsDB.readByOwner(userId)).map(
//       li => li.bookId,
//    )
//    const books = await booksDB.readManyNotInList(bookIdsInUsersList)
//    return books
// }

export { handlers }
