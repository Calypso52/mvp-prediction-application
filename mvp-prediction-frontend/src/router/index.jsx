import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Login from '@/pages/Log/Login'
import Signup from '@/pages/Log/Signup'
import MainPage from '@/pages/MainPage'

export default class AppRouter extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup}></Route>
                    <Route path="/mainpage" component={MainPage}></Route>
                    <Redirect from="/" to="/login" />
                </Switch>
            </div>
        )
    }
}
