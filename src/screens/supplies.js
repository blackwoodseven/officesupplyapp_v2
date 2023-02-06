/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import * as colors from 'styles/colors';
import { Button, Spinner, FormGroup, Input, CircleButton, MUIDialog } from 'components/lib';

import { getDatas, createData } from 'utils/data-service';
import useSWR from 'swr';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MuiAlert from '@mui/material/Alert';

function ItemForm({ onSubmit, submitButton }) {
   const [dimension, setDimension] = React.useState('');
   function handleSubmit(event) {
      event.preventDefault()

      const { product, quantity } = event.target.elements

      onSubmit({
         product: product.value,
         quantity: `${quantity.value} ${dimension}`,
      })
   }
   const handleChange = (event) => {
      setDimension(event.target.value);
   };
   return (
      <form
         onSubmit={handleSubmit}
         css={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            '> div': {
               margin: '10px auto',
               width: '100%',
               maxWidth: '300px',
            },
         }}
      >
         <FormGroup>
            <label htmlFor="product">Product Name</label>
            <Input id="product" name="productname"/>
         </FormGroup>
         <FormGroup>
            <label htmlFor="quantity">Quantity</label>
            <Input id="quantity" name="productquantity"/>
         </FormGroup>
         <FormGroup>
            <FormControl fullWidth>
               <InputLabel id="dimensionLabel">Dimension</InputLabel>
               <Select
                  labelId="dimensionLabel"
                  id="demo-simple-select"
                  value={dimension}
                  label="Dimension"
                  onChange={handleChange}>
                  <MenuItem value={'KG'}>KG</MenuItem>
                  <MenuItem value={'Gram'}>Gram</MenuItem>
                  <MenuItem value={'Bag'}>Bag</MenuItem>
                  <MenuItem value={'Pack'}>Pack</MenuItem>
                  <MenuItem value={'Pic'}>Pic</MenuItem>
               </Select>
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

function SuppliesList() {
   const [suppplyData, setSuppplyData] = useState([]);
   const [openAlert, setOpenAlert] = React.useState(false);
   const [isOpen, setIsOpen] = useState(false);
   const { data, error, isLoading } = useSWR('suppliesList', getDatas);
   
   useEffect(() => {
      setSuppplyData(data);
   }, [data])

   const Alert = React.forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
   });

   const createNewSupplyHandler = (data) => {
      createData('suppliesList', data)
         .then((res) => {
            setSuppplyData(oldArray => [...oldArray, res.data]);
            setOpenAlert(true);
            setIsOpen(false);
         })
         .catch(err => { setIsOpen(false); throw new Error(err) })
   }

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

   if (isLoading) return (<Spinner />)

   if (error) return (
      <div css={{ color: colors.danger }}>
         <p>There was an error:</p>
         <pre>{error.message}</pre>
      </div>
   )

   return (
      <div style={{ maxHeight: 'calc(85vh - 90px)', width: '100%' }}>
         {
            (suppplyData && suppplyData.length) ? (
               <>
                  <div css={{
                     display: 'grid',
                     height: '70px',
                     padding: '0px 10px',
                     gridTemplateColumns: '1fr 0.2fr',
                     alignItems: 'baseline'
                  }}>
                     <h2>Requests Page</h2>
                     <Button variant="kantarBlack" onClick={() => setIsOpen(true)}>Add New Item</Button>

                     <MUIDialog open={isOpen} fullWidth={true} maxWidth={'sm'} onClose={() => setIsOpen(false)}>
                        <div css={{ display: 'flex', justifyContent: 'flex-end' }}>
                           <CircleButton onClick={() => setIsOpen(false)}>
                              <span aria-hidden>&times;</span>
                           </CircleButton>
                        </div>
                        <DialogTitle css={{ textAlign: 'center' }}>Add New Item</DialogTitle>
                        <DialogContent>
                           <ItemForm
                              onSubmit={(data) => createNewSupplyHandler(data)}
                              submitButton={<Button variant="kantarBlack">Add</Button>}
                           />
                        </DialogContent>
                        <DialogActions></DialogActions>
                     </MUIDialog>
                  </div>
                  <ImageList cols={3} rowHeight={164} gap={20} sx={{ padding: '0px 10px' }}>
                     {suppplyData.map((item) => (
                        <ImageListItem key={item.id}>
                           {item.product}
                           <Card sx={{ minWidth: 200, transition: '0.1s ease-in-out', "&:hover": { scale: '1.05' } }}>
                              <CardContent>
                                 <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                    #{item.id}
                                 </Typography>
                                 <Typography variant="h5" component="div">
                                    {item.product}
                                 </Typography>
                                 <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    Quantity - {item.quantity}
                                 </Typography>
                              </CardContent>
                           </Card>
                        </ImageListItem>
                     ))}
                  </ImageList>
               </>
            ) : (<div>No Data Found...</div>)
         }

         <Snackbar
            anchorOrigin={{
               vertical: 'top',
               horizontal: 'right',
            }}
            open={openAlert}
            autoHideDuration={5000}
            onClose={handleClose}
            message="Added Successfully"
            action={action}>
            <Alert severity="success">Added Successfully!</Alert>
         </Snackbar>
      </div >
   );
}

export default SuppliesList