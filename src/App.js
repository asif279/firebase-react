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
 const fbProvider = new firebase.auth.FacebookAuthProvider();
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
   const handleFbsign =()=>{
    firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    const credential = result.credential;
    console.log(credential);

    // The signed-in user info.
    const user = result.user;
    console.log(user);

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const accessToken = credential.accessToken;
    console.log(accessToken);

    // ...
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    const credential = error.credential;
    console.log(error,errorCode,errorMessage,email,credential)
    

    // ...
  });
   }
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
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res=>{
   const newUserInfo={...user}
   newUserInfo.success=true;
   newUserInfo.error='';
   setUser(newUserInfo);
   updateUser(user.name)
      })
      
      .catch(error=> {
        const newUserInfo={...user};
      newUserInfo.error=error.message;
      newUserInfo.success=false;
      setUser(newUserInfo);
      });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res=>{
        
        const newUserInfo={...user}
        newUserInfo.success=true;
        newUserInfo.error='';
        setUser(newUserInfo);
        console.log("sign in user info",res.user);
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
  const updateUser =name=>{
    const user = firebase.auth().currentUser;

  user.updateProfile({
    displayName: name
   
  }).then(() => {
   console.log("User name Updated")
  }).catch((error) => {
    console.log(error,"Error Happened")
    // ...
  });  
  }
  return (
    <div className="App">
     {
      user.signedIn?<button onClick={handleSignOut}>Signed Out</button>:<button onClick={handleClick}>Signed In</button>
     }
     <br/>
     <br/>
     <button onClick={handleFbsign}>FB login</button>
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
    {newUser &&  <input type="text" onBlur={handleBlur} name="name" id="" placeholder='Enter Your Name' required/>}
    <br></br>
    <input type="text" onBlur={handleBlur} name="email" id="" placeholder='Enter Your Email' required/>
     <br/><br/>
     <input type="password" onBlur={handleBlur} name="password" id="" placeholder='Enter Your Password' required /><br/>
     <input type="submit" onClick={handleSubmit} value={newUser?"Sign Up":"Sign In"} />
     
     
    </form>
    <p className='yy'>{user.error}</p>
    {
      user.success && <p className='bb'>User{newUser? 'created':'logged in'}  Succesfully{user.error}</p>
    }
    </div>
   
  );
  
}

export default App;
