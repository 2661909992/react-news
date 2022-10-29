import React from 'react'
import { Layout, Dropdown, Menu,Avatar } from 'antd';
import { withRouter } from 'react-router-dom'
import {connect} from 'react-redux'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined 
} from '@ant-design/icons';

const { Header } = Layout;
 function TopHeader(props) {
    // console.log(props);
    // const [collapsed, setCollapsed] = useState(false)
    const changeCollapsed = () => {
        //改变state的isCollapsed
        // console.log(props);
        props.changeCollapsed()
    }
    const {role:{roleName},username} = JSON.parse(localStorage.getItem("token")) 
    const menu = (
        <Menu>
            <Menu.Item>
                {roleName}
            </Menu.Item>
            <Menu.Item danger onClick={()=>{
                localStorage.removeItem("token")
                // props.history.redirect("/login")
                props.history.replace("/login")
            }}>退出</Menu.Item>
        </Menu>
    );



    return (
        <Header className="site-layout-background" style={{ padding: '0 16px' }}>
            {
                props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /
                > : <MenuFoldOutlined onClick={changeCollapsed} />
            }
            <div style={{ float: "right" }}>
                <span>欢迎 <span style={{color:"#1890ff"}}>{username}</span>回来</span>
                <Dropdown overlay={menu}>
                <Avatar size="large" icon={<UserOutlined />} />
                </Dropdown>
            </div>
        </Header>
    )
}

const mapStateToProps = ({CollapsedReducer:{isCollapsed}})=>{
    // console.log(state);
    return {
        isCollapsed
    }
}

const mapDispatchToProps = {
    changeCollapsed() {
      return {
        type: "change_collapsed",
      };
    },
  };
  

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader))
