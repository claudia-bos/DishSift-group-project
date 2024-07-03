import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Header from './components/header/Header.jsx'
import './App.css'

function App() {
  



  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App
