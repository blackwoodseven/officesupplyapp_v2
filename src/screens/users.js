/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import * as colors from 'styles/colors';
import { Button, Spinner, FormGroup, Input, CircleButton, MUIDialog } from 'components/lib';

import { getDatas, createData, updateData, deleteData } from 'utils/data-service';
// import { useAuth } from 'context/auth-context';

import useSWR from 'swr';
import { useForm } from 'react-hook-form';

import InputLabel from '@mui/material/InputLabel';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

function UserForm({ onSubmit, submitButton }) {
   const [role, setRole] = React.useState('');
   const { register, handleSubmit, formState: { errors } } = useForm();

   const handleFormChange = (event) => {
      setRole(event.target.value)
   }

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            '> div': {
               margin: '10px auto',
               width: '100%',
               maxWidth: '300px',
            },
         }}>
         <FormGroup>
            <label htmlFor="name">Full Name</label>
            <Input id="name" {...register("name", { required: true })} />
            <span css={{ color: colors.danger }}>
               {errors.name && <span>This field is required</span>}
            </span>
         </FormGroup>
         <FormGroup>
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" {...register("email", { required: true })} />
            <span css={{ color: colors.danger }}>
               {errors.email && <span>This field is required</span>}
            </span>
         </FormGroup>
         <FormGroup>
            <label htmlFor="id">Employee ID</label>
            <Input id="id" {...register("id", { required: true })} />
            <span css={{ color: colors.danger }}>
               {errors.id && <span>This field is required</span>}
            </span>
         </FormGroup>
         <FormGroup>
            <InputLabel id="role">Select Role</InputLabel>
            <FormControl fullWidth>
               <Select
                  name='role'
                  labelId="role"
                  id="select-role"
                  value={role}
                  label="Select Role"
                  {...register("role", { required: true })}
                  onChange={(e) => handleFormChange(e)}>
                  <MenuItem key="admin" value="admin">Admin</MenuItem>
                  <MenuItem key="normal" value="normal">Normal</MenuItem>
               </Select>
               <span css={{ color: colors.danger }}>
                  {errors.role && <span>This field is required</span>}
               </span>
            </FormControl>
         </FormGroup>

         <div>
            {React.cloneElement(
               submitButton,
               { type: 'submit' },
               ...(Array.isArray(submitButton.props.children)
                  ? submitButton.props.children
                  : [submitButton.props.children]), null
            )}
         </div>
      </form>
   )
}

function UsersList() {

   const [isOpen, setIsOpen] = React.useState(false)
   const [userListData, setUserListData] = useState([]);
   const [openAlert, setOpenAlert] = React.useState(false);
   const { data, error, isLoading } = useSWR('userList', getDatas);

   useEffect(() => {
      setUserListData(data);
   }, [data])

   const Alert = React.forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
   });

   const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
         return;
      }
      setOpenAlert(false);
   };

   const action = (
      <React.Fragment>
         <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}>
            <CloseIcon fontSize="small" />
         </IconButton>
      </React.Fragment>
   );

   const createNewUserHandler = (data) => {
      createData('userList', data)
         .then((res) => {
            setUserListData(oldArray => [...oldArray, res.data])
            setOpenAlert(true);
            setIsOpen(false)
         })
         .catch(err => { setIsOpen(false); throw new Error(err); })
   }

   const updateUserRoleHandler = (e, user) => {
      user.role = e.target.value;
      updateData('userList', user, user.id)
         .then((res) => {
            setOpenAlert(true);
            setUserListData(oldArray => [...oldArray, res.data])
         })
         .catch(err => { throw new Error(err); })
   }

   const deleteUserHandler = (user) => {
      deleteData('userList', user.id)
         .then((res) => {
            setOpenAlert(true);
            setUserListData(userListData.filter(d => d.id !== user.id))
         })
         .catch(err => { throw new Error(err); })
   }

   if (isLoading) return (<Spinner />)

   if (error) return (
      <div css={{ color: colors.danger }}>
         <p>There was an error:</p>
         <pre>{error.message}</pre>
      </div>
   )

   return (
      <div style={{ maxHeight: 'calc(85vh - 90px)', width: '100%' }}>
         <div css={{
            display: 'grid',
            height: '70px',
            padding: '0px 10px',
            gridTemplateColumns: '1fr 0.2fr',
            alignItems: 'baseline'
         }}>
            <h2>User's List</h2>
            <Button variant="kantarBlack" onClick={() => setIsOpen(true)}>Add New User</Button>

            {
               (userListData && userListData.length > 0) ? (
                  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                     {
                        userListData.map((user) => (
                           <div key={user.id}>
                              <ListItem alignItems="center">
                                 <ListItemAvatar>
                                    <Avatar sx={{ marginTop: '0px' }} alt={user.name} src="/static/images/avatar/1.jpg" />
                                 </ListItemAvatar>
                                 <ListItemText
                                    primary={user.name}
                                    secondary={
                                       <React.Fragment>
                                          <Typography
                                             sx={{ display: 'inline' }}
                                             component="span"
                                             variant="body2"
                                             color="text.primary">
                                             {user.role}
                                          </Typography>
                                          &nbsp;- {user.email}
                                       </React.Fragment>
                                    } />
                                 <Box sx={{ minWidth: 120 }}>
                                    <FormControl variant="standard" sx={{ mr: 3, minWidth: 150 }}>
                                       <InputLabel id="edit-role-select-label">Role</InputLabel>
                                       <Select
                                          labelId="edit-role-select-label"
                                          id="edit-role-select"
                                          value={user.role}
                                          label="Role"
                                          onChange={(e) => updateUserRoleHandler(e, user)}>
                                          <MenuItem value={'normal'}>Normal</MenuItem>
                                          <MenuItem value={'admin'}>Admin</MenuItem>
                                       </Select>
                                    </FormControl>
                                 </Box>
                                 <Button variant="danger" onClick={() => deleteUserHandler(user)}>Delete User</Button>
                              </ListItem>

                              <Divider variant="inset" component="li" />
                           </div>
                        ))
                     }

                  </List>
               ) : (
                  <p>No Data Available...</p>
               )
            }


            <MUIDialog open={isOpen} fullWidth={true} maxWidth={'sm'} onClose={() => setIsOpen(false)}>
               <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <CircleButton onClick={() => setIsOpen(false)}>
                     <span aria-hidden>&times;</span>
                  </CircleButton>
               </div>
               <DialogTitle css={{ textAlign: 'center' }}>Add New User form</DialogTitle>
               <DialogContent>
                  <UserForm
                     onSubmit={(data) => createNewUserHandler(data)}
                     submitButton={<Button variant="kantarBlack">Add</Button>}
                  />
               </DialogContent>
            </MUIDialog>

            <Snackbar
               anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
               }}
               open={openAlert}
               autoHideDuration={5000}
               onClose={handleClose}
               message="Updated Successfully"
               action={action}>
               <Alert severity="success">Updated Successfully!</Alert>
            </Snackbar>
         </div>
      </div>
   )

}

export default UsersList