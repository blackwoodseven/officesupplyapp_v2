const localStorageKey = '__auth_provider_token__'
const localStorageEmail = '__auth_provider_email__'

async function getToken(key = localStorageKey) {
   return window.localStorage.getItem(key)
}

function handleUserResponse({ user }) {
   window.localStorage.setItem(localStorageKey, user.ID)
   window.localStorage.setItem(localStorageEmail, user.Email)
   window.localStorage.setItem('__user-data__', user)
   return user
}

function login({ data }) {
   // return client('api/login', data).then(handleUserResponse)
   return client('login', data).then(handleUserResponse)
}

function register({ username, password }) {
   return client('register', { username, password }).then(handleUserResponse)
}

async function logout() {
   window.localStorage.removeItem(localStorageKey)
   window.localStorage.removeItem(localStorageEmail)
   window.localStorage.removeItem("__auth_provider_OAuthToken__")
}

const authURL = process.env.REACT_APP_AUTH_URL

async function client(endpoint, data) {
   const config = {
      method: data ? 'POST' : 'GET',
      body: data ? JSON.stringify(data) : undefined,
      headers: { 'Content-Type': data ? 'application/json' : undefined, },
   }
   if (endpoint === "login") {
      config.method = 'GET'
      delete config.headers
      delete config.body
   }

   return window.fetch(`${authURL}/${endpoint}`, config).then(async response => {
      const data_resp = await response.json()
      if (response.ok) {
         return { user: data_resp }
      } else {
         return Promise.reject(data_resp)
      }
   })
}

export { getToken, login, register, logout, localStorageKey }
