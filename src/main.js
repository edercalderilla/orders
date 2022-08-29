import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Orders } from './orders'
import { OrderDetails } from './order_details'

export const Main = () => {
  return (
    <Routes>
      <Route path='/' element={<Orders />} />
      <Route path='/Orders' element={<Orders />} />
      <Route path='/OrderDetail/:Id' element={<OrderDetails />} />
    </Routes>
  )
}
