/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import * as colors from 'styles/colors';
import { Button, Spinner, FormGroup, Input, ErrorMessage, CircleButton, MUIDialog } from 'components/lib';

import { getDatas, createData } from 'utils/data-service';
import { useAsync } from 'utils/hooks';
import useSWR from 'swr'

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

function ItemForm({ onSubmit, submitButton }) {
   const { isLoading, isError, error } = useAsync()
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
            <Input id="product" />
         </FormGroup>
         <FormGroup>
            <label htmlFor="quantity">Quantity</label>
            <Input id="quantity" />
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
                  : [submitButton.props.children]),
               isLoading ? <Spinner css={{ marginLeft: 5 }} /> : null,
            )}
         </div>
         {isError ? <ErrorMessage error={error} /> : null}
      </form>
   )
}

function SuppliesList() {
   const [suppplyData, setSuppplyData] = useState([])
   const [isOpen, setIsOpen] = useState(false)
   const { data, error, isLoading } = useSWR('suppliesList', getDatas);

   useEffect(() => {
      setSuppplyData(data);
   }, [data])


   const createNewUserHandler = (data) => {
      createData('suppliesList', data)
         .then((res) => {
            setSuppplyData(oldArray => [...oldArray, res.data]);
            setIsOpen(false)
         })
         .catch(err => { setIsOpen(false); throw new Error(err) })
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
                              onSubmit={(data) => createNewUserHandler(data)}
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
      </div >
   );
}

export default SuppliesList