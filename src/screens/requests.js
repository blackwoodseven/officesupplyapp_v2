/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import * as colors from 'styles/colors';
import { Button, Spinner, FormGroup, CircleButton, MUIDialog } from 'components/lib';

import { getDatas, createData, updateData } from 'utils/data-service';
import { useAuth } from 'context/auth-context';

import useSWR from 'swr';
import moment from 'moment';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import Divider from '@mui/material/Divider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

import '../App.css'

function ItemForm({ onSubmit, submitButton, supplyData }) {
   const [dueDatevalue, setDueDateValue] = React.useState(null);
   const [inputFields, setInputFields] = React.useState([
      { id: '', quantity: '' }
   ])

   function handleSubmit(event) {
      event.preventDefault()
      onSubmit(inputFields, dueDatevalue)
   }

   const handleFormChange = (index, event) => {
      let data = [...inputFields];
      data[index][event.target.name] = event.target.value;
      setInputFields(data)
   }

   const addToList = () => {
      let newfield = { id: '', quantity: '' }
      setInputFields([...inputFields, newfield])
   };

   const removeFields = (index) => {
      let data = [...inputFields];
      data.splice(index, 1)
      setInputFields(data)
   }

   return (
      <>
         <div css={{
            display: 'grid',
            gridTemplateColumns: '1fr 0.5fr',
            gridGap: '0.75rem',
            padding: '10px 0px'
         }}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
               <DatePicker
                  label="Choose Due Date"
                  value={dueDatevalue}
                  disablePast={true}
                  onChange={(newValue) => {
                     setDueDateValue(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
               />
            </LocalizationProvider>

            <Button onClick={() => addToList()}>
               Add more
            </Button>
         </div>
         <form onSubmit={handleSubmit}>
            {inputFields.map((input, inputIndex) => (
               <div key={inputIndex} css={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 0.2fr',
                  gridGap: '0.75rem',
                  marginBottom: '20px',
                  marginTop: '20px',
               }}
               >
                  <FormGroup>
                     <FormControl fullWidth>
                        <InputLabel>Select Product</InputLabel>
                        <Select
                           name='id'
                           labelId="dimensionLabel"
                           id="id"
                           value={input.id}
                           label="Select Product"
                           onChange={(e) => handleFormChange(inputIndex, e)}>
                           {supplyData.map((supData) => (
                              <MenuItem key={supData.id} value={`${supData.id}`}>{supData.product} - {supData.quantity}</MenuItem>
                           ))}
                        </Select>
                     </FormControl>
                  </FormGroup>

                  <FormGroup>
                     <TextField variant="outlined" label="Quantity" name='quantity' type='number' value={input.quantity} onChange={(e) => handleFormChange(inputIndex, e)} id="quantity" />
                  </FormGroup>

                  <FormGroup>
                     <IconButton aria-label="delete" color="error"
                        disabled={(inputFields.length === 1) ? true : false}
                        onClick={() => removeFields(inputIndex)}>
                        <DeleteIcon />
                     </IconButton>
                  </FormGroup>
               </div>
            ))}
            <div>
               {React.cloneElement(
                  submitButton,
                  { type: 'submit', disabled: (dueDatevalue) ? false : true },
                  ...(Array.isArray(submitButton.props.children)
                     ? submitButton.props.children
                     : [submitButton.props.children]), null
               )}
            </div>
         </form>
      </>
   )
}

function RequestsList() {
   const { user } = useAuth();
   const [requestData, setRequestData] = useState([])
   const { data, error, isLoading, isError } = useSWR('requestsList?status=pending', getDatas);
   const { data: supplyData } = useSWR('suppliesList', getDatas);

   const [selectedRequestItem, setSelectedRequestItem] = React.useState(null)
   const [selectedRequestItemModalisOpen, setSelectedRequestItemModalisOpen] = React.useState(false)
   const [isOpen, setIsOpen] = React.useState(false)

   useEffect(() => {
      setRequestData(data);
   }, [data])



   if (requestData && requestData.length > 0 && supplyData && supplyData.length > 0) {
      requestData.forEach(data => {
         if (data.requestList) {
            data.requestList.forEach(rdata => {
               const findProduct = supplyData.find((sData) => parseInt(sData.id) === parseInt(rdata.id));
               rdata.name = findProduct.product;
               rdata.productQuantity = findProduct.quantity;
            });
         }
      });
   }

   const updateListStatus = (row, status) => {
      row.status = status;
      updateData('requestsList', row, row.id)
         .then((res) => {
            setRequestData(requestData.filter(d => d.id !== row.id))
         })
         .catch(err => { throw new Error(err); })
   }

   const createNewRequestHandler = (data, dueDate) => {
      let payLoad = {
         "email": user.Email,
         "employeeName": user.Name,
         "requestList": data,
         "dueDate": moment(dueDate).format("DD/MM/YYYY"),
         "status": "pending"
      };
      createData('requestsList', payLoad)
         .then((res) => {
            setRequestData(oldArray => [...oldArray, res.data])
            setIsOpen(false)
         })
         .catch(err => { setIsOpen(false); throw new Error(err); })
   }



   return (
      <div style={{ maxHeight: 'calc(85vh - 90px)', width: '100%' }}>
         {isError ? (
            <div css={{ color: colors.danger }}>
               <p>There was an error:</p>
               <pre>{error.message}</pre>
            </div>
         ) : null}
         {isLoading ? (<Spinner />) : ('')}

         <>
            <div css={{
               display: 'grid',
               height: '70px',
               padding: '0px 10px',
               gridTemplateColumns: '1fr 0.2fr',
               alignItems: 'baseline'
            }}>
               <h2>Requests Page</h2>
               <Button variant="kantarBlack" onClick={() => setIsOpen(true)}>Request Supplies</Button>

               <MUIDialog open={isOpen} fullWidth={true} maxWidth={'sm'} onClose={() => setIsOpen(false)}>
                  <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                     <CircleButton onClick={() => setIsOpen(false)}>
                        <span aria-hidden>&times;</span>
                     </CircleButton>
                  </div>
                  <DialogTitle css={{ textAlign: 'center' }}>Request Items</DialogTitle>
                  <DialogContent>
                     <ItemForm
                        onSubmit={(data, dueDate) => createNewRequestHandler(data, dueDate)}
                        submitButton={<Button variant="kantarBlack">Submit Request</Button>}
                        supplyData={supplyData}
                     />
                  </DialogContent>
                  <DialogActions></DialogActions>
               </MUIDialog>

               <MUIDialog open={selectedRequestItemModalisOpen} fullWidth={true} maxWidth={'sm'} onClose={() => { setSelectedRequestItemModalisOpen(false); setSelectedRequestItem(null); }}>
                  <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                     <CircleButton onClick={() => { setSelectedRequestItemModalisOpen(false); setSelectedRequestItem(null); }}>
                        <span aria-hidden>&times;</span>
                     </CircleButton>
                  </div>
                  <DialogTitle css={{ textAlign: 'center' }}>Request Items List</DialogTitle>
                  <DialogContent>
                     <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                        {
                           (selectedRequestItem && selectedRequestItem.requestList) ?
                              (selectedRequestItem.requestList.map((rItem, i) => (
                                 <div key={i}>
                                    <ListItem>
                                       <ListItemAvatar>
                                          <Avatar>
                                             <ImageIcon />
                                          </Avatar>
                                       </ListItemAvatar>
                                       <ListItemText primary={`${rItem.name} - ${rItem.productQuantity}`} secondary={`Quantity - ${rItem.quantity}`} />
                                    </ListItem>
                                    <Divider />
                                 </div>
                              ))
                              ) : ''
                        }
                     </List>

                  </DialogContent>
                  <DialogActions></DialogActions>
               </MUIDialog>
            </div>
            {
               (requestData && requestData.length) ? (
                  <div>
                     {
                        (requestData.map((data, index) => (
                           <ListItems key={data.id} item={data} dIndex={index}
                              setSelectedRequestItem={setSelectedRequestItem}
                              setSelectedRequestItemModalisOpen={setSelectedRequestItemModalisOpen}
                              updateListStatus={updateListStatus}
                              user={user}
                           />
                        )))
                     }
                  </div>
               ) : (
                  <div css={{
                     display: 'grid',
                     justifyContent: 'center',
                  }}>No Data Available</div>
               )
            }
         </>
      </div>
   );
}

function ListItems({ item, dIndex, setSelectedRequestItem, setSelectedRequestItemModalisOpen, updateListStatus, user }) {
   const [expanded, setExpanded] = React.useState(false);
   const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
   };

   const onClick = (row) => {
      setSelectedRequestItem(row);
      setSelectedRequestItemModalisOpen(true);
   };
   const onClickApprove = (row) => {
      updateListStatus(row, 'approved');
   }
   const onClickReject = (row) => {
      updateListStatus(row, 'rejected');
   }
   return (
      <Accordion key={item.id} expanded={expanded === `panel${dIndex}`} onChange={handleChange(`panel${dIndex}`)}>
         <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id={`panel${dIndex}bh-header`}>
            <Typography sx={{ width: '30%', flexShrink: 0 }}>
               {item.employeeName} - {item.dueDate}
            </Typography>
            <Box sx={{ width: '45%', flexShrink: 0 }}>
               {
                  (item.status === "pending") ? (
                     <Chip label="Pending" color="warning" size="small" />
                  ) : (
                     ''
                  )
               }
            </Box>
            <Box sx={{ color: 'text.secondary' }}>
               {
                  (item.status === "pending") ? (
                     <div>
                        <Button css={{ marginRight: '5px' }} onClick={() => onClick(item)}>View List</Button>
                        {user.Role === 'admin' ? (
                           <>
                              <Button css={{ marginRight: '5px' }} onClick={() => onClickApprove(item)} variant="primary">Approve</Button>
                              <Button onClick={() => onClickReject(item)} variant="danger">Reject</Button>
                           </>
                        ) : ''
                        }
                     </div>
                  ) : (
                     <Button onClick={() => onClick(item)}>View List</Button>
                  )
               }
            </Box>
         </AccordionSummary>
         <AccordionDetails>
            {
               (item.requestList && item.requestList.length > 0) ? (
                  (item.requestList.map((requestListItem) => (
                     <div key={requestListItem.id}>
                        <ListItem>
                           <ListItemText
                              primary={`${requestListItem.name} - ${requestListItem.productQuantity}`}
                              secondary={`Quantity -  ${requestListItem.quantity}`}
                           />
                        </ListItem>
                        <Divider />
                     </div>
                  )))
               ) : ''
            }
         </AccordionDetails>
      </Accordion>
   )
}

export default RequestsList