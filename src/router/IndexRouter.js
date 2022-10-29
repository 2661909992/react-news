import React from 'react';
import { HashRouter,Route,Switch,Redirect } from "react-router-dom";

import News from "../views/news/News";
import Detail from "../views/news/Detail";
import Login from "../views/login/Login";
import NewsSandBox from "../views/sandbox/NewsSandBox";



export default function IndexRouter(props) {
    return (
        <HashRouter>
            <Switch>
                <Route path="/news" component={News}/>
                <Route path="/detail/:id" component={Detail}/>
                <Route path= "/login" component= {Login}/>
                <Route path= "/" render={() =>
                    localStorage.getItem("token") ?
                    <NewsSandBox/>:
                    <Redirect to="/login" />
                }/>
            </Switch>
        </HashRouter>
    );
}