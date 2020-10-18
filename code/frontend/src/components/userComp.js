import React from 'react';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import '../custom.css';

class TicketForm extends React.Component{
    constructor(props){
        super(props);
        this.state={service: null, serviceID: ""};
    }

    updateField = (name,value) => {
        this.setState({ [name]: value });
    }

    doRequest = (event) => {
        event.preventDefault();
        if (this.form.checkValidity()) {
            this.props.reqTicket(this.state.serviceID);
        } else {
            this.form.reportValidity();
        }
    }

    validateForm = (event) => {
        event.preventDefault();
    }

    render(){
        return <>
        <Container fluid className='upper-margin'>
        <Row>
        <Col sm={8}>  
          
        <Container fluid>
        <Jumbotron>
        <Row>
        <h2>Servizi disponibili:</h2>
        </Row>
        <form onSubmit={this.validateForm} ref={form => this.form = form}>    
        <Row>
        <Col sm={8}>
        <Form.Control name="serviceID" as="select" defaultValue="" onChange={(ev) => this.updateField(ev.target.name,ev.target.value)}>
            <option>choose an option..</option>
            {
                this.props.services.map((service) =>(<ServiceSelectRow key={service.serviceID} service={service}/>))
            }
        </Form.Control>
        </Col>
        <Col sm={4}>
        <Button variant="secondary" size="sm" onClick={this.doRequest}>
            Richiedi ticket</Button>
        </Col>
        </Row>
        </form>
        </Jumbotron>
        </Container>

        </Col>
        <Col>

        <DisplayTicket ticket={this.props.ticket}/>

        </Col>
        </Row>
        </Container>
        </>;
    }
}

function ServiceSelectRow(props){
    return <option value={props.service.serviceID}>{props.service.serviceName}</option>;
}

function DisplayTicket(props){
    if(props.ticket)
        return <Jumbotron>
            ticketID: {props.ticket.ticketID}<br/>
            per il servizio di ID: {props.ticket.serviceID}<br/>
            tempo stimato: {props.ticket.estimatedTime}
        </Jumbotron>;
    else
        return <></>;    
}

export {TicketForm};