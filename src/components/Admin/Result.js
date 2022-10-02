import React, { Component } from 'react';
import getWeb3 from "../../getWeb3";
import Web3 from "web3";
import Election from '../../build/Election.json';
import {states} from "./states";
import {url} from "../Url";
import {Table } from 'reactstrap';
import {Init} from "../../blockchain_initialization/init";
import Loader from "../../assets/loader/loader";
import Adminnav from "../Navbar/Adminnav";
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

export default class Result extends Component {
    
  state = { 
      isloading:false,
      storageValue: 0, 
      web3: null, 
      accounts: null, 
      contract: null,
      states:[],
      constituency:[],
      selected_state:"",
      selected_constituency:"",
      candidates:[],
    };

  componentWillMount = async () => {

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
	
	let status = await contract.methods.electionStatus().call();
	if(status)
	{
		alert("You can view the result once Election ends");
		this.props.history.push("/dashboard");
        window.location.reload();
	    return;
	}

  };
 
  componentDidMount = async () =>{
      this.setState({
          states:states
      })
     
  }



changeState = (e) =>{

    
    const state = e.target.value;
    if(state == "no state")
    return;

    this.setState({
		isloading : true
	})
     
    fetch(`${url}/getConstituencies/${state}`)
    .then(res => res.json())
    .then(async (data)=>{
		
		this.setState({
		isloading : false
	})
		   
        console.log(data);
        this.setState({
            constituency:data.constituencies
        })
    })
    .catch(err=>{
        alert("Try Again Something went wrong");
		  this.setState({
		isloading : false
	})
        console.log(err)
    })

}

changeConstituency = (e) =>{

    let cno = e.target.value;

    if(cno == "none")
    return;

     this.setState({
		isloading : true
	})
		   

    fetch(`${url}/getCandidates/${cno}`)
    .then(res=>res.json())
    .then(async (data)=>{
		
		this.setState({
		isloading : false
	})
		   

        // console.log(data)
        
        const {contract} = this.state;
        let result_data = data.candidates.map(async (data,i)=>{
            
            let candidateid = Web3.utils.asciiToHex(data.candidate_id);
            let count = await contract.methods.getVotes(candidateid).call();
            return count


        })

        result_data = await Promise.all(result_data)
        
        
        this.setState({
            candidates:data.candidates,
            result:result_data
        })
    })
    .catch(err=>{
        alert("Something went wrong Please try again...");
		this.setState({
		isloading : false
	})
		   
    });


}


logout = async () =>{

    const {contract,accounts}  = this.state;
    try
    {     
    await contract.methods.adminlogout().send({ from: accounts[0] });
    this.props.history.push("/adminlogin");
    window.location.reload();
   
    }

    catch(e)
    {
       alert("Please try again");
    }
   
}

    render() {
        let states_array = this.state.states.map((data,i)=>{
            return(
                <option key={i} value={data}> {data} </option>
            )
        })

        let constituency_array = this.state.constituency.map((data,i)=>{
            return(
                <option value={data.constituency_no}>{data.constituency_name}</option>
            )
        })

        let candidates = this.state.candidates.map((data,i)=>{
            return(
                <tr key={i}>
                <td>{data.candidate_id}</td>
                <td>{data.candidate_name}</td>
                <td>{data.party}</td>
                <td> <img style={{width:'60px',height:'5vh'}} src={data.party_logo}/></td>
                <td>{this.state.result[i]}</td>
               </tr>
            )
        })
		
		
			
		
		
        return (
            
            <div>
                <Adminnav  logout={this.logout}/>
                <div className="container">
                    <div className="row">
                    <div className="select_state col-md-6">
                 <FormGroup className="mt-4">
                    <Label ><b>State</b></Label>
                    <Input type="select" name="select" onChange={this.changeState}>
                    <option value={"none"}>Select State</option>
                    {states_array}
                    </Input>
                </FormGroup>
             </div>

                <div className="select_constituency col-md-6">
                  
                  <FormGroup className="mt-4">
                    <Label ><b>Constituency</b></Label>
                    <Input type="select" name="select" onChange={this.changeConstituency}>
                    <option value={"none"}>Selet Constituency</option>
                    {constituency_array}
                    </Input>
                </FormGroup>

                </div>
              </div>
			  
			  {this.state.isloading ? <Loader /> : null}
                   
                    {this.state.candidates.length > 0 && !this.state.isloading?
					<div className="row">
                       <Table striped className="text-center shadow rounded mt-5" >

                        <thead>
                        <tr>
                            <th>Candidate Id</th>
                            <th>Party Leader</th>
                            <th>Party</th>
                            <th>Party Symbol</th>
                            <th>Votes</th>
                        </tr>
                        </thead> 
                        <tbody>
                           {candidates}
                           </tbody>
                       </Table>
                    </div>
					:null}

                </div>
                
            </div>
        )
    }
}
