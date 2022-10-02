import React, { Component } from 'react'
import getWeb3 from "../../getWeb3";
import Web3 from "web3";
import Election from '../../build/Election.json';
import {Init} from "../../blockchain_initialization/init";
import ChangeStatus from './ChangeStatus';
import Adminnav from "../Navbar/Adminnav";
export default class Dashboard extends Component {


    componentDidMount = async  () =>{


      const {accounts,contract} = await Init();
        this.setState({
            accounts:accounts,
            contract:contract
        })

        let loggedinstatus = await contract.methods.loggedinstatus().call();
            if(!loggedinstatus)
            {
            this.props.history.push("/adminlogin");
            window.location.reload();
            }
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
        return (
            <div>
                <Adminnav  logout={this.logout}/>
                <ChangeStatus/>
               
            </div>
        )
    }
}
