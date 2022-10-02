import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom';
import {url} from '../Url';
import jwt_decode from "jwt-decode";
import getWeb3 from "../../getWeb3";
import Web3 from "web3";
import Election from '../../build/Election.json';
import {Init} from "../../blockchain_initialization/init";
import Voternav from "../Navbar/Voternav";

export default class VerifyId extends Component {

   
    
    state={
        
        voterid:"",
        pass:"",
        showAlert:false,
        loading:false,
        btnDisable:true,
        alertMsg:"",
        color:"",
        storageValue: 0,
        web3: null, 
        accounts: null, 
        contract: null ,
    }


    componentDidMount = async () =>{

        const {accounts,contract} = await Init();
        this.setState({
            accounts:accounts,
            contract:contract
        })
        
    }

    

    
  changeinp = (e) =>{
        this.setState({
            [e.target.name] : e.target.value
        })
       
    }

    verifyid = async  (e) =>{
      e.preventDefault();
      
      
      const {contract} = this.state;

      let voterIDBytes32 = Web3.utils.asciiToHex(this.state.voterid);
      let isvoted = await contract.methods.isvoted(voterIDBytes32).call();
      
      if(isvoted)
      {
          alert("Already Voted");
          return;
      }

      let status  = await contract.methods.electionStatus().call();
      if(!status)
      {
          alert("Election Not yet started");
          return;
      }
      

      

      this.setState({
          loading:true
      });

     fetch(`${url}/verify-voterid`,{
         method:'POST',
        
            headers: { 'Content-Type': 'application/json' },
         
         body:JSON.stringify({
            voterid:this.state.voterid,
            pass:this.state.pass
         })
     })
     .then(res=>res.json())
     .then(data=>{

        this.setState({
            loading:false
        });
         if(!data.error)
         {
        
            this.props.history.push({
                pathname: '/adhar',
              
                state:data.data
             });

             return;
        }

        this.setState({
            showAlert:true,
            alertMsg:data.error,
            color:"danger"
        })


        

     })
     .catch(err=>{
         this.setState({
             loading:false
         });
        console.log(err)
    })
    }

    
    render(){

       
        return (
            <div>
                <Voternav/>

                <div className="container">
               
                

                    <div className=" row  d-flex flex-column justify-content-center align-items-center" style={{marginTop:'15%'}}>
                    
                    <div className="col-xl-5 col-md-6  p-5" 
                    // style={{backgroundColor:'#F6F8FA'}}
                     >

                <Alert color={this.state.color} className="  justify-content-center" isOpen={this.state.showAlert} toggle={()=>this.setState({showAlert:false})}>
                {this.state.alertMsg}
                </Alert>
                
                    <Form onSubmit={this.verifyid}>
                        <FormGroup>
                            <Label for="exampleEmail">Voter Id</Label>
                            <Input type="text" name="voterid"  value={this.state.voterid} onChange={this.changeinp} />
                        </FormGroup>

                        <FormGroup>
                            <Label for="exampleEmail">Password</Label>
                            <Input type="password" name="pass" value={this.state.pass} onChange={this.changeinp}   />
                    </FormGroup>

                <Button type="submit" className="btn-success col-12" disabled={this.state.loading?true:false} >{this.state.loading ? "Verifying...":"Submit"}</Button>
                <Link to="/resetotp"  > Forgot Password?</Link>

               
            </Form>
            
            </div>
                    </div>
                </div>
            
            </div>
        )
    }



}