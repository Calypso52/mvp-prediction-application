import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './index.css'

export default class Header extends Component {
    render() {
        return (
            <div className="headerWrapper">
                <div className="headerLogo"></div>
                <NavLink className="headerLogin" to="/login">Login / Signup</NavLink>
            </div>
        )
    }
}
