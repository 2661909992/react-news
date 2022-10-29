import React from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
const { Header } = Layout;

function NavAddressBar(props) {
    const checkCollapsed= () => {
        props.checkCollapsed();
    }
    const {username, role:{roleName}} = JSON.parse(localStorage.getItem("token"));
    const logOut = (data) => {
        if (data.key === '2'){
            props.history.replace("/login");
            localStorage.removeItem("token");
        }
    }

    const items=[
                {
                    key: '1',
                    label: (
                        <span>
                            {roleName}
                        </span>
                    ),
                },
                {
                    type: 'divider',
                },
                {
                    key: '2',
                    danger: true,
                    label: (
                        <span>
                            退出
                        </span>
                    ),
                },
            ]
    return (
        <Header
            className="site-layout-background"
            style={{
                padding: "0 16px",
            }}
        >
            {
                props.isCollapsed ?
                    <MenuUnfoldOutlined onClick={checkCollapsed}/> :
                    <MenuFoldOutlined onClick={checkCollapsed}/>
            }
            <div style={{float: "right",marginRight: "24px"}}>
                欢迎：{username}&nbsp;&nbsp;&nbsp;
                <Dropdown
                    overlay={<Menu onClick={logOut} items={items}/>}
                    placement="bottomRight"
                    arrow={{
                        pointAtCenter: true,
                    }}
                >
                    <Avatar style={{ backgroundColor: '#37a4fd',cursor: "pointer" }} icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    );
}

const mapStateToProps = ({CollapsedReducer:{isCollapsed}}) => {
  return { isCollapsed }
}
const mapDispatchToProps = {
    checkCollapsed() {
        return {
            type: "change_collapsed"
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(NavAddressBar));