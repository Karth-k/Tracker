import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/dashboard';
import Groups from './Pages/Groups'
import Register from './Pages/Resgister';

function App() {
  return (
<BrowserRouter>
  <Routes>
    <Route path='/' element={<Login />} />
    <Route path='/login' element={<Login />}/>
    <Route path='/register' element={<Register />} />
    <Route path='/dashboard' element={<Dashboard />}/>
    <Route path='/groups' element={<Groups />}/>
    

 </Routes>
</BrowserRouter>
 );
}

export default App;