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
        this.state={serviceId: ""};
    }

    updateField = (name,value) => {
        this.setState({ [name]: value });
    }

    doRequest = (event) => {
        event.preventDefault();
        if (this.form.checkValidity()) {
            this.props.reqTicket(this.state.serviceId);
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
        <h2>Available services:</h2>
        </Row>
        <form onSubmit={this.validateForm} ref={form => this.form = form}>    
        <Row>
        <Col sm={8}>
        <Form.Control name="serviceId" as="select" defaultValue="" onChange={(ev) => this.updateField(ev.target.name,ev.target.value)}>
            <option>choose an option..</option>
            {
                this.props.services.map((service) =>(<ServiceSelectRow key={service.serviceId} service={service}/>))
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
    return <option value={props.service.serviceId}>{props.service.serviceName}</option>;
}

function DisplayTicket(props){
    if(props.ticket)
        return <Jumbotron>
            ticketId: {props.ticket.ticketId}<br/>
            for serviceId: {props.ticket.serviceId}<br/>
            estimated time: {props.ticket.estimatedTime}
        </Jumbotron>;
    else
        return <></>;    
}

export {TicketForm};