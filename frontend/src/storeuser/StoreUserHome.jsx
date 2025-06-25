import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

function StoreUserHome() {
  return (
    <div>
      <div>
      <Header />
      <div style={{ padding: '20px' }}>
        <Outlet /> {/* This is where body content changes */}
      </div>
    </div>
      
    </div>
  )
}

export default StoreUserHome
