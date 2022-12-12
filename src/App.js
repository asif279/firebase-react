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
  const [newUser,setnewUser]=useState(false)
  const [user,setUser]= useState({
  signedIn:false,
  name:'',
  email:'',
  photo:'',
  password:'',
 

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
      console.log(errorCode,errorMessage,email,credential)
   
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
photo:'',
error:'',
success:false

      }
      setUser(signedOutuser);
    }).catch((error) => {
      // An error happened.
    }); 
      // ...
   
    }
    const handleBlur=(e)=>{
      let formValid =true;
       
      if(e.target.name==='email'){
         const  isValid= /\S+@\S+\.\S+/.test(e.target.value);
         console.log(isValid);

      } 
       if(e.target.name==='password'){
 const isVpassword = e.target.value.length>8;
 const isD= /\d{1}/.test(e.target.value);
 formValid =isVpassword && isD;

      }
      if(formValid){
        const userInfo ={...user};
        userInfo[e.target.name]=e.target.value;
        setUser(userInfo);
      }

  }
  const handleSubmit=(e)=>{
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res=>{
   const newUserInfo={...user}
   newUserInfo.success=true;
   newUserInfo.error='';
   setUser(newUserInfo);
      })
      
      .catch(error=> {
        const newUserInfo={...user};
      newUserInfo.error=error.message;
      newUserInfo.success=false;
      setUser(newUserInfo);
      });
    }
    e.preventDefault();
  }
  return (
    <div className="App">
     {
      user.signedIn?<button onClick={handleSignOut}>Signed Out</button>:<button onClick={handleClick}>Signed In</button>
     }
     {
     user.signedIn && <p>Welcome , {user.name}
     ,{user.email}
     
     </p>
     }

<br/>
<br/>
<input type="checkbox" onChange={()=>setnewUser(!newUser)} name="newUser" id="" />
<label htmlFor="newUser">User Registration</label>
    <form action="">
    {newUser && <input type="text" onBlur={handleBlur} name="email" id="" placeholder='Enter Your Email' required/>}
     <br/><br/>
     <input type="password" onBlur={handleBlur} name="password" id="" placeholder='Enter Your Password' required /><br/>
     <input type="submit" onClick={handleSubmit} value="submit" />
     
     
    </form>
    <p className='yy'>{user.error}</p>
    {
      user.success && <p className='bb'>User created Succesfully{user.error}</p>
    }
    </div>
   
  );
  
}

export default App;
