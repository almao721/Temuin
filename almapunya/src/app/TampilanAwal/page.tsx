import React from 'react'
import Navbar from '../Navbar/page'
import Beranda from './Beranda/page'
import AboutUs from './AboutUs/page'
import FormPage from './FormPage/page'

export default function TampilanAwal() {
  return (
    <div>
        <Navbar/>
        <Beranda/>
        <AboutUs/>
        <FormPage/>
    </div>
  )
}
