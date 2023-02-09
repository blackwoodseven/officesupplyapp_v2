/** @jsxImportSource @emotion/react */

import { useAuth } from 'context/auth-context';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router";
import './styles/login.css'

function UnauthenticatedApp() {
   const { login } = useAuth()
   const navigate = useNavigate();
   const loginHandler = (token) => {
      const payload = {
         idtoken: token.credential
      }
      window.localStorage.setItem('__auth_provider_OAuthToken__', token.credential)
      login({ data: payload }).then(() => navigate('/'))
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
         <div
            css={{
               display: 'grid',
               gridTemplateColumns: 'repeat(1, minmax(0, 1fr))',
               gridGap: '0.75rem',
            }}>
            <div className="login-wrapper">
               <div className="avatar">
                  <img alt="Kantar Logo" src="images/Kantar-Group-Logo-PNG-White.png" />
               </div>
               <h2 css={{
                  color: 'rgb(255 255 255 / 38%)',
                  fontSize: 'clamp(1.44rem, calc(1.05rem + 1.95vw), 2.44rem)',
                  fontWeight: '500',
                  margin: '0 0 2rem'
               }}>Office Supply App</h2>
               <h3 css={{
                  color: 'rgb(255 255 255 / 38%)',
                  fontWeight: '400',
                  margin: '0 0 2rem'
               }}>login with GoogleLogin</h3>
               <form className="login-form">
                  <GoogleLogin
                     onSuccess={credentialResponse => {
                        loginHandler(credentialResponse)
                     }}
                     onError={() => {
                        console.log('Login Failed');
                     }}
                  />
               </form>
            </div>

         </div>
      </div>
   )
}

export default UnauthenticatedApp