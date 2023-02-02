/** @jsxImportSource @emotion/react */

import { Logo } from './components/logo';
import { useAuth } from 'context/auth-context';
import { GoogleLogin } from '@react-oauth/google';

function UnauthenticatedApp() {
   const { login } = useAuth()
   const loginHandler = (token) => {
      const payload = {
         idtoken: token.credential
      }
      window.localStorage.setItem('__auth_provider_OAuthToken__', token.credential)
      login({ data: payload })
   }
   return (
      <div
         css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100vh',
         }}
      >
         <Logo width="80" height="80" />
         <h1>Office Supply App</h1>
         <div
            css={{
               display: 'grid',
               gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
               gridGap: '0.75rem',
            }}>
            <GoogleLogin
               onSuccess={credentialResponse => {
                  loginHandler(credentialResponse)
               }}
               onError={() => {
                  console.log('Login Failed');
               }}
            />
         </div>
      </div>
   )
}

export default UnauthenticatedApp