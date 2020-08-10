import React,{useState, useEffect} from 'react';
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from './firebase';
import { Button } from '@material-ui/core';

function Post(props) {

    const [comment,setComment] =useState('');
    const [comments, setComments]=useState([]);

    useEffect(() => {
        let unsubscribe;
        if(props.postId){
            unsubscribe= db.collection("posts")
            .doc(props.postId)
            .collection("comments")
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map((doc) => doc.data()));
            });
        }

        return () => {
            unsubscribe();
        };
    }, [props.postId]);


    const postComment =(event) => {
            event.preventDefault();

            db.collection("posts").doc(props.postId).collection("comments").add({
                    text: comment,
                    username: props.user.displayName
                }
            )

            setComment('');
    }


    return (
        <div className="post">
            <div className="post_header">
                <Avatar 
                    className="post_avatar" 
                    alt="Prahkfvakh"
                    src="/static/images/avatar/1.jpg"
                />

                <h3>{props.username}</h3>
            </div>
            
            <img className="post_image" src={props.image}/>
            <h3 className="post_text">{props.caption}</h3>


            <div className='post_comments'>
                    {comments.map((comment) => (
                        <p>
                            <strong>{comment.username}</strong> {comment.text}
                        </p>
                    ))}
            </div>

            {props.user && 
                <form className="post_commentbox">
                <input
                    className="post_input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                />

                <Button
                    className="post_button"
                    //disabled={!comment}
                    type="submit"
                    onClick={postComment}
                    >                    
                        Post
                </Button>
            </form>
            }
            
        </div>
    )
}

export default Post
