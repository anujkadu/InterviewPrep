
import { SignedOut, SignInButton, SignedIn, UserButton, SignOutButton , useUser} from '@clerk/clerk-react';
import { Route,Routes,Navigate } from 'react-router';
import HomePage from './pages/HomePage.jsx';
import {Toaster } from 'react-hot-toast'; 
import DashboardPage from './pages/DashboardPage.jsx';
import ProblemsPage from './pages/ProblemsPage.jsx';
function App() {
      const { isSignedIn,isLoaded }= useUser();

      //this gets rid of flicker effect
      if(!isLoaded) return null;
  return (
    <>
    <Routes>  
      
      <Route path="/" element ={!isSignedIn ? <HomePage/> :<Navigate to={"/dashboard"}/>}/>
      <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to = {"/"}/> }/>
    
      <Route path ="/problems" element={isSignedIn ?<ProblemsPage/> : <Navigate to={"/"}/>}/>
      </Routes>
      <Toaster toastOptions={{duration : 3000}}/>
      </>
  );
}

export default App