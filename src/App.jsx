import { Routes, Route } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import Login from './pages/Login'
import AuthCallback from './pages/AuthCallback'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/board' element={<Board />} />
      <Route path='/callback' element={<AuthCallback />} />
    </Routes>
  )
}

export default App
