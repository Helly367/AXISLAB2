/* eslint-disable prettier/prettier */
import { Toaster } from 'react-hot-toast'
import Login from './Login'
import { Route, Routes, BrowserRouter } from 'react-router-dom'

function App() {
  console.log("salut")

  return (
    <div className="w-screen h-screen bg-white">
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
        </Routes>
      </BrowserRouter>


    </div>
  )
}

export default App
