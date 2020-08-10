import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import {db, storage,auth} from "./firebase";
import "./ImageUpload.css";

function ImageUpload(props) {

    const [image,setImage]= useState('');
    const [progress, setProgress]= useState(0);
    const [caption, setCaption]= useState('');
    
    const handleChange= (event) => {
        if(event.target.files[0]){
            setImage(event.target.files[0]);
        }
    };

    const handleUpload = () => {

        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //proress function...
                const progress =Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes) * 100);

                setProgress(progress);
            },

            (error) => {
                //error function...
                console.log(error);
                alert(error.message);
            },

            () => {
                //complete function...
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    //post image inside db
                    db.collection("posts").add({
                        //timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        image: url,
                        username: props.username
                    });

                    console.log(url);
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                })
            }
        )
    }


    return (
        <div className="imageupload">
        <progress className="imageupload_progress" value={progress} max="100" />
            <input type="text" placeholder="enter a caption..." 
            onChange= {(event) => {setCaption(event.target.value)}}
            value={caption} />
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload;
