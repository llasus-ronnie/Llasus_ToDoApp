import { Navbar, Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import "../styles/App.css";
import logo from "../assets/lexmeet-logo.png";

function Header() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Navbar className="nav" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} width="50" height="50" alt="logo" />
          To Do App
        </Navbar.Brand>
        <Navbar.Text className="ml-auto">
          {dateTime.toLocaleString()}
        </Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default Header;
