import React, { Component } from 'react';
import {Spinner} from "reactstrap";
import "./loader.css";

export default class Loader extends Component {

    render() {
        return (
            <div className="spinner">
                <Spinner color="primary"  /><br />
                Loading...
            </div>
        )
    }
}
