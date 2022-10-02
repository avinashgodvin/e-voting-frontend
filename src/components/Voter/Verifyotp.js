import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input ,Alert} from 'reactstrap';
import {url} from '../Url';
import Voternav from "../Navbar/Voternav";

export default class Verifyotp extends Component {


    state={
        otp:"",
        voterid:"",
        showAlert:false,
        loading:false,
        btnDisable:true,
        alertMsg:"",
        color:""
        // this.props.location.state.id
    }


    componentDidMount = () =>{
        
        
        if(!this.props.location.state)
        {
        
            this.props.history.push('/'); 
            return;
        }
        this.setState({
           voterid:this.props.location.state.voterid,
           alertMsg:"Enter the OTP sent to  ******"+this.props.location.state.mobileno.slice(6,10),
           showAlert:true,
           color:"success"
         })
    }


   
    changeinp = (e) =>{
        this.setState({
            [e.target.name] : e.target.value
        })
       
    }

    verifyotp = (e) =>{
      e.preventDefault();
      this.setState({
          loading:true
      })
     
     fetch(`${url}/verify-otp`,{
         method:'POST',
        
            headers: { 'Content-Type': 'application/json' },
         
         body:JSON.stringify({
            otp:this.state.otp,
            voterid:this.state.voterid
         })
     })
     .then(res=>res.json())
     .then(data=>{
         if(!data.error)
         {
             alert("Verified Successfully");
             this.props.history.push({pathname:'/verifyface',state:{verified:true,"token":data.token}});
             return;
         }
        this.setState({
            loading:false,
            showAlert:true,
            color:"danger",
            alertMsg:data.error
        })
        if(data.expired)
        {
            alert("Session Expired");
            this.props.history.push('/'); 
            window.location.reload();
            return;
        }
     })
     .catch(err=>{
        this.setState({
            loading:false
        })
     })

   
    }


    render(){
        return (

                <div>
                    <Voternav/>
            
                <div className="container">

                    <div className="row justify-content-center">
                    <div className="col-xl-5 col-md-6 mt-5  p-5" >
                    <Alert color={this.state.color} isOpen={this.state.showAlert} 
                    toggle={()=>this.setState({showAlert:false})} 
                    className="   justify-content-center" >
                      {this.state.alertMsg}
                    </Alert>
                    <Form onSubmit={this.verifyotp}>
                        <FormGroup>
                            <Label for="exampleEmail">OTP</Label>
                            <Input type="text" name="otp"  value={this.state.otp} onChange={this.changeinp} />
                        </FormGroup>
                        <Button className="btn-success col-12" disabled={this.state.loading?true:false} >{this.state.loading?"Loading...":"Submit"}</Button>
                </Form>
                </div>
                 </div>
                </div>
                
                </div>
             
        )
    }



}