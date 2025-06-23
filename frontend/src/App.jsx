import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from './authentication/Signup';
import Login from './authentication/Login';

//admin
import Header from './admin/Header';
import AdminLayout from './admin/AdminHome';
import Dashboard from './admin/body/Dashboard';
import Stores from './admin/body/Stores';
import Users from './admin/body/Users';


//user
import UserHeader from './user/Header';
import UserLayout from './user/UserHome';
import UserDashboard from './user/body/Dashboard'




function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Signup></Signup>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>


      {/* Admin layout with nested routes */}
      <Route path='/admin' element={<AdminLayout />}>
          <Route path='home' element={<Dashboard />} />
          <Route path='stores' element={<Stores/>} />
          <Route path='users' element={<Users/>} />

          {/* Add more admin routes like below: */}
          {/* <Route path='users' element={<Users />} /> */}
          {/* <Route path='settings' element={<Settings />} /> */}
        </Route>


        <Route path='/user' element={<UserLayout />}>
          <Route path='home' element={<UserDashboard />} />

          {/* Add more admin routes like below: */}
          {/* <Route path='users' element={<Users />} /> */}
          {/* <Route path='settings' element={<Settings />} /> */}
        </Route>
    </Routes>
    </BrowserRouter>
      
  )
}

export default App
