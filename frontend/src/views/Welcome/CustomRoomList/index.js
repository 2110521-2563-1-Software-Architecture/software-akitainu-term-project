import React from "react";
import "./CustomRoomList.css";

const CustomRoomList = (props) => {
  const mockData = {
    roomList: [
      {
        member: 1,
        maxMember: 8,
        roomId: "100001",
        leader: "Bump Dolwijit",
      },
      {
        member: 4,
        maxMember: 5,
        roomId: "214303",
        leader: "Akita",
      },
      {
        member: 7,
        maxMember: 8,
        roomId: "244200",
        leader: "Penguin",
      },
      {
        member: 3,
        maxMember: 8,
        roomId: "121121",
        leader: "Cat",
      },
      {
        member: 3,
        maxMember: 8,
        roomId: "121122",
        leader: "Bear",
      },
      {
        member: 3,
        maxMember: 8,
        roomId: "121123",
        leader: "Rabbit",
      },
      {
        member: 3,
        maxMember: 8,
        roomId: "121124",
        leader: "Bird",
      },
    ],
    onClickRoom: (roomId) => console.log(`Clicked room ${roomId}`),
  };
  const { roomList, onClickRoom } = mockData; // todo: change to props
  const roomListComponent = roomList.map((room) => {
    return (
      <div className="room" onClick={() => onClickRoom(room.roomId)}>
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
