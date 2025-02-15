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
        <Navbar.Brand style={{ color: "#5E1B89" }}>
          <img src={logo} width="50" height="50" alt="logo" />
          LexMeet
        </Navbar.Brand>
        <Navbar.Text className="ml-auto">
          {dateTime.toLocaleString()}
        </Navbar.Text>
      </Container>
    </Navbar>
  );
}

export default Header;
