import { buildRequestsList } from 'test/generate';

let requestListItems = createRequests(20);
const listItemsKey = '__users_list_items__';
const persist = () => window.localStorage.setItem(listItemsKey, JSON.stringify(requestListItems))
const load = () =>
   Object.assign(
      requestListItems,
      JSON.parse(window.localStorage.getItem(listItemsKey)),
   )

// initialize
try {
   load()
} catch (error) {
   persist()
}

function createRequests(numUsers = 5) {
   return new Array(numUsers).fill(undefined).map(buildRequestsList);
}

window.__userList = window.__userList || {}
window.__userList.purgeListItems = () => {
   Object.keys(requestListItems).forEach(key => {
      delete requestListItems[key]
   })
   persist()
}

async function update(id, updates) {
   Object.assign(requestListItems[id], updates)
   persist()
   return read(id)
}

async function read(id) {
   return requestListItems[id]
}

// this would be called `delete` except that's a reserved word in JS :-(
async function remove(id) {
   delete requestListItems[id - 1]
   persist()
}

async function reset() {
   requestListItems = {}
   persist()
}

async function getAllRequests() {
   return requestListItems
}

export { update, remove, reset, getAllRequests }
