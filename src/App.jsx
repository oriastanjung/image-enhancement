import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HistogramPage from './HistogramPage'
import EqualizationPage from './EqualizationPage'


function App() {
  return (
    <>
        <Routes>
            <Route path='/' element={<HistogramPage />}></Route>

            <Route path='/equalization' element={<EqualizationPage />}></Route>
        </Routes>
    </>
  )
}

export default App