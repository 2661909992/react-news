import React, { useEffect, useState } from 'react'
import {Redirect, Route, Switch} from "react-router-dom";
import Home from "../../views/sandbox/home/Home";
import UserList from "../../views/sandbox/user-manage/UserList";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import RightList from "../../views/sandbox/right-manage/RightList";
import Nopermission from "../../views/sandbox/nopermission/Nopermission";
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import NewsPreview from "../../components/news-manage/NewsPreview";
import NewsUpdate from "../../components/news-manage/NewsUpdate";
import Audit from "../../views/sandbox/audit-manage/Audit";
import AuditList from "../../views/sandbox/audit-manage/AuditList";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import Published from "../../views/sandbox/publish-manage/Published";
import Sunset from "../../views/sandbox/publish-manage/Sunset";
import {Layout} from 'antd';
import axios from "axios";
const { Content } = Layout;


export default function NavContentBar() {

    const LocalRouterMap = {
        "/home": Home,
        "/user-manage/list": UserList,
        "/right-manage/role/list": RoleList,
        "/right-manage/right/list": RightList,
        "/news-manage/add": NewsAdd,
        "/news-manage/draft": NewsDraft,
        "/news-manage/category": NewsCategory,
        "/news-manage/preview/:id":NewsPreview ,
        "/news-manage/update/:id":NewsUpdate ,
        "/audit-manage/audit": Audit,
        "/audit-manage/list": AuditList,
        "/publish-manage/unpublished": Unpublished,
        "/publish-manage/published": Published,
        "/publish-manage/sunset": Sunset
    }

    const [RouterMapList,setRouterMapList] = useState([])

    const checkRoute = (item) => {
        return (item.pagepermisson || item.routepermisson) && LocalRouterMap[item.key]
    }
    const checkUserRights = (item) => {
        return JSON.parse(localStorage.getItem("token")).role.rights.includes(item.key)
    }

    useEffect(() => {
        // Promise.all([axios.get("/children"), axios.get("/rights")]).then(res => {
        //     setRouterMapList([...res[0].data,...res[1].data])
        // })
        axios.get("/children").then(res => {
            setRouterMapList([
                ...res.data,
                {
                    id: 1,
                    title: "首页",
                    key: "/home",
                    pagepermisson: 1,
                    grade: 1
                }
            ])
        })
    }, [])

    return (
        <Content
            className="site-layout-background"
            style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
            }}
        >
            <Switch>
                {
                    RouterMapList.map(item =>{
                        // if(checkRoute(item)&&checkUserRights(item)) {
                        //     return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact/>
                        // }else{
                        //     return null
                        // }
                        return checkRoute(item)&&checkUserRights(item) ?
                        <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact/> :
                        null
                    })
                }
                <Redirect from="/" to="/home" exact />
                {
                    RouterMapList.length > 0 && <Route path='*' component={Nopermission} />
                }
            </Switch>
        </Content>
    );
}