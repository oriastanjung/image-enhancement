import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className='flex flex-col md:flex-row md:items-start items-center justify-between container mx-auto py-5 px-10 bg-slate-200' >
        <h1 className='font-bold'>Image Enhancement</h1>
        <ul className='flex gap-5 mt-5 md:mt-0'>
            <li className='font-light hover:underline'><Link to={"/equalization"}>Equalization</Link></li>
            <li className='font-light hover:underline'><Link to={"/"}>Specification</Link></li>

        </ul>
    </nav>
  )
}
