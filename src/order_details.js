import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { nanoid } from 'nanoid'
import { Container } from '@mui/system'
import {
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  InputAdornment,
  TableBody
} from '@mui/material'
import { useParams } from 'react-router-dom'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PaymentsIcon from '@mui/icons-material/Payments'
import { Add } from '@mui/icons-material'


export const OrderDetails = () => {
  const { Id } = useParams()
  const [orderDetail, setOrderDetail] = useState([])
  const [items, setItems] = useState([])
  const [newObject, setnewObject] = useState({
    id: '',
    sku: '',
    name: '',
    quantity: '',
    price: ''
  })
  const isMounted = useRef()

  useEffect(() => {
    if (isMounted.current) {
      return
    } else {
      isMounted.current = true
      axios
        .get('https://eshop-deve.herokuapp.com/api/v2/orders', {
          headers: {
            Authorization:
              'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwUGFINU55VXRxTUkzMDZtajdZVHdHV3JIZE81cWxmaCIsImlhdCI6MTYyMDY2Mjk4NjIwM30.lhfzSXW9_TC67SdDKyDbMOYiYsKuSk6bG6XDE1wz2OL4Tq0Og9NbLMhb0LUtmrgzfWiTrqAFfnPldd8QzWvgVQ'
          }
        })
        .then(res => {
          for (let i = 0; i < res.data.orders.length; i++) {
            setOrderDetail(res.data.orders[i].items)
          }
          let OrderDetail = res.data.orders.find(
            data => data.id === Id.toString()
          )
          setOrderDetail(OrderDetail)
          setItems(OrderDetail.items)
        })
        .catch(err => console.log(err))
    }
  }, [Id]) 

  const addRow = (e) => {
    e.preventDefault();
    setnewObject({ ...newObject, id: nanoid() })
    setItems([...items, newObject])
    document.getElementById('form-items').reset();
    document.getElementById('sku').focus();
  }

  const confirm = () => {
    Swal.fire({
      title: 'Do you want to process the purchase?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire('Success', 'Payment made successfully.', 'success')
      }
    })
  }

  return (
    <Container maxWidth='md'>
      <Typography mt={2} textAlign='left' variant='h4'>
        Order Detail #{orderDetail.number}
      </Typography>
      <Box sx={{ m: 5 }} />
      <form id='form-items' onSubmit={addRow}>
        <Grid container alignItems='center' spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField            
              id='sku'
              name='sku'
              required
              fullWidth
              autoFocus
              label='Sku'
              onChange={e =>
                setnewObject({ ...newObject, sku: e.target.value })
              }              
              
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              id='name'
              name='name'
              required
              fullWidth
              label='Name'
              onChange={e =>
                setnewObject({ ...newObject, name: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              required
              id='quantity'
              name='quantity'
              type='number'
              fullWidth
              label='Quantity'
              onChange={e =>
                setnewObject({ ...newObject, quantity: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              id='price'
              name='price'
              required
              type='number'
              fullWidth
              label='Price'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <AttachMoneyIcon />
                  </InputAdornment>
                )
              }}
              onChange={e =>
                setnewObject({ ...newObject, price: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              mb={3}
              type='submit'
              color='primary'
              fullWidth
              variant='contained'
              startIcon={<Add />}
              //onClick={addRow}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>

      <Box mt={3}></Box>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Sku</TableCell>
              <TableCell align='center'>Name</TableCell>
              <TableCell align='center'>Quantity</TableCell>
              <TableCell align='center'>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(row => (
              <TableRow key={row.id}>
                <TableCell align='center'>{row.sku}</TableCell>
                <TableCell align='center'>{row.name}</TableCell>
                <TableCell align='center'>{row.quantity}</TableCell>
                <TableCell align='center'>{row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid mt={4} container sx={{ justifyContent: 'flex-end' }}>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            sx={{ height: 55 }}
            variant='contained'
            color='success'
            startIcon={<PaymentsIcon />}
            onClick={confirm}
          >
            Pay
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}
