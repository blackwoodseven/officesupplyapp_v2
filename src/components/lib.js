import { Link as RouterLink } from 'react-router-dom';
import styled from '@emotion/styled/macro';
import { keyframes } from '@emotion/react';
import * as colors from '../styles/colors';
import Dialog from '@mui/material/Dialog';

import { FaSpinner } from 'react-icons/fa';

const spin = keyframes({
   '0%': { transform: 'rotate(0deg)' },
   '100%': { transform: 'rotate(360deg)' },
})

const CircleButton = styled.button({
   borderRadius: '30px',
   padding: '0',
   width: '40px',
   height: '40px',
   lineHeight: '1',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   background: colors.base,
   color: colors.text,
   border: `0px solid ${colors.gray10}`,
   cursor: 'pointer',
   fontSize: '30px'
})

const BookListUL = styled.ul({
   listStyle: 'none',
   padding: '0',
   display: 'grid',
   gridTemplateRows: 'repeat(auto-fill, minmax(100px, 1fr))',
   gridGap: '1em',
})

const Spinner = styled(FaSpinner)({
   animation: `${spin} 1s linear infinite`,
})
Spinner.defaultProps = {
   'aria-label': 'loading',
}

const buttonVariants = {

   primary: {
      background: colors.royalBlue,
      color: colors.base,
   },
   secondary: {
      background: colors.gray,
      color: colors.text,
   },
   kantarWhite: {
      background: colors.base,
      color: colors.text,
      border: `1px solid ${colors.text}`
   },
   kantarBlack: {
      background: colors.text,
      color: colors.base
   },
   danger: {
      background: colors.danger,
      color: colors.base
   }
}
const Button = styled.button(
   {
      padding: '10px 15px',
      border: '0',
      lineHeight: '1',
      borderRadius: '0px',
      height: '35px',
      cursor: 'pointer',
      ":disabled": {
         cursor: 'not-allowed',
         color: '#fff',
         backgroundColor: '#c0c0c0',
      }
   },
   ({ variant = 'kantarBlack' }) => buttonVariants[variant],
)

const inputStyles = {
   border: '1px solid #f1f1f4',
   background: '#f1f2f7',
   padding: '13.5px 15px',
}

const Input = styled.input({ borderRadius: '3px' }, inputStyles)
const Textarea = styled.textarea(inputStyles)

const MUIDialog = styled(Dialog)({
   borderRadius: '3px',
   boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
})

const FormGroup = styled.div({
   display: 'flex',
   flexDirection: 'column',
})

function FullPageSpinner() {
   return (
      <div
         css={{
            fontSize: '4em',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
         }}
      >
         <Spinner />
      </div>
   )
}

const Link = styled(RouterLink)({
   color: colors.indigo,
   ':hover': {
      color: colors.indigoDarken10,
      textDecoration: 'underline',
   },
})

const errorMessageVariants = {
   stacked: { display: 'block' },
   inline: { display: 'inline-block' },
}

function ErrorMessage({ error, variant = 'stacked', ...props }) {
   return (
      <div
         role="alert"
         css={[{ color: colors.danger }, errorMessageVariants[variant]]}
         {...props}
      >
         <span>There was an error: </span>
         <pre
            css={[
               { whiteSpace: 'break-spaces', margin: '0', marginBottom: -5 },
               errorMessageVariants[variant],
            ]}
         >
            {error.message}
         </pre>
      </div>
   )
}

function FullPageErrorFallback({ error }) {
   return (
      <div
         role="alert"
         css={{
            color: colors.danger,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
         }}
      >
         <p>Uh oh... There's a problem. Try refreshing the app.</p>
         <pre>{error.message}</pre>
      </div>
   )
}

export {
   FullPageErrorFallback,
   ErrorMessage,
   CircleButton,
   BookListUL,
   Spinner,
   Button,
   Input,
   Textarea,
   MUIDialog,
   FormGroup,
   FullPageSpinner,
   Link
}
