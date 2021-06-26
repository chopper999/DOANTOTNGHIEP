import React, { useEffect, useRef, useState } from 'react';
// import socketIOClient from 'socket.io-client';
import { Icon, Button, Input, Divider } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { replyMess } from '../actions/qandaAction';
import { textToSpeech } from './../actions/qandaAction';
import processString from 'react-process-string';
import { sk } from './soket';
// import _ from 'lodash';

// const ENDPOINT =
//   window.location.host.indexOf('localhost') >= 0
//     ? 'http://127.0.0.1:5000'
//     : window.location.host;

// Mic
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;
mic.lang = 'vi';


export default function ChatBox(props) {
  //Mic
  const [isListening, setIsListening] = useState(false);
  const [isTalking, setIsTalking] = useState(true);
  //

  const { userInfo } = props;
  const [socket, setSocket] = useState(null);
  const uiMessagesRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [isAdminOnline, setIsAdminOnline] = useState(false);


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

  let config = [{
    regex: /(http|https):\/\/(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
    fn: (key, result) => <span key={key}>
                             <a target="_blank" href={`${result[1]}://${result[2]}.${result[3]}${result[4]}`}>{result[2]}.{result[3]}{result[4]}</a>{result[5]}
                         </span>
}, {
    regex: /(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim,
    fn: (key, result) => <span key={key}>
                             <a target="_blank" href={`http://${result[1]}.${result[2]}${result[3]}`}>{result[1]}.{result[2]}{result[3]}</a>{result[4]}
                         </span>
}];



  
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
          if (data.isAdmin) {
            console.log("admin Online");
            setIsAdminOnline(true);
            setMessages([...messages, { body: data.body, name: data.name }]); //body:data.body
          } else {
            console.log("admin Offline");
            setIsAdminOnline(false);
            let processed = processString(config)(mess); // Hiển thị link trong chuỗi
            setMessages([...messages, { body: processed, name: data.name }]); //body:data.body
          }
        });
      }
    handleListen();
  }, [messages, isOpen, socket, isListening, mess]); //mesages

// useEffect(() => {
//     if (uiMessagesRef.current) {
//       uiMessagesRef.current.scrollBy({
//         top: uiMessagesRef.current.clientHeight,
//         left: 0,
//         behavior: "smooth",
//       });
//     }
//       if (socket) {
//         socket.emit("onLogin", {
//           _id: userInfo._id,
//           name: userInfo.name,
//           isAdmin: userInfo.isAdmin,
//         });
        
//           socket.on("message", (data) => {
//             if(data.isAdmin){
//               console.log("admin Online");
//               setIsAdminOnline(true);
//               setMessages([...messages, { body: data.body, name: data.name }]);
//             }
//             else{
//               console.log("admin Offline");
//               setIsAdminOnline(false);
//               if(!mess){
//                 dispatch(replyMess(userInfo.email, userInfo.name, messageBody)).then((result) => {
//                   let peoceed = processString(config)(result);
//                   setMessages([...messages, { body: peoceed, name: data.name }]);
//                 })
//               }
//               else{
//                 let peoceed = processString(config)(mess);
//                   setMessages([...messages, { body: peoceed, name: data.name }]);
//               }



//             }
            
//         });
//       }
    
    
//     handleListen();
//   }, [isOpen, isListening, messages]); //mesages, mess, socket
 
 



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
    // console.log(ENDPOINT);
    // const sk = socketIOClient(ENDPOINT);
    setSocket(sk);
  };
  function detectURLs(message) {
    var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.match(urlRegex)
  }

  const submitHandler = (e) => {
      e.preventDefault();
      console.log(messageBody);
      dispatch(replyMess(userInfo.email, userInfo.name, messageBody))
      .then( mes =>{
        console.log("mes "+mes);
        // setMessageBody('');
        
        if(mes!==undefined && isTalking && !isAdminOnline){     //!isAdminOnline
          
          let messs = detectURLs(mes);
          let messStr = String(messs);


          const messRemoveLink = mes.replace(messStr, '');
          try {
            dispatch(textToSpeech(messRemoveLink)).then(speech=>{
              //2s
              soundPlay(speech);
              });
          } catch (e) {
            console.log("error from text to speech API: " + e);
          }
          
        }
        
      });
    
  
    if (!messageBody.trim()) {
      alert("Error. Please type message.");
    } else {
        setMessages([...messages, { body: messageBody, name: userInfo.name }]);
        setMessageBody("");
      
          setTimeout(() => {
            socket.emit("onMessage", {
              body: messageBody,
              name: userInfo.name,
              isAdmin: userInfo.isAdmin,
              _id: userInfo._id,
            });
          }, 2000);
    }
  };
  const closeHandler = () => {
    setIsOpen(false);
  };

  // const debouncedSubmit = useRef(_.debounce(submitHandler,3000)).current
  // useEffect(() => {
  //   _.debounce(() => submitHandler,3000);
  // }, [messageBody]);
  return (
    <div className="chatbox">
      {!isOpen ? (
        <Icon
          className="iconMess"
          name="comments"
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
                <Icon
                  name={
                    isListening === false ? "microphone slash" : "microphone"
                  }
                  color="red"
                  link
                  size = "large"
                onClick={() => setIsListening((prevState) => !prevState)}
                ></Icon>
                <Icon
                  name={
                    isTalking === false ? "volume off" : "volume up"
                  }
                  color="red"
                  link
                  size = "large"
                onClick={() => setIsTalking((prevState) => !prevState)}
                ></Icon>
              <Button color="google plus" circular icon="paper plane" type="summit" onClick={()=>setIsListening(false)}>
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}