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
        this.state={mode : ""};
    }
    setServicesView=()=>{
        this.setState({mode : "services"});
    }
    setCountersView=()=>{
        this.setState({mode : "counters"});
    }
    setServicesCountersView=()=>{
        this.setState({mode : "servicesCounters"});
    }
    render(){
        console.log(this.props.services);
        return( 
        <Container fluid>
            <Jumbotron>
                <Row>
                    <h2>Admin Configuration Page</h2>
                </Row>
            </Jumbotron>
                <Row>
                    <Col sm="4">
                        <Sidebar setServicesView={this.setServicesView} setCountersView={this.setCountersView} setServicesCountersView={this.setServicesCountersView}></Sidebar>
                    </Col>
                    <Col sm='8'>
                        {this.state.mode=="services" &&
                        <Content services={this.props.services}></Content>
                        }
                        {this.state.mode =="counters" &&
                        <Content counters={this.props.counters}></Content>
                        }
                        {this.state.mode =="servicesCounters" &&
                        <Content servicesCounters={this.props.servicesCounters}></Content>
                        }
                    </Col>
                </Row>

        </Container>

        )}
 }

 function Sidebar(props){
     return (
         <Container fluid>
             <Button onClick={()=>props.setServicesView()}>Services</Button>
             <br></br>
             <br></br>
             <Button onClick={()=>props.setCountersView()}>Counters</Button>
             <br></br>
             <br></br>
             <Button onClick={()=>props.setServicesCountersView()}>Services - Counters</Button>
         </Container>
     )
 }
 function Content(props){
     if (props.services)
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
                    {props.services.map((service) => <ContentItem key={service.serviceID} service={service} />)}
                </tbody>
            </Table>
     );
     if(props.counters)
        return(
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                    </tr>
                </thead>
                <tbody>
                    {props.counters.map((counter) => <ContentItem key={counter.counterId} counter={counter} />)}
                </tbody>
            </Table>
            );
    if(props.servicesCounters)
        return(
            <Table>
                <thead>
                    <tr>
                        <th>CounterId</th>
                        <th>ServiceId</th>
                    </tr>
                </thead>
                <tbody>
                    {props.servicesCounters.map((service) => <ContentItem key={service.serviceID} serviceCounter={service} />)}
                </tbody>
            </Table>
        );
 }
 function ContentItem(props){
     if(props.service)
     return(
        <tr>
            <td>{props.service.serviceID}</td>
            <td>{props.service.serviceName}</td>
            <td>{props.service.serviceTime}</td>
        </tr>        
     )
     if(props.counter)
     return(
        <tr>
            <td>{props.counter.counterId}</td>
        </tr>
     );
     if(props.serviceCounter)
     return(
        <tr>
            <td>{props.serviceCounter.counterId}</td>
            <td>{props.serviceCounter.serviceID}</td>
        </tr>     
     );
 }
 export default AdminConfigurationPage;