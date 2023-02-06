/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import * as colors from 'styles/colors';
import { Button, Spinner, CircleButton, MUIDialog } from 'components/lib';

import { getDatas } from 'utils/data-service';
import { useAuth } from 'context/auth-context';
import useSWR from 'swr';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Image';
import Chip from '@mui/material/Chip';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Divider } from '@mui/material';

function HistoryList() {
   const { user } = useAuth();
   const [requestData, setRequestData] = useState([])
   const [selectedRequestItem, setSelectedRequestItem] = React.useState(null)
   const [selectedRequestItemModalisOpen, setSelectedRequestItemModalisOpen] = React.useState(false)

   const { data, error, isLoading, isError } = useSWR(`requestsList?status=approved&status=rejected&email=${user.Email}`, getDatas);
   const { data: supplyData } = useSWR('suppliesList', getDatas);

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

   function ListItems({ item, dIndex }) {
      const [expanded, setExpanded] = React.useState(false);
      const handleChange = (panel) => (event, isExpanded) => {
         setExpanded(isExpanded ? panel : false);
      };

      const onClick = (item) => {
         setSelectedRequestItem(item);
         setSelectedRequestItemModalisOpen(true);
      };
      return (
         <Accordion key={item.id} expanded={expanded === `panel${dIndex}`} onChange={handleChange(`panel${dIndex}`)}>
            <AccordionSummary
               expandIcon={<ExpandMoreIcon />}
               aria-controls="panel1bh-content"
               id={`panel${dIndex}bh-header`}>
               <Typography sx={{ width: '30%', flexShrink: 0 }}>
                  {item.employeeName} - {item.dueDate}
               </Typography>
               <Box sx={{ width: '50%', flexShrink: 0 }}>
                  {
                     (item.status === "approved") ? (
                        <Chip label="Approved" color="success" size="small" />
                     ) : (
                        <Chip label="Rejected" color="error" size="small" />
                     )
                  }
               </Box>
               <Box sx={{ color: 'text.secondary' }}>
                  <Button onClick={() => onClick(item)}>View List</Button>
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
               <h2>Request's History</h2>
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
                                 <ListItem key={i}>
                                    <ListItemAvatar>
                                       <Avatar>
                                          <ImageIcon />
                                       </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={`${rItem.name} - ${rItem.productQuantity}`} secondary={`Quantity - ${rItem.quantity}`} />
                                 </ListItem>
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
                  <div className='custom-container'>
                     {
                        (requestData.map((data, index) => (
                           <ListItems key={data.id} item={data} dIndex={index} />
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

export default HistoryList