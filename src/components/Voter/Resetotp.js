import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import {url} from '../Url';
import Voternav from '../Navbar/Voternav';

export default class Resetotp extends Component {

     state ={
          voterid:"",
         showAlert:false,
         loading:false,
         btnDisable:true,
         alertMsg:"",
         color:""

     }

    changeinp = (e) =>{
        
        this.setState({
            [e.target.name] : e.target.value
        })
        
    }

    sendotp = (e) =>{
        e.preventDefault();
        this.setState({
            loading:true
        })
        fetch(`${url}/reset-otp`,{
            method:'POST',
           
               headers: { 'Content-Type': 'application/json' },
            
            body:JSON.stringify({
               voterid:this.state.voterid,
               
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
                    pathname: '/resetpass',
                  
                    state:{voterid:data.voterid,mobileno:data.mobileno,verified:true}
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
        })
    }

    render() {
		
        return (
            <div>
                <Voternav/>
                 <div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6" style={{marginTop:'15%'}}>
                        <Alert color={this.state.color} className=" justify-content-center" isOpen={this.state.showAlert} toggle={()=>this.setState({showAlert:false})}>
                            {this.state.alertMsg}
                        </Alert>
                    <Form onSubmit={this.sendotp}>
                        <FormGroup>
                            <Label for="exampleEmail">Voter Id</Label>
                            <Input type="text" name="voterid" value={this.state.voterid} onChange={this.changeinp} />
                        </FormGroup>

                        
                <Button className="btn-success col-12" disabled={this.state.loading?true:false} >{this.state.loading?"Loading...":"Submit"}</Button>
				<a href="/"  >Login</a>
                </Form>
                    </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}
