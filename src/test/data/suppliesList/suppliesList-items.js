import { buildSuppliesList } from 'test/generate';

let suppliesListItems = createUsers(30);
const listItemsKey = '__users_list_items__';
const persist = () => window.localStorage.setItem(listItemsKey, JSON.stringify(suppliesListItems))
const load = () =>
   Object.assign(
      suppliesListItems,
      JSON.parse(window.localStorage.getItem(listItemsKey)),
   )

// initialize
try {
   load()
} catch (error) {
   persist()
}

function createUsers(numUsers = 5) {
   return new Array(numUsers).fill(undefined).map(buildSuppliesList);
}

window.__userList = window.__userList || {}
window.__userList.purgeListItems = () => {
   Object.keys(suppliesListItems).forEach(key => {
      delete suppliesListItems[key]
   })
   persist()
}

async function update(id, updates) {
   Object.assign(suppliesListItems[id], updates)
   persist()
   return read(id)
}

async function read(id) {
   return suppliesListItems[id]
}

// this would be called `delete` except that's a reserved word in JS :-(
async function remove(id) {
   delete suppliesListItems[id - 1]
   persist()
}

async function reset() {
   suppliesListItems = {}
   persist()
}

async function getAllSupplies() {
   return suppliesListItems
}

export { update, remove, reset, getAllSupplies }
