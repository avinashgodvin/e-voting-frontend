import React, { Component } from 'react'
import getWeb3 from "../../getWeb3";
import Web3 from "web3";
import Election from '../../build/Election.json';
import {Init} from "../../blockchain_initialization/init";
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap';


export default class ChangeStatus extends Component {
     

    state = { 
        storageValue: 0,
        web3: null, 
        accounts: null, 
        contract: null ,
    }


    componentDidMount = async  () =>{

      const {accounts,contract} = await Init();

        this.setState({
            accounts:accounts,
            contract:contract
        });

      let loggedinstatus = await contract.methods.loggedinstatus().call();
      if(!loggedinstatus)
      {
      this.props.history.push("/adminlogin");
      window.location.reload();
	  return;
      }

    }


    check = async () =>{

      const {contract,accounts} = this.state;
      let status = await contract.methods.electionStatus().call();
      
      return status;


    }

    start = async () =>{

      if(await this.check() == true)
      {
        alert("Election Already Started");
        return;
      }
      try{
        
        const {contract,accounts} = this.state;
        await contract.methods.start().send({ from: accounts[0] });

      }
      catch(e)
      {
          alert("Plaease try again")
      }

    }

    end = async () =>{

      if(await this.check() == false)
      {
        alert("Election Not yet Started");
        return;
      }
        try{
            const {contract,accounts} = this.state;
            await contract.methods.end().send({ from: accounts[0] });
            window.location.href='/result'
        }
        catch(e)
        {
            alert("Plaease try again")
        }
    }

    render() {
        return (

            <div>

              <div className="container">

              <Row className="justify-content-center align-items-center" style={{marginTop:'15%'}}>
                  <Col sm="4" >
                    <Card body className="shadow">
                      <CardTitle tag="h4">Start Election</CardTitle>
                      <CardText>Press to start the election</CardText>
                      <Button onClick={this.start} className="btn-success">Start</Button>
                    </Card>
                  </Col>
                  <Col sm="4">
                    <Card body className="shadow">
                      <CardTitle tag="h4">Stop Election</CardTitle>
                      <CardText>Press to stop the election</CardText>
                      <Button onClick={this.end} className="btn-danger">Stop</Button>
                    </Card>
                  </Col>
                </Row>

              </div>

                
                {/* <button onClick={this.start}>Start</button>
                <button onClick={this.end}>End</button><br />
                <button onClick={this.check} >Check</button> */}
            </div>
        )
    }
}
