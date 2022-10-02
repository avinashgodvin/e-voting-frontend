import React, { Component } from 'react';
import getWeb3 from "../../getWeb3";
import Web3 from "web3";
import Election from '../../build/Election.json';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Init} from "../../blockchain_initialization/init";
export default class Adminlogin extends Component {

  state = {
     storageValue: 0, web3: null, accounts: null, contract: null ,
     adminid:'',
     pass:''
    
    };

  componentDidMount = async () => {

    const {accounts,contract} = await Init();
        this.setState({
            accounts:accounts,
            contract:contract
        })
      let loggedinstatus = await contract.methods.loggedinstatus().call();
      if(loggedinstatus)
      {
        this.props.history.push("/dashboard");
        window.location.reload();
      }
    }


  login = async (e) =>{

    e.preventDefault();

    const {contract,accounts} = this.state;

    let adminid = Web3.utils.asciiToHex(this.state.adminid);
    let adminpass = Web3.utils.asciiToHex(this.state.pass);
     
    try
    {     
    await contract.methods.adminlogin(adminid,adminpass).send({ from: accounts[0] });
    this.props.history.push("/dashboard");
    window.location.reload();
    return;
    }
    catch(e)
    {
      alert("Invalid Credential");
    }
   
    

    
  }

  change = (e) =>{
  this.setState({
    [e.target.name] : e.target.value
  })
  }
  
    render() {
        return (
            <div>
               <div className="conatainer">
                 <div className=" row  d-flex flex-column justify-content-center align-items-center" style={{marginTop:'10%'}}>
                   <div className="col-xl-5 col-md-6  p-5">
                   <Form onSubmit={this.login}>
                        <FormGroup>
                            <Label for="exampleEmail">Admin Id</Label>
                            <Input type="text" name="adminid" value={this.state.adminid} onChange={this.change}  />
                        </FormGroup>

                        <FormGroup>
                            <Label for="exampleEmail">Password</Label>
                            <Input type="password" name="pass" value={this.state.pass} onChange = {this.change}    />
                    </FormGroup>

                <Button type="submit" className="btn-success col-12"  >Submit</Button>
               </Form>

                   </div>
                 </div>
               </div>
            </div>
        )
    }
}
