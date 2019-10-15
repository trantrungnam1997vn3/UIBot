import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Notification,
  Page
} from "tabler-react";
import Stomp from "stompjs";

function Chart() {
  const [message, setMessage] = useState("");
  const [client, setClient] = useState(Stomp.client("ws://localhost:15674/ws"));

  function intialWebStompConnection() {
    var instance = Stomp.client("ws://localhost:15674/ws");
    return instance;
  }

  useEffect(() => {
    client.connect("admin", "admin", on_connect, on_error, "/");
    console.log(client);
  }, [client]);

  function on_connect() {
    client.subscribe("/topic/go", function(b) {
      console.log(b.body);
    });
  }

  function handleSendMessage() {
    console.log("go");
    client.send("/topic/go", { "content-type": "text/plain" }, message);
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
            <div className="d-flex">
              <Notification
                avatarURL="demo/faces/female/1.jpg"
                message={
                  <React.Fragment>
                    <strong>Alice</strong> Hello Nam
                  </React.Fragment>
                }
                time="1 hour ago"
                unread={false}
              />
            </div>
          </Card.Body>
          <Card.Footer>
            <Card.Options>
              <Form.InputGroup append={<Button onClick={e => handleSendMessage()} color="primary">SEND</Button>}>
                <Form.Input
                  onChange={e => setMessage(e.target.value)}
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
