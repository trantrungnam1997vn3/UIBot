import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  Button,
  Card,
  Container,
  Form,
  Notification,
  Page
} from "tabler-react";
import Stomp from "stompjs";
import uuid from "uuid/v4";

function Chart() {
  const [message, setMessage] = useState("");
  const [client, setClient] = useState(
    Stomp.client("ws://10.0.1.222:15674/ws")
  );
  const [correlated_id, setCorrelatedId] = useState(uuid());
  const [messageUser, setMessageUser] = useState([]);
  const [count, setCount] = useState(0);

  // function intialWebStompConnection() {
  //   var instance = Stomp.client("ws://localhost:15674/ws");
  //   return instance;
  // }

  useEffect(() => {
    client.connect("admin", "admin", on_connect, on_error, "/");
  }, [client, messageUser]);

  function on_connect() {
    client.subscribe(
      "/reply-queue/rpc_queue",
      function(b) {
        setMessageUser(messageUser => {
          messageUser.push([b.body]);
          return messageUser;
        });
        var tag = document.getElementById("message");
        var child = document.createElement("div");
        tag.append(child);
        // ReactDOM.render(
        //   <div className="d-flex">
        //     <Notification
        //       avatarURL="demo/faces/female/1.jpg"
        //       message={
        //         <React.Fragment>
        //           <strong>BOT</strong> {b.body}
        //         </React.Fragment>
        //       }
        //       time="1 hour ago"
        //       unread={false}
        //     />
        //   </div>
        // , child);

        ShowMessage("BOT", b.body, false);
        // var text = document.createTextNode("<div className='d-flex' key={id}><Notification key={id} avatarURL='demo/faces/female/1.jpg' message={ <React.Fragment> <strong>BOT</strong> {item} </React.Fragment> } time='1 hour ago' unread={false} /></div>");
        // var p = document.getElementById("message");
        // p.innerHTML = `<div className='d-flex'><img src ='/public/assets/images/25.jpg'/>${b.body}</div>`;
      },
      {
        "correlation-id": correlated_id,
        "reply-to": "rpc_queue"
      }
    );
  }

  function ShowMessage(user, message, isSend) {
    var tag = document.getElementById("message");
    var child = document.createElement("div");
    tag.append(child);
    ReactDOM.render(
      <div className={`${isSend ? "d-flex flex-row-reverse" : "d-flex "}`}>
        <div className={`col-5 ${isSend ? "d-flex " : "d-flex"}`}>
          <Notification
            message={
              <React.Fragment >
                <p className="text-justify"><strong >{user.toUpperCase()}: </strong> {message} </p>
              </React.Fragment>
            }
            time="1 hour ago"
            unread={false}
          />
        </div>
      </div>,
      child
    );
  }

  function handleSendMessage() {
    console.log("go");
    client.send(
      "/reply-queue/rpc_queue",
      {
        "content-type": "text/plain",
        "correlation-id": correlated_id,
        "reply-to": "rpc_queue"
      },
      message
    );
    ShowMessage("NAM", message, true);
  }

  function on_error() {
    console.log("error");
  }

  return (
    <Page.Content>
      <Container>
        <Card>
          <Card.Header>
            <Card.Title>Chat with BOT</Card.Title>
          </Card.Header>
          <Card.Body>
            <div id="message" />
            {/* {document.removeChild()} */}
            {/* {messageUser.map((item, id) => (
              <div className="d-flex" key={id}>
                <Notification
                  key={id}
                  avatarURL="demo/faces/female/1.jpg"
                  message={
                    <React.Fragment>
                      <strong>BOT</strong> {item}
                    </React.Fragment>
                  }
                  time="1 hour ago"
                  unread={false}
                />
              </div>
            ))} */}
          </Card.Body>
          <Card.Footer>
            <Card.Options>
              <Form.InputGroup
                append={
                  <Button onClick={e => handleSendMessage()} color="primary">
                    SEND
                  </Button>
                }
              >
                <Form.Input
                  onChange={e => {
                    setMessage(e.target.value);
                  }}
                  value={message}
                  placeholder="Input text"
                />
              </Form.InputGroup>
            </Card.Options>
          </Card.Footer>
        </Card>
      </Container>
    </Page.Content>
  );
}

export default Chart;
