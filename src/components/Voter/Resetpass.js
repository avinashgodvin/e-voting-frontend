import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {url} from '../Url';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import Voternav from '../Navbar/Voternav';

export default class Resetpass extends Component {

    state ={
        voterid:"",
        otp:"",
        pass:"",
        conpass:"",
        showAlert:false,
        loading:false,
        alertMsg:"",
        color:""

   }

componentDidMount = () =>{
    if(!this.props.location.state)
    {
        this.props.history.push("/");
        window.location.reload();
        return;
    }
     
    this.setState({
        voterid:this.props.location.state.voterid,
        showAlert:true,
        alertMsg:"Enter the OTP sent to ******"+this.props.location.state.mobileno.slice(6,10),
        color:"success"


    })
    
}

   changeinp = (e) =>{
       this.setState({
           [e.target.name] : e.target.value
       })
   }

   changepass = (e) =>{
       e.preventDefault();

       if(!(this.state.pass.length>=5 && this.state.pass.length <=12))
      {
       alert("Password Must be of Minimum 5 characters and\nMaximum 12 characters");
       return;
       }

       if(this.state.pass != this.state.conpass)
       {
           alert("password not matching");
           return;
       }

       this.setState({
        loading:true
    })

       fetch(`${url}/reset-pass`,{
           method:"POST",
           headers: { 'Content-Type': 'application/json' },
           body:JSON.stringify({
               voterid:this.state.voterid,
               pass:this.state.pass,
               con_pass:this.state.conpass,
               otp:this.state.otp
           })
           
       })
       .then(res=>res.json())
       .then(data=>{
           this.setState({
               loading:false
           })
           if(!data.error)
           {
               alert("Reset Succesfull");
               this.props.history.push("/");
               window.location.reload();
           }
           
           if(data.expired)
           {
               alert("Session Expired");
               this.props.history.push("/resetotp");
               return;
           }
           this.setState({
               color:"danger",
               alertMsg:data.error
           })
       })
       .catch(err=>{
           
        this.setState({
            loading:false
        })
       })
       

   }
    
    render() {
       
        return (
            <div>
                <Voternav/>
                <div className="container">
                    <div className="row justify-content-center">

                        <div className="col-md-6" style={{marginTop:'15%'}}>
                    <Alert color={this.state.color} className="  justify-content-center"
                    
                     isOpen={this.state.showAlert} toggle={()=>this.setState({showAlert:false})}
                     >
                         {this.state.alertMsg}
                    </Alert>
                    <Form onSubmit={this.changepass} >
                        <FormGroup>
                            <Label for="exampleEmail">OTP</Label>
                            <Input type="text" name="otp" value={this.state.otp} onChange={this.changeinp} />
                        </FormGroup>

                        <FormGroup>
                            <Label for="exampleEmail">Password</Label>
                            <Input type="password" name="pass" value={this.state.pass} onChange={this.changeinp}   />
                    </FormGroup>
                    <FormGroup>
                            <Label for="exampleEmail">Confirm Password</Label>
                            <Input type="password" name="conpass" value={this.state.conpass} onChange={this.changeinp}   />
                    </FormGroup>

                <Button className="btn-success col-12" disabled={this.state.loading?true:false} >{this.state.loading?"Loading...":"Submit"}</Button>
               
               
                </Form>
                <a href="/"  >Login</a>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}
