
import { SignedOut, SignInButton, SignedIn, UserButton, SignOutButton , useUser} from '@clerk/clerk-react';
import { Route,Routes,Navigate } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import {Toaster } from 'react-hot-toast'; 

import ProblemsPage from './pages/ProblemsPage.jsx';
function App() {
      const { isSignedIn }= useUser()
  return (
    <>
    <Routes>  
      
      <Route path="/" element ={<HomePage />} />
    
      <Route path ="/problems" element={isSignedIn ?<ProblemsPage/> : <Navigate to={"/"}/>}/>
      </Routes>
      <Toaster toastOptions={{duration : 3000}}/>
      </>
  );
}

export default App