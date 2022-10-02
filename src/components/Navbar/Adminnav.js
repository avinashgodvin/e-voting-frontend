import React, { Component } from 'react'
// import { Navbar} from 'reactstrap';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
  } from 'reactstrap';

export default class Adminnav extends Component {
    render() {
        return (
            <div>
    <div>
     <Navbar className="bg-secondary h-100 text-white justify-content-center"  light expand="md">
        {/* <NavbarBrand  className="text-white">Election Comission</NavbarBrand> */}
        <h2 className="text-center">E-VOTING</h2>
        <NavbarToggler  />
        <Collapse  navbar className="float-right">
          <Nav className="mr-auto" navbar>
            
        </Nav>
          <NavLink href="/dashboard" style={{color:'#F5F5F5'}}>Dashboard</NavLink>
          <NavLink href="/result" style={{color:'#F5F5F5'}}>Result</NavLink>
          <NavLink href="#" onClick={()=>this.props.logout()} style={{color:'#F5F5F5'}}>Logout</NavLink>
        </Collapse>
      </Navbar>
    </div>
            </div>
        )
    }
}
