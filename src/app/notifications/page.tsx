"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function page() {
    const [invitations,setInvitations] = useState();
    const [friendRequests,setFriendRequests] = useState();
    const [friends, setFriends] = useState([]);
    const [frId,setFrId] = useState("");
    const  getFriendRequests = async () =>{
        axios.get('/api/users/getfriendrequests').then(res=>{
            setFriendRequests(res.data.friends);
          console.log(res.data.friends)

        })
    }

    const getFriends = async ()=>{
        axios.get('/api/users/getfriends').then((res)=>{
          setFriends(res.data.friends);
        })
      }
    
    const sendFriendRequest = async()=>{
        if(frId != "")
        axios.post('/api/users/sendinvite',{type:'FRIEND',receiverId:frId})
    }
    

    const getInvitations = async() =>{
        axios.get('/api/users/getinvitations').then(res=>{
            setFriendRequests(res.data.invitations);
        })
    }

    useEffect(()=>{
        getFriends();
        getFriendRequests();
        getInvitations();
    },[])

    const acceptInvitation= async (type,invitationId) =>{
            await axios.post('/api/users/acceptinvitation',{invitationId,type}).then((res)=>{
                console.log(res)
            })
            
    }
    const rejectInvitation= async (invitationId,type) =>{
        await axios.post('/api/users/rejectinvitation',{invitationId,type}).then((res)=>{
            console.log(res)
        })
    }


  return (
    <div>
        ---------------------------------------------- <br />
        {invitations && invitations.map((invitation)=>{
           return <p key={invitation._id}>{invitation.sender.username}  || workspaceId: {invitation.workspace._id}</p>
        })}
    <br />
    ---------------------------------------------- <br />

{friendRequests && friendRequests.map((friendrequest)=>{
    // console.log(friendrequest.sender.username)
            return <p  key={friendrequest._id}>{friendrequest.sender.username}</p>
        })}
------------------------------------------------ <br />

        <input type="text" onChange={(e)=>{setFrId(e.target.value)}}   />
        <button onClick={(e)=>{e.preventDefault();sendFriendRequest()}}  > Send Friend Request </button>
    </div>
  )
}

export default page