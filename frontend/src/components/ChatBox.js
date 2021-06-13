import React, { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { Icon, Button, Input, Divider } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { replyMess } from '../actions/qandaAction';
import { textToSpeech } from './../actions/qandaAction';

const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

// Mic
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;
mic.lang = 'vi';


export default function ChatBox(props) {
  //Mic
  const [isListening, setIsListening] = useState(false);
  //

  const { userInfo } = props;
  const [socket, setSocket] = useState(null);
  const uiMessagesRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  
const [flag, setFlag] = useState(true);
  
  

  const dispatch = useDispatch();

  const repMess = useSelector((state) => state.messReply);
  const {mess} = repMess;
  const textResult = useSelector((state)=> state.textToSpeechResult);
  const {text} = textResult;

  const [messages, setMessages] = useState([
    { name: "Trợ lý", body: "Chào "+ userInfo.name},
  ]);


  const soundPlay = (src) => {
    let a = new Audio(src);
    a.play();
  }


  
  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight,
        left: 0,
        // behavior: "smooth",
      });
    }
      if (socket) {
        socket.emit("onLogin", {
          _id: userInfo._id,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
        });
          socket.on("message", (data) => {
              setMessages([...messages, { body: mess, name: data.name }]); //body:data.body 
          });
      }
    
    
    handleListen();
  }, [messages, isOpen, socket, isListening,flag, mess]); //mesages
 
  
  // Mic
  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("continue...");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stoped Mic on Click");
      };
    }
    mic.onstart = () => {
      console.log("mics on");
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      //for mic
      setMessageBody(transcript);

      console.log(transcript);
    };
  };
  //Mic

  const supportHandler = () => {
    setIsOpen(true);
    console.log(ENDPOINT);
    const sk = socketIOClient(ENDPOINT);
    setSocket(sk);
  };
  const submitHandler = (e) => {

    e.preventDefault();
      dispatch(replyMess(userInfo.email, userInfo.name, messageBody))
      .then( mes =>{
        // setMessageBody('');

        if(mes!==undefined){
          dispatch(textToSpeech(mes)).then(speech=>{
          soundPlay(speech);
          });
        }
        
      });
    
    
    

    if (!messageBody.trim()) {
      alert("Error. Please type message.");
    } else {
      setMessages([...messages, { body: messageBody, name: userInfo.name }]);
      setMessageBody('');
      setTimeout(() => {
        socket.emit("onMessage", {
          body: messageBody,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
          _id: userInfo._id,
        });
      }, 1000);
    }
  };
  const closeHandler = () => {
    setIsOpen(false);
  };
  return (
    <div className="chatbox">
      {!isOpen ? (
        <Icon
          className="iconMess"
          name="facebook messenger"
          size="huge"
          onClick={supportHandler}
        ></Icon>
      ) : (
        <div className="card card-body">
          <div className="row">
            <strong className="supportLabel">Support </strong>
            <Icon
              className="iconClose"
              name="close"
              size="big"
              onClick={closeHandler}
            ></Icon>
          </div>
          <Divider></Divider>
          <ul ref={uiMessagesRef}>
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{`${msg.name}: `}</strong> {msg.body}
              </li>
            ))}
          </ul>
          <div>
            <form className="row" onSubmit={submitHandler}>
              <Input
                value={messageBody}
                onChange={(e) => {
                  setMessageBody(e.target.value); //meeageBody = 'a'
                }}
                type="text"
                placeholder="type message"
              />
              <Button
                color="green"
                onClick={() => setIsListening((prevState) => !prevState)}
                type="button"
              >
                <Icon
                  name={
                    isListening === false ? "microphone slash" : "microphone"
                  }
                ></Icon>
              </Button>
              <Button color="red" type="summit" onClick={()=>setIsListening(false)}>
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}