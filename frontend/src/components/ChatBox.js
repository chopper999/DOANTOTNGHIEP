import React, { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { Icon, Button, Input, Divider } from 'semantic-ui-react';

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
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState(null)
  //
  const [isTime, setIsTime] = useState(false);

  const { userInfo } = props;
  const [socket, setSocket] = useState(null);
  const uiMessagesRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState([
    { name: 'Admin', body: 'Hello there, Please ask your question.' },
  ]);

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
    if (socket) {
      socket.emit('onLogin', {
        _id: userInfo._id,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
      });
      socket.on('message', (data) => {
        setMessages([...messages, { body: data.body, name: data.name }]);
      });
    }

    handleListen();
  }, [messages, isOpen, socket, isListening]);

  
  // Mic
  const handleListen = () => {
    

    if(isListening){
      mic.start()
      mic.onend = () => {
        console.log('continue...')
        mic.start()
      }
    }
    else {
      mic.stop()
      mic.onend = () => {
        console.log('Stoped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('')
      //for mic
      setMessageBody(transcript);
      //
      // setTimeout(() => {
      //   console.log('isTime ' + isTime);
      //   if (isTime)
      //   {
      //     setIsListening(false)
      //   }
      //   else{
      //     setIsTime(false);
      //   }
      // }, 5000);
      

      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }

  }
  //Mic


  const supportHandler = () => {
    setIsOpen(true);
    console.log(ENDPOINT);
    const sk = socketIOClient(ENDPOINT);
    setSocket(sk);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert('Error. Please type message.');
    } else {
      setMessages([...messages, { body: messageBody, name: userInfo.name }]);
      setMessageBody('');
      setTimeout(() => {
        socket.emit('onMessage', {
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
                  setMessageBody(e.target.value);
                }}
                type="text"
                placeholder="type message"
              />
              <Button
                color="green"
                onClick={() => setIsListening((prevState) => !prevState)}
                type='button'
              >
                <Icon name= {isListening===false?"microphone slash":"microphone"}></Icon>
              </Button>
              <Button color="red" type="summit">
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}