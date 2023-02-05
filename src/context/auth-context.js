import React from 'react'
import * as auth from 'auth-provider'
import { client } from 'utils/login-service'
import { useAsync } from 'utils/hooks'
import { FullPageSpinner, FullPageErrorFallback } from 'components/lib'

async function bootstrapAppData() {
   let user = null

   const token = await auth.getToken('__auth_provider_OAuthToken__')
   if (token) {
      // const payload = {
      //    idtoken: token
      // }
      // const data = await client('api/login', { data: payload })
      const data = await client('login')
      user = data;
      window.localStorage.setItem('__user-data__', JSON.stringify(user))
   }
   return user
}

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function AuthProvider(props) {
   const {
      data: user,
      status,
      error,
      isLoading,
      isIdle,
      isError,
      isSuccess,
      run,
      setData,
   } = useAsync()

   // revisit the code
   React.useEffect(() => {
      const appDataPromise = bootstrapAppData()
      run(appDataPromise)
   }, [run])

   const login = React.useCallback(
      form => auth.login(form).then(user => setData(user)),
      [setData],
   )
   const register = React.useCallback(
      form => auth.register(form).then(user => setData(user)),
      [setData],
   )
   const logout = React.useCallback(() => {
      auth.logout()
      // queryCache.clear()
      setData(null)
   }, [setData])

   const value = React.useMemo(
      () => ({ user, login, logout, register }),
      [login, logout, register, user],
   )

   if (isLoading || isIdle) {
      return <FullPageSpinner />
   }

   if (isError) {
      return <FullPageErrorFallback error={error} />
   }

   if (isSuccess) {
      return <AuthContext.Provider value={value} {...props} />
   }

   throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
   const context = React.useContext(AuthContext)
   if (context === undefined) {
      throw new Error(`useAuth must be used within a AuthProvider`)
   }
   return context
}

function useClient() {
   const { user } = useAuth()
   const token = user?.Email
   return React.useCallback(
      (endpoint, config) => client(endpoint, { ...config, token }),
      [token],
   )
}

export { AuthProvider, useAuth, useClient }
