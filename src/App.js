import React, {useState, useEffect} from 'react';
import './App.css';
import Post from "../src/Post";
import {db, auth} from './firebase';
import { Modal, Button, Input } from '@material-ui/core';
import {makeStyles} from "@material-ui/core";
import ImageUpload from "./ImageUpload";


function getModalStyle(){
  const top=50;
  const left=50;

  return{
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles= makeStyles((theme) => ({
  paper:{
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    //boxShadow: theme.shadow[5],
    padding: theme.spacing(2,3,4),
  },
}));

function App(){
  const classes= useStyles();
  const [modalStyle]= useState(getModalStyle);

  const [posts , setPosts] = useState([]);
  const [open , setOpen] = useState(false);
  const [openSignIn,setOpenSignIn]= useState(false);
  const [username, setUsername]= useState('');
  const [password, setPassword]= useState('');
  const [email, setEmail]= useState('');
  const [user,setUser]= useState('');

  //useeffect runs a piece of code on a specific condition
  useEffect(() => {
    const unsubscribe= auth.onAuthStateChanged((authUser) => {
      if(authUser){
        //user ogged in
        console.log(authUser);
        setUser(authUser)        
      }else{
        //user has logged out
        setUser(null);
      }
    })

    return () => {
      //perform some cleanup
      unsubscribe();
    }
  }, [user,username]);


  useEffect(() => {

    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id:doc.id,
        post:doc.data(),
      })));
    })
  }, []);


  
  const signup= (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email,password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error) => alert(error.message))

    setOpen(false);
  }


  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email,password)
    .catch((error) => {
      alert(error.message)
    })

    setOpenSignIn(false);
  }

    return (
      <div className="app">

             

            <Modal
              open={open}
              onClose={() => {setOpen(false)}}
            >

            <div style={modalStyle}
            className={classes.paper}
            >
            
            <form className="app_form">
                <center>
                    <div className="app_header">
                        <img className="app_headerImage"
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                            alt="intsa logo"
                        />
                    </div>
                </center>
            
                <Input 
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                 <Input 
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />


                <Input 
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

              <Button onClick={signup}>SignUp</Button>

            </form>
              
          
            </div>
            </Modal>



            <Modal
              open={openSignIn}
              onClose={() => {setOpenSignIn(false)}}
            >

            <div style={modalStyle}
            className={classes.paper}
            >
            
            <form className="app_form">
                <center>
                    <div className="app_header">
                        <img className="app_headerImage"
                            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                            alt="intsa logo"
                        />
                    </div>
                </center>

                <Input 
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />


                <Input 
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

              <Button onClick={signIn}>Sign In</Button>

            </form>
              
          
            </div>
            </Modal>





            <div className="app_header">
              <img className="app_headerImage"
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                  alt="intsa logo"
              />


            {user ? 
            (     <Button onClick={() => auth.signOut()}>LogOut</Button>
            )
            : (    <div>
                        <Button type="submit" onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        <Button type="submit" onClick={() => setOpen(true)}>Sign Up</Button>
                  </div>
              
              )
            }
            </div>

            
            
            <div className="app_post">
            {
              posts.map(({id,post}) => {
                return  <Post 
                key={id}
                postId={id}
                user={user}
                image={post.image} 
                username={post.username} 
                caption={post.caption}/>
              }
              )} 
            </div>
             
             {/* <div>
               <Instagram />
             </div> */}

               {user?.displayName ? (
                <ImageUpload username={user.displayName}/>
              ) : (
                <h3>Sorry you have to login first</h3>
              )
            }    
      </div>
       
    ) 
}

export default App;