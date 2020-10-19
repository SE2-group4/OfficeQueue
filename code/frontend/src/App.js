import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import AdminConfigurationPage from "./components/adminConfigurationPage";
import AppTitle from './AppTitle.js';
import API from './api/API.js';
import {TicketForm} from './components/userComp.js';

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = { services: [], ticket: null,counters : [], servicesCounters : []};
  };

  componentDidMount() {
    this.loadServices();
    this.loadCounters();
    this.loadServicesCounters();
  };

  loadServices(){
    API.getServices() 
    .then((res) => {
      this.setState({services: res})
    })
    .catch(
    (errorObj) => {
      this.handleErrors(errorObj);
    });
  }
  loadCounters(){
    API.getCountersT() //versione di test
    .then((res) => {
      this.setState({counters: res})
    })
    .catch(
    (errorObj) => {
      this.handleErrors(errorObj);
    });
  }
  loadServicesCounters(){
    API.getServicesCountersT() //versione di test
    .then((res) => {
      this.setState({servicesCounters: res})
    })
    .catch(
    (errorObj) => {
      this.handleErrors(errorObj);
    });
  }
  
  reqTicket= (serviceId) => {
    API.getTicket(serviceId) 
    .then((res) => {
      this.setState({ticket: res})
    })
    .catch(
    (errorObj) => {
      this.handleErrors(errorObj);
    });
  }

  handleErrors(errorObj){
    //to_do
  }
  editService = (id,name,time) =>{
    API.editServiceT(id,name,time)
    .then(this.loadServices())
    .catch(
      (errorObj)=>{
        this.handleErrors(errorObj);
      }
    )
  }
  removeService = (id) =>{
    API.removeServiceT(id)
    .then(this.loadServices())
    .catch(
      (errorObj)=>{
        this.handleErrors(errorObj);
      })
  }
  addService = (name,time) =>{
    API.addServiceT(name,time)
    .then(this.loadServices())
    .catch(
      (errorObj)=>{
        this.handleErrors(errorObj);
      })
  }
  removeAssociation = (counterId, serviceId) =>{
    API.removeAssociationT(counterId,serviceId)
    .then(this.loadServicesCounters())
    .catch(
      (errorObj)=>{
        this.handleErrors(errorObj);
      })
  }
  addAssociation = (counterId,serviceId) =>{
    API.addAssociationT(counterId,serviceId)
    .then(this.loadServicesCounters())
    .catch(
      (errorObj)=>{
        this.handleErrors(errorObj);
      })
  }
  render(){
    return <Router>
      <Switch>
      <Route path="/admin" render={()=>{
          return <AdminConfigurationPage services={this.state.services} counters={this.state.counters} servicesCounters={this.state.servicesCounters} 
                    addService={this.addService} removeService={this.removeService} editService={this.editService} removeAssociation={this.removeAssociation} 
                    addAssociation={this.addAssociation}/>}
        }>
        </Route>
        <Route path='/' render={(props) => {
          return <>
          <AppTitle/>
          <TicketForm services={this.state.services} ticket={this.state.ticket} reqTicket={this.reqTicket}/>
          </>;
        }}> 
        </Route>
      </Switch>
    </Router>
  }
}

export default App;
