import React from "react";
import API from "../api/API";
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from "react-bootstrap/Table"

class AdminConfigurationPage extends React.Component {
    constructor(props){
        super(props);
        this.state={ services : props.services};
    }
    componentDidMount(){
        this.props.loadServices();
    }
    render(){
        return( 
        <Container fluid>
            <Jumbotron>
                <Row>
                    <h2>Admin Configuration Page</h2>
                </Row>
            </Jumbotron>
                <Row>
                    <Col sm="4">
                        <Sidebar></Sidebar>
                    </Col>
                    <Col sm='8'>
                        <Content services={this.state.services}></Content>
                    </Col>
                </Row>

        </Container>

        )}
 }

 function Sidebar(){
     return (
         <Container fluid>
             <Button>Services</Button>
             <br></br>
             <br></br>
             <Button>Counters</Button>
         </Container>
     )
 }
 function Content(props){
     return (
        <Table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
            {props.services.map((service) => <ContentItem key={service.serviceId} service={service} />)}
            </tbody>
        </Table>
     );
 }
 function ContentItem(props){
     console.log("Ciao");
     return(
        <tr>
            <td>{props.service.serviceId}</td>
            <td>{props.service.serviceName}</td>
            <td>{props.service.serviceTime}</td>
        </tr>        
     )
 }
 export default AdminConfigurationPage;