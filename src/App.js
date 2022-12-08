import React, { useState } from 'react';
import './App.css';
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';

import 'firebase/compat/auth';
import { } from 'firebase/analytics';
import { } from 'firebase/firestore';
import firebaseConfig from './firebase.config';
firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser]= useState({
  signedIn:false,
  name:'',
  email:'',
  photo:''

  });
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleClick = ()=>{
    firebase.auth()
    .signInWithPopup(provider)
    .then((result) => {
      const {displayName,photoURL,email}=result.user;
      const signedUser={
        signedIn:true,
        name:displayName,
        email:photoURL,
        photo:email
      }
      setUser(signedUser);
      //console.log(displayName,photoURL,email);
    })
    .catch((error) => {
       var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
   
    });
    } 
   // The firebase.auth.AuthCredential type that was used.
   const handleSignOut =()=>{
    firebase.auth().signOut()
    .then((result) => {
      const signedOutuser= {
        signedIn:false,
name:'',
email:'',
photo:''

      }
      setUser(signedOutuser);
    }).catch((error) => {
      // An error happened.
    }); 
      // ...
    
  }
  return (
    <div className="">
     {
      user.signedIn?<button onClick={handleSignOut}>Signed Out</button>:<button onClick={handleClick}>Signed In</button>
     }
     {
     user.signedIn && <p>Welcome , {user.name}
     ,{user.email},
     {user.photo}
     
     </p>
     }

<br/>
<br/>
    <form action="">
    <input type="text" name="" id="" required/>
     <br/><br/>
     <input type="password" name="" id="" required /><br/>
     <input type="submit" value="submit" />
     
     
    </form>
    </div>
   
  );
  
}

export default App;
