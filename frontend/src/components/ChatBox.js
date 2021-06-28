import React, { useEffect, useRef, useState } from 'react';
// import socketIOClient from 'socket.io-client';
import { Icon, Button, Input, Divider, Popup, Header, Image } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { replyMess } from '../actions/qandaAction';
import { textToSpeech, sayHello } from './../actions/qandaAction';
import processString from 'react-process-string';
import { sk } from './soket';

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

  const [openPopup, setopenPopup] = useState(true);

  const dispatch = useDispatch();

  const repMess = useSelector((state) => state.messReply);
  const {mess} = repMess;
  const textResult = useSelector((state)=> state.textToSpeechResult);
  const {text} = textResult;

  const [checkOnl, setCheckOnl] = useState(false);

  const [speechInitial, setSpeechInitial] = useState(true);

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


const [hello, setHello] = useState("");
const [helloSound, setHelloSound] = useState("");

useEffect(() => {
  dispatch(sayHello(userInfo.name)).then((dataHello) =>{
    if (dataHello) {
      setHello(dataHello[0]);
      setHelloSound(dataHello[1]);
    }
    
  })
}, [])
  
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

        socket.on('adminOnl', (data) => {
            setCheckOnl(true);
        })
        socket.on('adminOff', () =>{
          setCheckOnl(false);
        })

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
    soundPlay(helloSound);
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
        console.log(checkOnl);
        
        if(mes!==undefined && isTalking && !isAdminOnline && !checkOnl){     //!isAdminOnline
          //Check if admin online
            socket.on("onLogin",(user) =>{
              console.log(user);
            });
          
          let messs = detectURLs(mes);
          let messStr = String(messs);
          
          

          const messRemoveLink = mes.replace(messStr, '');
          try {
            dispatch(textToSpeech(messRemoveLink)).then(speech=>{
              setTimeout(()=>{
                soundPlay(speech);
              },2000);
              });
          } catch (e) {
            console.log(e);
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
          }, 3000);
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
        <Popup
          trigger={
            <Icon
              className="iconMess"
              name="comments"
              size="huge"
              onClick={supportHandler}
            ></Icon>
          }
          open = {openPopup ? true : false}
          position="top left"
        >
          <Header className='headerChatPopup' as='h1'>Xin chào
          <Icon name='times circle outline' color='red' onClick={()=>setopenPopup(false)}></Icon></Header>
          <Image src='/image_virtual_staff.jpg'/>
        <p>
          <strong><i>{hello}</i></strong>
        </p>
        <Button size="huge" positive fluid onClick={supportHandler}>Trò chuyện ngay</Button>
        
        
        </Popup>
        
        
      ) : (
        <div className="card card-body">
          <div className="row">
          
            <strong className="supportLabel"> </strong>
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
                name={isListening === false ? "microphone slash" : "microphone"}
                color="red"
                link
                size="large"
                onClick={() => setIsListening((prevState) => !prevState)}
              ></Icon>
              <Icon
                name={isTalking === false ? "volume off" : "volume up"}
                color="red"
                link
                size="large"
                onClick={() => setIsTalking((prevState) => !prevState)}
              ></Icon>
              <Button
                color="google plus"
                circular
                icon="paper plane"
                type="summit"
                onClick={() => setIsListening(false)}
              ></Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}