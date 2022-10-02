import VerifyId from './components/Voter/VerifyId';
import Verifyotp from './components/Voter/Verifyotp';
import Verifyface from './components/Voter/Verifyface';
import Vote from './components/Voter/Vote';
import Resetotp from './components/Voter/Resetotp';
import Resetpass from './components/Voter/Resetpass';
import Adminlogin from './components/Admin/Adminlogin';
import Result from "./components/Admin/Result";
import ChangeStatus from "./components/Admin/ChangeStatus";
import Dashboard from "./components/Admin/Dashboard";

import React, { Component } from "react";
import {BrowserRouter,Switch, Route} from 'react-router-dom';
import Adhar from "./components/Voter/Adhar";

export default class Routering extends Component {


    render(){
        return (
            <div>
                <BrowserRouter>
              <Switch>
                <Route exact path="/" component={VerifyId} />
                <Route exact path="/verifyotp" component={Verifyotp} />
                <Route exact path="/verifyface" component={Verifyface} />
                <Route exact path="/vote" component={Vote} />
                <Route exact path="/resetotp" component={Resetotp} />
                <Route exact path="/resetpass" component={Resetpass} />
                <Route exact path="/adminlogin" component={Adminlogin} />
                <Route path="/result" component={Result} />
                <Route exact path="/adhar" component={Adhar} />
                <Route path="/changestatus" component={ChangeStatus} />
                <Route path="/dashboard" component={Dashboard} />
              </Switch>
              </BrowserRouter>
               
            </div>
        )
    }



}