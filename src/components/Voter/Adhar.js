import React, { Component } from 'react'
import {url} from '../Url';
import { Table } from 'reactstrap';
import Voternav  from '../Navbar/Voternav';

export default class Adhar extends Component {

    constructor()
    {
        super();
        this.state={
            aadhaar:null,
            voterid:null,
            loading:false
        }
    }

    componentDidMount = () =>{
        if(!this.props.location.state)
        {
        
            this.props.history.push('/'); 
            window.location.reload();
            return;
        }

      

        this.setState({
           aadhaar:this.props.location.state.aadhaardetails,
           voterid:this.props.location.state.voterid
        })

        
    }

    sendOtp = () =>{
        this.setState({loading:true})
        fetch(`${url}/send-otp`,{
            method:'post',
            headers:{
                'content-type':'application/json',
                'authorization':this.props.location.state.token
            },
           
        })
        .then(res=>res.json())
        .then(data=>{
            this.setState({loading:false})
            if(data.expired)
            {
                alert("Session Expired")
                this.props.history.push("/");
                window.location.reload();
                return;
            }

            if(!data.error)
             {
        
            this.props.history.push({
                pathname: '/verifyotp',
              
                state:{voterid:data.voterid,mobileno:data.mobileno,verified:true}
             });

             return;
        }

        }).catch(error=>{this.setState({loading:false})})

    }
    render() {
        console.log(this.state)
        return (
            <div>
                <Voternav />
                {
                    this.state.aadhaar ?  
                   ( 
                  
                       <Table striped className="container border mt-5 shadow p-3 mb-5 rounded ">
                       <tbody>
                           <tr>
                               <th>Aadhaar number</th>
                               <td><b>: </b>{this.state.aadhaar.aadhaarnumber}</td>
                           </tr>

                           <tr>
                               <th>Name</th>
                               <td><b>: </b>{this.state.aadhaar.name}</td>
                           </tr>

                           <tr>
                               <th>DOB</th>
                               <td><b>: </b>{this.state.aadhaar.dob}</td>
                           </tr>

                            <tr>
                                <th>Father</th>
                                <td><b>: </b>{this.state.aadhaar.father}</td>
                            </tr>

                            <tr>
                                <th>Address</th>
                                <td><b>: </b>{this.state.aadhaar.address}</td>
                            </tr>
                            </tbody> 

                       </Table>
                             

                    
                    


                    )
                    
                    
                    
                    
                    
                    
                    
                    : null
                }

                <button onClick={()=>this.sendOtp()} class="btn btn-primary text-center btn-lg" disabled={this.state.loading?true:false}  style={{float:'right',marginRight:'15%',width:'15%'}}>Proceed</button>
               
                
            </div>
        )
    }
}
