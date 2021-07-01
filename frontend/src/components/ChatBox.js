import React, { useEffect, useRef, useState } from 'react';
// import socketIOClient from 'socket.io-client';
import { Icon, Button, Input, Divider, Popup, Header, Image } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { replyMess } from '../actions/qandaAction';
import { textToSpeech, sayHello } from './../actions/qandaAction';
import processString from 'react-process-string';
import { sk } from './soket';
import ReactScrollableFeed from 'react-scrollable-feed';
import debounce from 'lodash.debounce';
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



  const [checkOnl, setCheckOnl] = useState(false);


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
const [helloSoundCheck, setHelloSoundCheck] = useState(true);

useEffect(() => {
  if(userInfo.name ==="Bạn"){
    dispatch(sayHello("")).then((dataHello) =>{
      if (dataHello) {
        setHello(dataHello[0]);
        setHelloSound(dataHello[1]);
      }
    })
  }
  else{
    dispatch(sayHello(userInfo.name)).then((dataHello) =>{
      if (dataHello) {
        setHello(dataHello[0]);
        setHelloSound(dataHello[1]);
      }
    })
  }
  
}, [])
  
  useEffect(() => {
    
    // if (uiMessagesRef.current) {
    //   uiMessagesRef.current.scrollBy({
    //     top: uiMessagesRef.current.clientHeight,
    //     left: 0,
    //     behavior: "smooth",
    //   });
    // }
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
    return () => {
      if(isListening){
        setIsListening(false);
      }
    };
  }, [isOpen, socket, isListening, mess]); //mesages

 
 



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
      // debounce(()=>{

      // }, 3000);
      
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      setMessageBody(transcript);
      

      console.log(transcript);
    };
  };
  //Mic

  const supportHandler = () => {
    if(helloSoundCheck){
      soundPlay(helloSound);
      setHelloSoundCheck(false);

    }
    
    setIsOpen(true);
    setopenPopup(false);
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
          }, 2000);
    }
  };
  const closeHandler = () => {
    setIsOpen(false);
    if(isListening){
      setIsListening(false);
    }
  };

  
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
          open={openPopup ? true : false}
          position="top left"
        >
          <Header className="headerChatPopup" as="h1">
            Xin chào
            <Icon
              name="times circle outline"
              color="red"
              onClick={() => setopenPopup(false)}
            ></Icon>
          </Header>
          <Divider></Divider>
          <Image src="/image_virtual_staff.jpg" />
          <Divider></Divider>
          <p className="helloText">
            <strong>{hello}</strong>
          </p>
          <Button size="huge" positive fluid onClick={supportHandler}>
            Trò chuyện ngay
          </Button>
        </Popup>
      ) : (
        <div className="card card-body">
          <div className="row">
            <strong className="supportLabel"> Trò chuyện với tôi </strong>
            <Icon
              className="iconClose"
              name="close"
              size="big"
              onClick={closeHandler}
            ></Icon>
          </div>
          <Divider></Divider>
          <ul ref={uiMessagesRef} className="ul-message">
            <ReactScrollableFeed>
              {messages.map((msg, index) => (
                <li key={index} className="li-message">
                  {userInfo.isAdmin || msg.name === "Trợ lý" ? (
                    <div  className={index===0 ? "":"mess-div"}>
                      <div className="align-left message-data"><i className="fa fa-circle not-me"></i>{`${msg.name} `}</div>
                      <div className="message other-message  ">{msg.body}</div>
                    </div>
                  ) : (
                    <div className={messages[index].name===messages[index-1].name ? "mess-mutichat" : ""}>
                      <div className="align-right message-data">{`${msg.name} `}<i className="fa fa-circle me"></i></div>
                      <div className="message my-message float-right">{msg.body}</div>
                    </div>
                  )}
                </li>
              ))}
            </ReactScrollableFeed>
          </ul>
          <Divider></Divider>
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