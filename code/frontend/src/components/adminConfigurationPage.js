import React from "react";
import API from "../api/API";
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from "react-bootstrap/Table";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

const trash = <svg className="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>

const edit=<svg className="bi bi-pencil" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M11.293 1.293a1 1 0 011.414 0l2 2a1 1 0 010 1.414l-9 9a1 1 0 01-.39.242l-3 1a1 1 0 01-1.266-1.265l1-3a1 1 0 01.242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z" clipRule="evenodd"/>
                    <path fillRule="evenodd" d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 00.5.5H4v.5a.5.5 0 00.5.5H5v.5a.5.5 0 00.5.5H6v-1.5a.5.5 0 00-.5-.5H5v-.5a.5.5 0 00-.5-.5H3z" clipRule="evenodd"/>
                </svg>

class AdminConfigurationPage extends React.Component {
    constructor(props){
        super(props);
        this.state={mode : "", show : false};
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
    modifyService=(service)=>{
        this.setState({show : true, modifyService : service, modeShow : "editService"});
    }
    addService = ()=>{
        this.setState({show : true, modeShow : "addService"});
    }
    removeService=(service)=>{
        this.props.removeService(service.serviceId);
    }
    handleClose = ()=>{
        this.setState({show : false, modifyService : null});
    }
    editSubmit = (name,time)=>{
        this.props.editService(this.state.modifyService.serviceId,name,time);
        this.handleClose();
    }
    addSubmit = (name,time) =>{
        this.props.addService(name,time);
        this.handleClose();
    }
    removeAssociation = (counterId, serviceId) =>{
        this.props.removeAssociation(counterId,serviceId);
    }
    addAssociationSubmit = (counterId, serviceId) => {
        this.props.addAssociation(counterId,serviceId);
        this.handleClose();
    }
    addAssociation = () => {
        this.setState({show : true , services : this.props.services , counters : this.props.counters, modeShow : "addAssociation"})
    }
    render(){
        return( 
            <>
            {this.state.show && this.state.modeShow=="editService" &&
            <EditModal service={this.state.modifyService} handleClose={this.handleClose} handleSubmit={this.editSubmit} mode ={this.state.modeShow}/>
            }
            {this.state.show && this.state.modeShow=="addService" &&
            <EditModal handleClose={this.handleClose} handleSubmit={this.addSubmit} mode ={this.state.modeShow}/>
            }
            {this.state.show && this.state.modeShow=="addAssociation" &&
            <EditModal handleClose={this.handleClose} handleSubmit={this.addAssociationSubmit} services={this.state.services} counters = {this.state.counters} mode ={this.state.modeShow}/>
            }
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
                        <Content services={this.props.services} edit={this.modifyService} remove={this.removeService} add={this.addService}></Content>
                        }
                        {this.state.mode =="counters" &&
                        <Content counters={this.props.counters} remove={this.props.removeCounter}></Content>
                        }
                        {this.state.mode =="servicesCounters" &&
                        <Content servicesCounters={this.props.servicesCounters} remove={this.removeAssociation} add={this.addAssociation}></Content>
                        }
                    </Col>
                </Row>
        </Container>
            </>
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
            <>
            <Table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {props.services.map((service) => <ContentItem key={service.serviceId} service={service} edit={props.edit} remove={props.remove}/>)}
                </tbody>
            </Table>
            <Button onClick={()=>props.add()}>Add a new service!</Button>
            </>
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
                    {props.counters.map((counter) => <ContentItem key={counter.counterId} counter={counter} remove={props.remove}/>)}
                </tbody>
            </Table>
            );
    if(props.servicesCounters)
        return(
            <>
            <Table>
                <thead>
                    <tr>
                        <th>CounterId</th>
                        <th>ServiceId</th>
                    </tr>
                </thead>
                <tbody>
                    {props.servicesCounters.map((service) => <ContentItem key={service.serviceId} serviceCounter={service} remove={props.remove}/>)}
                </tbody>
            </Table>
            <Button onClick={()=>props.add()}>Add a new association!</Button>
            </>
        );
 }
 function ContentItem(props){
     if(props.service)
     return(
        <tr>
            <td>{props.service.serviceId}</td>
            <td>{props.service.serviceName}</td>
            <td>{props.service.serviceTime}</td>
            <td><Button onClick={()=>props.remove(props.service)}>{trash}</Button></td>
            <td><Button onClick={()=>props.edit(props.service)}>{edit}</Button></td>
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
            <td>{props.serviceCounter.serviceId}</td>
            <td><Button onClick={()=>props.remove(props.serviceCounter.counterId,props.serviceCounter.serviceId)}>{trash}</Button></td>
        </tr>     
     );
 }
 class EditModal extends React.Component{
     constructor(props){
         super(props);
         if(props.mode=="editService")
            this.state={serviceName : props.service.serviceName, serviceTime : props.service.serviceTime}
            else if(props.mode=="addAssociation")
                this.state = {counterId : "", serviceId : ""}
                    else this.state={serviceName : "", serviceTime: ""};
     }
     updateField = (name, value) => {
        this.setState({[name]: value});
    }
    onSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.checkValidity()) {
        form.reportValidity();
        } else {
            if(this.props.mode=="editService" || this.props.mode=="addService")
            this.props.handleSubmit(this.state.serviceName,this.state.serviceTime);
            else {
                console.log(this.state.counterId);
                console.log(this.state.serviceId);
                this.props.handleSubmit(this.state.counterId,this.state.serviceId);
            }
        }
    }
     render(){
         return (
             <Modal show={true} onHide={this.props.handleClose} >
                 <Modal.Header closeButton>
                     {this.props.mode=="editService" && <Modal.Title>Edit Service</Modal.Title>}
                     {this.props.mode=="addAssociation" && <Modal.Title>Add Association</Modal.Title>}
                     {this.props.mode=="addService" && <Modal.Title>Add Service</Modal.Title>}
                 </Modal.Header>

                 <Modal.Body>
                     <Form onSubmit={(event)=>this.onSubmit(event)}>
                         {(this.props.mode=="editService" || this.props.mode=="addService") &&
                         <>
                         <Form.Group>
                             <Form.Label>Service Name :</Form.Label>
                             <Form.Control type="text" name="serviceName" value={this.state.serviceName} required={true} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} />
                         </Form.Group>
                         <Form.Group>
                             <Form.Label>Estimated Time :</Form.Label>
                             <Form.Control type="text" name="serviceTime" value={this.state.serviceTime} required={true} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} />
                         </Form.Group>
                         </>
                        }
                        {this.props.mode=="addAssociation" &&
                        <>
                            <Form.Group>
                            <Form.Label>Counter Id :</Form.Label>
                            <Form.Control as="select" name="counterId"  required={true} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} >
                            <option>choose an option..</option>
                            {
                            this.props.counters.map((counter) =>(<option value={counter.counterId}>{counter.counterId}</option>))
                            }
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Service Id :</Form.Label>
                            <Form.Control as="select" name="serviceId"  required={true} onChange={(ev) => this.updateField(ev.target.name, ev.target.value)} >
                            <option>choose an option..</option>
                            {
                            this.props.services.map((service) =>(<option value={service.serviceId}>{service.serviceId}</option>))
                            }
                            </Form.Control>
                        </Form.Group>
                        </>
                        }
                        <Button variant="secondary" onClick={() => this.props.handleClose()}>Close</Button>
                        <Button variant="primary" type="submit">Save changes</Button>
                     </Form>
                 </Modal.Body>


             </Modal>
         );
     }
 }

 export default AdminConfigurationPage;