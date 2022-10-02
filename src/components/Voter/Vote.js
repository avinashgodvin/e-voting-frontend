import React, { Component } from "react";
import {Navbar, Table } from 'reactstrap';
import jwt_decode from "jwt-decode";
import {url} from '../Url';
import {Init} from "../../blockchain_initialization/init";
import getWeb3 from "../../getWeb3";
import Web3 from "web3";
import Election from '../../build/Election.json';
import Loader from "../../assets/loader/loader";
import Voternav from "../Navbar/Voternav";

export default class Vote extends Component {


  

state = { 
   isloading:false,
   storageValue: 0,
   web3: null, 
   accounts: null, 
   contract: null , 
   candidates:[],
   result:[],
   token1:"",
   token2:""
  };


  fetchCandidates = async  () =>{
	  
	  this.setState({ isloading : true })
      
    fetch(`${url}/getCandidates`,{
      method:"post",
      headers:{
        'content-type':'application/json',
        Authorization: this.props.location.state.token1
      },
      
    })
    .then(res=>res.json())
    .then(data=>{
		this.setState({ isloading : false })
      if(data.expired)
      {
        alert("Session Expired");
        this.props.history.push("/");
        window.location.reload();
      }
      if(!data.error)
      {
        console.log(data)
        this.setState({
          candidates:data.candidates
        })
      }
    })
	.catch(err=>{
		// alert("Please Refresh the page");
		this.setState({ isloading : false })
	})
   }

   castvote = async  (candidate_id) =>{

     const {contract} = this.state;
     const {accounts} = this.state;

       if(!window.confirm("Are you sure ?"))
       return;
      
       let voterid = await  this.getvoterid();
       if(!voterid)
       {
         return;
       }

       let candidateIDBytes32 = Web3.utils.asciiToHex(candidate_id);
       let voterIDBytes32 = Web3.utils.asciiToHex(voterid);// from model jwt token

       try {

       let isvoted =  await contract.methods.isvoted(voterIDBytes32).call();
       if(isvoted)
       {
         alert("Already Voted!");
         return;
       }
       else
       {
           await contract.methods
             .vote(candidateIDBytes32, voterIDBytes32)
             .send({ from: accounts[0] });
             this.sendconfirmation();

             alert("Vote casted Successfully");
             this.props.history.push("/");
             window.location.reload();

       }
          
         } 
         catch (error) {
           alert("Something went wrong Please try again");
           console.log(error);
          }
        }

      sendconfirmation = () =>{
        fetch(`${url}/send-conformation`,{
          method:"POST",
          headers: { 
             'Content-Type': 'application/json',
             "Authorization":this.props.location.state.token2
            }
      })
      .then(res=>res.json())
      .then(data=>console.log(data))
      .catch(err=>console.log(err));
      }

  componentDidMount = async () => {
    
    const {accounts,contract} = await Init();
        this.setState({
            accounts:accounts,
            contract:contract
        })
  };

     
        
       
       getvoterid = async () =>{

        const {token1,token2} = this.props.location.state;
        try{
            const decoded = jwt_decode(token1);
            
            if(!(decoded.exp*1000 > Date.now()))
            {
                

                alert("Session Expired");
                this.props.history.push("/");
                window.location.reload();
                return undefined;
                
            }
            // console.log("Voter id="+decoded.voterid)
            return decoded.voterid;
            
        }
        catch(e)
        {
            alert("Invalid Token");
            this.props.history.push("/");
            window.location.reload();
            return; 
        }
         

       }
        


        
     

     componentWillMount = async () =>{
       
        if(!this.props.location.state)
        {
            this.props.history.push("/");
            window.location.reload();
            return;
        
        }
        this.fetchCandidates();
       
     }

     

        

    render(){

      setTimeout(()=>{
       alert("Time out");
       this.props.history.push("/");
       window.location.reload();
      },900000)
      
      let candidates = this.state.candidates.map((data,i)=>{
        return(
          <tr key={i}>
           <td>{data.candidate_name}</td>
           <td>{data.party}</td>
           <td> <img style={{width:'60px'}} src={data.party_logo}/></td>
           <td><button onClick={()=>this.castvote(data.candidate_id)} className="btn btn-success text-center" style={{width:'40%'}}>Vote</button></td>
          </tr>
        )
      });

    
        return (
          <div>
            <Voternav/>
           {this.state.isloading?<Loader />: <div className="container">
                <div className="row justify-content-center " style={{marginTop:'15%'}}>
                   
                  
               

                <Table striped className="text-center shadow rounded">
                  <thead>
                  <tr>
                    <th>Party Leader</th>
                    <th>Party</th>
                    <th>Party Symbol</th>
                    <th>Vote</th>
                  </tr>
                  </thead>
                  <tbody>
                    
                    {candidates}
                  
                  </tbody>
                </Table>
                   
                </div>
               
               
            </div>
    }
            </div>
        )
    }



}