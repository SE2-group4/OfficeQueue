import React from 'react' ;
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function AppTitle() {
    return <>
    <Navbar bg="dark" variant="dark">
        <Navbar.Brand>Office Queue</Navbar.Brand>
        <Nav className="mr-auto">
        <Nav.Link href="/">User</Nav.Link>
        <Nav.Link href="/admin">Admin</Nav.Link>
        </Nav>
    </Navbar>
    </>;
}

export default AppTitle;