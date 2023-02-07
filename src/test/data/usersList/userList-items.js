import { buildUserList } from 'test/generate';

let userListItems = createUsers(30);
const listItemsKey = '__users_list_items__';
const persist = () => window.localStorage.setItem(listItemsKey, JSON.stringify(userListItems))
const load = () =>
   Object.assign(
      userListItems,
      JSON.parse(window.localStorage.getItem(listItemsKey)),
   )

// initialize
try {
   load()
} catch (error) {
   persist()
}

function createUsers(numUsers = 5) {
   return new Array(numUsers).fill(undefined).map(buildUserList);
}

window.__userList = window.__userList || {}
window.__userList.purgeListItems = () => {
   Object.keys(userListItems).forEach(key => {
      delete userListItems[key]
   })
   persist()
}

async function update(id, updates) {
   Object.assign(userListItems[id], updates)
   persist()
   return read(id)
}

async function read(id) {
   return userListItems[id]
}

// this would be called `delete` except that's a reserved word in JS :-(
async function remove(id) {
   delete userListItems[id - 1]
   persist()
}

async function reset() {
   userListItems = {}
   persist()
}

export { update, remove, reset }
