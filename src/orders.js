import React, { useRef, useEffect, useState } from 'react'
import axios from 'axios'
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Container } from '@mui/system'
import { useNavigate } from 'react-router-dom'

export const Orders = () => {
  const navigate = useNavigate()
  const viewDetail = Id => {
    navigate('/OrderDetail/' + Id)
  }

  const [value, setValue] = useState([])

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
            let rawDate = new Date(res.data.orders[i].dates.createdAt)
            let formattedDate = rawDate.toLocaleDateString('en-US', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })
            res.data.orders[i].dates.createdAt = formattedDate
          }
          setValue(res.data.orders)
        })
        .catch(err => console.log(err))
    }
  }, [])

  return (
    <Container maxWidth='md'>
      <Typography mt={2} mb={4} textAlign='center' variant='h3'>
        Orders
      </Typography>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell align='center'>Number</TableCell>
              <TableCell align='center'>Creation date</TableCell>
              <TableCell align='center'>Total</TableCell>
              <TableCell align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {value.map(row => (
              <TableRow key={row.id}>
                <TableCell align='center'>{row.number}</TableCell>
                <TableCell align='center'>{row.dates.createdAt}</TableCell>
                <TableCell align='center'>$ {row.totals.total}</TableCell>
                <TableCell align='center'>
                  <Tooltip title='View details'>
                    <IconButton
                      onClick={() => viewDetail(row.id)}
                      color='primary'
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}
