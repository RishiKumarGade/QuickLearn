"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function page() {
    const [invitations, setInvitations] = useState();
    const [friendRequests, setFriendRequests] = useState();
    const [friends, setFriends] = useState([]);
    const [frId, setFrId] = useState("");
    const getFriendRequests = async () => {
        axios.get('/api/users/getfriendrequests').then(res => {
            setFriendRequests(res.data.friends);
            console.log(res.data.friends)

        })
    }

    const getFriends = async () => {
        axios.get('/api/users/getfriends').then((res) => {
            setFriends(res.data.friends);
        })
    }

    const sendFriendRequest = async () => {
        if (frId != "")
            axios.post('/api/users/sendinvite', { type: 'FRIEND', receiverId: frId })
    }


    const getInvitations = async () => {
        axios.get('/api/users/getinvitations').then(res => {
            setFriendRequests(res.data.invitations);
        })
    }

    useEffect(() => {
        getFriends();
        getFriendRequests();
        getInvitations();
    }, [])

    const acceptInvitation = async (type, invitationId) => {
        await axios.post('/api/users/acceptinvite', { invitationId, type }).then((res) => {
            console.log(res)
        })

    }
    const rejectInvitation = async (invitationId, type) => {
        await axios.post('/api/users/rejectinvite', { invitationId, type }).then((res) => {
            console.log(res)
        })
    }


    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <Card className="w-full max-w-2xl shadow-md bg-white rounded-xl p-6">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Workspace Invitations</CardTitle>
                </CardHeader>
                <CardContent>
                    {invitations && invitations.length > 0 ? (
                        invitations.map((invitation) => (
                            <div key={invitation._id} className="flex justify-between items-center border-b py-2">
                                <p>
                                    <span className="font-medium">{invitation.sender.username}</span> invited you to
                                    <span className="font-semibold"> {invitation.workspace._title}</span>
                                </p>
                                <div className="space-x-2">
                                    <Button onClick={() => acceptInvitation("WORKSPACE", invitation._id)}>Accept</Button>
                                    <Button variant="destructive" onClick={() => rejectInvitation(invitation._id, "WORKSPACE")}>
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No workspace invitations</p>
                    )}
                </CardContent>
            </Card>

            <Card className="w-full max-w-2xl shadow-md bg-white rounded-xl p-6 mt-6">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Friend Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {friendRequests && friendRequests.length > 0 ? (
                        friendRequests.map((friendrequest) => (
                            <div key={friendrequest._id} className="flex justify-between items-center border-b py-2">
                                <p className="font-medium">{friendrequest.sender.username}</p>
                                <div className="space-x-2">
                                    <Button onClick={() => acceptInvitation("FRIEND", friendrequest._id)}>Accept</Button>
                                    <Button variant="destructive" onClick={() => rejectInvitation(friendrequest._id, "FRIEND")}>
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No friend requests</p>
                    )}
                </CardContent>
            </Card>

            <Card className="w-full max-w-2xl shadow-md bg-white rounded-xl p-6 mt-6">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Send a Friend Request</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-2">
                        <Input
                            type="text"
                            placeholder="Enter friend ID"
                            value={frId}
                            onChange={(e) => setFrId(e.target.value)}
                            className="flex-grow"
                        />
                        <Button onClick={sendFriendRequest}>Send</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default page