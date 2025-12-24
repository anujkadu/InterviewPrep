import React from 'react'
import { SignedOut, SignInButton, SignedIn, UserButton, SignOutButton } from '@clerk/clerk-react';
import { toast, Toaster } from 'react-hot-toast';   
function HomePage() {

    
    return(
         <div>
        <button className="btn btn-secondary" onClick={()=> toast.success("This is succesfull")}>Click Me  </button>
 <SignedOut>
      <SignInButton mode="modal">
        <button >Login</button>
      </SignInButton>
      </SignedOut>

      <SignedIn>
        <SignOutButton/>
      </SignedIn>

      <UserButton/>
      </div>
    );
}

export default HomePage