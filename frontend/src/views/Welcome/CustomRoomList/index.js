import React, {useEffect, useState} from "react";
import axios from 'axios'
import "./CustomRoomList.css";

const CustomRoomList =  (props) => {
  const { publicCustomRooms, onClickRoom } = props;
  const [rooms,setRooms] = useState([])
  let roomList = [];

  const getUsername = (userId) =>
  new Promise( async(resolve,reject)=> {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_API}/users/${userId}`)
      resolve(res)
    } catch(err) {
      reject(err)
    }
  })

  // const initialRooms = () =>
  // new Promise((resolve,reject)=>{

  // })

  useEffect( ()=>{
    console.log("intial")
    let roomsResult = []
    Object.keys(publicCustomRooms).map(async(key,i) => {
      const room = publicCustomRooms[key];
      if (!room.options.isPublic) return;
      let username = "";
      try {
        const res = await getUsername(room.leader)
        // console.log(res.data.userName)
        username = res.data ? res.data.userName: room.leader
      } catch(err) {
        console.log(err)
      }
      console.log(username)
      // roomList.push({
      //   member: room.players.length,
      //   roomId: key,
      //   // leader: room.leader,
      //   leader : username||room.leader,
      //   maxMember: room.options.maxPlayer,
      // });
      // let roomsTmp = roomsResult
      roomsResult.push({
        member: room.players.length,
        roomId: key,
        // leader: room.leader,
        leader : username||room.leader,
        maxMember: room.options.maxPlayer,
      });
      console.log(roomsResult)
      if (Object.keys(publicCustomRooms).length === i+1) {
        setRooms(roomsResult)
      }
    });
    // setRooms(roomsResult)
  },[publicCustomRooms])
  
  useEffect(()=>{
    if (rooms) {
      console.log(rooms)
    }
  },[rooms])

  

  const roomListComponent = () => (
    rooms.map((room) => {
      return (
        <div
          key={room.roomId}
          className="room"
          onClick={() => onClickRoom(room.roomId)}
        >
          <div className="leader">{room.leader}</div>
          <div className="memberText">
            {room.member} / {room.maxMember}
          </div>
        </div>
      );
    })
  
  )

  return (
    <div className="background">
      <div className="header">Room</div>
      {rooms&&
      <div className="roomList">
        {roomListComponent()}
      </div>}
    </div>
  );
};

export default CustomRoomList;
