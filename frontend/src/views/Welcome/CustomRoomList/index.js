import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomRoomList.css";

const CustomRoomList = (props) => {
  const { publicCustomRooms, onClickRoom } = props;
  const [rooms, setRooms] = useState([]);
  let roomList = [];

  const getUsername = (userId) =>
    new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_API}/users/${userId}`
        );
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });

  // const initialRooms = () =>
  // new Promise((resolve,reject)=>{

  // })

  useEffect(() => {
    let roomsResult = [];
    Object.keys(publicCustomRooms).map(async (key, i) => {
      const room = publicCustomRooms[key];
      if (!room.options.isPublic) {
        setRooms(roomsResult);
        return;
      }
      let username = "";
      try {
        const res = await getUsername(room.leader);
        username = res.data ? res.data.userName : room.leader;
      } catch (err) {
        console.log(err);
      }
      roomsResult.push({
        member: room.players.length,
        roomId: key,
        leader: username || room.leader,
        maxMember: room.options.maxPlayer,
      });
      if (Object.keys(publicCustomRooms).length === i + 1) {
        setRooms(roomsResult);
      }
    });
  }, [publicCustomRooms]);

  const roomListComponent = () =>
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
    });

  return (
    <div className="background">
      <div className="header">Room</div>
      {rooms && <div className="roomList">{roomListComponent()}</div>}
    </div>
  );
};

export default CustomRoomList;
