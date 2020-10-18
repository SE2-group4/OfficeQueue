import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import AdminConfigurationPage from "./components/adminConfigurationPage";
import AppTitle from './AppTitle.js';
import API from './api/API.js';
import {TicketForm} from './components/userComp.js';

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = { services: [], ticket: null};
  };

  componentDidMount() {
    this.loadServices();
  };

  loadServices(){
    API.getServicesT() //versione di test
    .then((res) => {
      this.setState({services: res})
    })
    .catch(
    (errorObj) => {
      //this.handleErrors(errorObj);
    });
  }

  reqTicket= (serviceID) => {
    API.getTicketT(serviceID) //versione di test
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

  render(){
    return <Router>
      <Switch>
      <Route path="/admin" render={()=>{
          return <AdminConfigurationPage services={this.state.services} loadServices={this.loadServices}/>}
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
