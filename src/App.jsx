import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Board from '~/pages/Boards/_id'
import Login from './pages/Login'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </Router>
  )
}

export default App
