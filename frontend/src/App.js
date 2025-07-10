import { BrowserRouter,Routes,Route} from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/dashboard';

<BrowserRouter>
<Routes>
    <Route path='/' element={<Login />} />
    <Route path='/login' element={<Login />}/>
    <Route path='/dashboard' element={<Dashboard />}/>
    
</Routes>
</BrowserRouter>