import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import './index.css'

export default class index extends Component {
    render() {
        return (
            <div className="signupUI">
                <div className="signup">
                    <h2>User Signup</h2>
                    <div className="signup_box">
                        {/* required就是不能为空 必须在css效果中有很大的作用 */}
                        {/* 可以简写为required */}
                        <input
                            type="text"
                            required 
                        />
                        <label>Your Username</label>
                    </div>
                    <div className="signup_box">
                        <input type="password" required="required" /><label>Your Password</label>
                    </div>
                    <div className="signup_box">
                        <input type="password" required="required" /><label>Confirm Password</label>
                    </div>

                    <NavLink className="bottom_btn" to="/login">Signup</NavLink>
                </div>
            </div>
        )
    }
}
