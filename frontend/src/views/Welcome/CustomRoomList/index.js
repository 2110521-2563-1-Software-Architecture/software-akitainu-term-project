import React from "react";
import "./CustomRoomList.css";

const CustomRoomList = (props) => {
  const { publicCustomRooms, onClickRoom } = props;
  let roomList = [];
  Object.keys(publicCustomRooms).map(function (key) {
    const room = publicCustomRooms[key];
    roomList.push({
      member: room.players.length,
      roomId: key,
      leader: room.leader,
    });
  });
  console.log(roomList);
  const roomListComponent = roomList.map((room) => {
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
      <div className="roomList">{roomListComponent}</div>
    </div>
  );
};

export default CustomRoomList;
