import React, { Component } from 'react'
import { Navbar} from 'reactstrap';

export default class Voternav extends Component {
    render() {
        return (
            <div>
                <Navbar className="bg-secondary h-100 text-white justify-content-center"  light expand="md">
                    <h2 className="text-center">E-VOTING</h2>
                </Navbar>
            </div>
        )
    }
}
