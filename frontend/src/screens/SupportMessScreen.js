import React, { useEffect, useRef, useState } from 'react';
// import socketIOClient from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import MessageBox from '../components/MessageBox';
import { Input, Button } from 'semantic-ui-react';
import { sk } from '../components/soket';



let allUsers = [];
let allMessages = [];
let allSelectedUser = {};
// const ENDPOINT =
//   window.location.host.indexOf('localhost') >= 0
//     ? 'http://127.0.0.1:5000'
//     : window.location.host;


export default function SupportMessScreen() {
    const [selectedUser, setSelectedUser] = useState({});
    const [socket, setSocket] = useState(null);
    const uiMessagesRef = useRef(null);
    const [messageBody, setMessageBody] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;






    const dispatch = useDispatch();

    useEffect(() => {

        if (uiMessagesRef.current) {
          uiMessagesRef.current.scrollBy({
            top: uiMessagesRef.current.clientHeight,
            left: 0,
            behavior: 'smooth',
          });
        }
    
        if (!socket) {
          // const sk = socketIOClient(ENDPOINT);
          setSocket(sk);
          sk.emit('onLogin', {
            _id: userInfo._id,
            name: userInfo.name,
            isAdmin: userInfo.isAdmin,
          });

          sk.emit('checkAdminOnline', {adOnline: true});

          sk.on('message', (data) => {
            if (allSelectedUser._id === data._id) {       // Nếu data dành cho user hiện tại thì cập nhật lại messages
              allMessages = [...allMessages, data];
            } else {
              const existUser = allUsers.find((user) => user._id === data._id);   //TÌm kiếm user được gửi data
              if (existUser) {
                allUsers = allUsers.map((user) =>
                  user._id === existUser._id ? { ...user, unread: true } : user   //Make unread = true cho user đó
                );
                setUsers(allUsers);   //Update lại danh dách user
              }
            }
            setMessages(allMessages); //Update lại message
          });
          sk.on('updateUser', (updatedUser) => {
            const existUser = allUsers.find((user) => user._id === updatedUser._id);
            if (existUser) {
              allUsers = allUsers.map((user) =>
                user._id === existUser._id ? updatedUser : user       //Nếu UpdatedUser tồn tại thì cập nhật lại user = updatedUser
              );
              setUsers(allUsers);   //Cập nhật lại danh sách user
            } else {
              allUsers = [...allUsers, updatedUser];  //Nếu không có updatedUser thì thêm updatedUser vào danh sách user
              setUsers(allUsers);
            }
          });
          sk.on('listUsers', (updatedUsers) => {    //Update lại toàn bộ danh sách user
            allUsers = updatedUsers;
            setUsers(allUsers);
          });
          sk.on('selectUser', (user) => {     //Cập nhật message cho user được chọn
            allMessages = user.messages;
            setMessages(allMessages);
          });
        }
      }, [messages, socket, users, dispatch]);
    
      const selectUser = (user) => {    // hàm select User, user nào đc chọn thì unread = false
        allSelectedUser = user;
        setSelectedUser(allSelectedUser);
        const existUser = allUsers.find((x) => x._id === user._id);
        if (existUser) {
          allUsers = allUsers.map((x) =>
            x._id === existUser._id ? { ...x, unread: false } : x
          );
          setUsers(allUsers);
        }
        socket.emit('onUserSelected', user);
      };
    
      const submitHandler = (e) => {
        e.preventDefault();
        if (!messageBody.trim()) {
          alert('Error. Please type message.');
        } else {
          allMessages = [
            ...allMessages,
            { body: messageBody, name: userInfo.name },
          ];
          setMessages(allMessages);
          setMessageBody('');
          setTimeout(() => {
            socket.emit('onMessage', {
              body: messageBody,
              name: userInfo.name,
              isAdmin: userInfo.isAdmin,
              _id: selectedUser._id,
            });
          }, 1000);
        }
      };

    return (
        <div className="row top full-container">
          <div className="col-1 support-users">
            {users.filter((x) => x._id !== userInfo._id && x.name!=="Bạn").length === 0 && (
              <MessageBox>Không có người dùng online</MessageBox>
            )}
            <ul>
              {users
                .filter((x) => x._id !== userInfo._id && x.name!== "Bạn")
                .map((user) => (
                  <li
                    key={user._id}
                    className={user._id === selectedUser._id ? '  selected' : '  '}
                  >
                    <Button
                      className="block"
                      onClick={() => selectUser(user)}
                    >
                      {user.name}
                      <span
                      className={
                        user.unread ? 'unread' : user.online ? 'online' : 'offline'
                      }
                    />
                    </Button>
                    
                  </li>
                ))}
            </ul>
            
          </div>
          
          <div className="col-3 support-messages">
            {!selectedUser._id ? (
              <MessageBox>Chọn khách hàng để trò chuyện</MessageBox>
            ) : (
              <div>
                <div className="row">
                  <strong>Trò chuyện với {selectedUser.name} </strong>
                </div>
                <ul ref={uiMessagesRef}>
                  {messages.length === 0 && <li>Không có tin nhắn.</li>}
                  {messages.map((msg, index) => (
                    <li key={index}>
                      <strong>{`${msg.name}: `}</strong> {msg.body}
                    </li>
                  ))}
                </ul>
                <div>
                  <form onSubmit={submitHandler} className="row">
                    <Input className="inputMessAdmin"
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      type="text"
                      placeholder="Nhập tin nhắn"
                    />
                    <Button color='red' size = 'huge' type="submit">Gửi</Button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      );
}
