/** @jsxImportSource @emotion/react */

import { useRoutes } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorMessage, FullPageErrorFallback } from 'components/lib';
import * as mq from 'styles/media-queries';
import { useAuth } from 'context/auth-context';

import ResponsiveAppBar from 'components/navbar';
import NotFoundScreen from 'screens/not-found';
import Profile from 'screens/profile';
import SuppliesList from 'screens/supplies';
import RequestsList from 'screens/requests';
import HistoryList from 'screens/history';
import UsersList from 'screens/users';

import Container from '@mui/material/Container';

const RouteArray = {
   normal: [
      { 'name': 'Supplies', 'link': '/', 'component': <SuppliesList /> },
      { 'name': 'Request', 'link': '/my-request', 'component': <RequestsList /> },
      { 'name': 'History', 'link': '/history', 'component': <HistoryList /> },
      { 'name': 'Profile', 'link': '/profile', 'component': <Profile /> }
   ],
   admin: [
      { 'name': 'Supplies', 'link': '/', 'component': <SuppliesList /> },
      { 'name': 'Request', 'link': '/my-request', 'component': <RequestsList /> },
      { 'name': 'Users', 'link': '/users', 'component': <UsersList /> },
      { 'name': 'History', 'link': '/history', 'component': <HistoryList /> },
      { 'name': 'Profile', 'link': '/profile', 'component': <Profile /> }
   ]
}

function ErrorFallback({ error }) {
   return (
      <ErrorMessage
         error={error}
         css={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
         }}
      />
   )
}

function AuthenticatedApp() {
   const { user } = useAuth();
   return (
      <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
         <ResponsiveAppBar userData={user} />
         <div
            css={{
               margin: '0 auto',
               padding: '4em 2em',
               // maxWidth: 'fit-content',
               width: 'auto',
               display: 'grid',
               gridGap: '1em',
               gridTemplateColumns: '1fr',
               [mq.small]: {
                  gridTemplateColumns: '1fr',
                  gridTemplateRows: 'auto',
                  width: '100%',
               },
            }}>
            <Container fixed>
               <main css={{ width: '100%' }}>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                     <AppRoutes user={user} />
                  </ErrorBoundary>
               </main>
            </Container>
         </div>
      </ErrorBoundary>
   )
}

function AppRoutes({ user }) {
   let routeList = [];
   for (let i = 0; i < RouteArray[user.Role].length; i++) {
      routeList.push({ path: RouteArray[user.Role][i].link, element: RouteArray[user.Role][i].component })
   }
   routeList.push({ path: '*', element: <NotFoundScreen /> });
   let routes = useRoutes(routeList)
   return routes
}

export default AuthenticatedApp