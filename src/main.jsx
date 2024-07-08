import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
// import './index.css'
import Register from './components/register/Register.jsx';
import PantryPage from './pages/PantryPage.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element ={<HomePage />} />
      <Route path='register' element={<Register />} />
      <Route path="pantry-page" element={<PantryPage />} />
   </Route>
  )
)




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
