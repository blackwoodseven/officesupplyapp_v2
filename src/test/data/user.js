const usersKey = '__user-data__'
let users = {}
const persist = () => window.localStorage.setItem(usersKey, JSON.stringify(users))
const load = () => Object.assign(users, JSON.parse(window.localStorage.getItem(usersKey)))

async function create({ Name }) {
   validateUserForm({ Name })
   const id = hash(Name);
   // if (users[id]) {
   //    const error = new Error(
   //       `Cannot create a new user with the username "${Name}"`,
   //    )
   //    error.status = 400
   //    throw error
   // }
   users[id] = { id, Name }
   persist()
   return read(id)
}

function validateUserForm({ Name }) {
   if (!Name) {
      const error = new Error('A username is required')
      error.status = 400
      throw error
   }
}

function hash(str) {
   var hash = 5381,
      i = str.length

   while (i) {
      hash = (hash * 33) ^ str.charCodeAt(--i)
   }
   return String(hash >>> 0)
}

async function read(id) {
   validateUser(id)
   return sanitizeUser(users[id])
}

function validateUser(id) {
   load()
   if (!users[id]) {
      const error = new Error(`No user with the id "${id}"`)
      error.status = 404
      throw error
   }
}

function sanitizeUser(user) {
   const { passwordHash, ...rest } = user
   return rest
}

// this would be called `delete` except that's a reserved word in JS :-(
async function remove(id) {
   validateUser(id)
   delete users[id]
   persist()
}

async function reset() {
   users = {}
   persist()
}

async function authenticate({ Name }) {
   validateUserForm({ Name })
   const id = hash(Name)
   const user = users[id] || {}
   // if (user.passwordHash === hash(password)) {
      return { ...sanitizeUser(user), token: btoa(user.ID) }
   // }
   // const error = new Error('Invalid username')
   // error.status = 400
   // throw error
}

export { create, read, remove, reset, authenticate }
