import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd';
import './index.css'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import {connect} from 'react-redux'
import {
  UserOutlined,
  // VideoCameraOutlined,
  // UploadOutlined,
} from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';

//模拟数组
// const menuList =[
//   {
//     key:"/home",
//     title:"首页",
//     icon:<UserOutlined/>
//   },
//   {
//     key:"/user-manage",
//     title:"用户管理",
//     icon:<UserOutlined/>,
//     children:[
//       {
//         key:"/user-manage/list",
//         title:"用户列表",
//         icon:<UserOutlined/>
//       }
//     ]
//   },
//   {
//     key:"/right-manage",
//     title:"权限管理",
//     icon:<UserOutlined/>,
//     children:[
//       {
//         key:"/right-manage/role/list",
//         title:"角色列表",
//         icon:<UserOutlined/>
//       },
//       {
//         key:"/right-manage/right/list",
//         title:"权限列表",
//         icon:<UserOutlined/>
//       }
//     ]
//   }
// ] 
const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />
}

const { Sider } = Layout;
// const {SubMenu}= Menu;
function SideMenu(props) {
  const [menu, setMenu] = useState([])
  useEffect(() => {
    axios.get("http://localhost:5000/rights?_embed=children").then(res => {
      setMenu(res.data)
    })
  }, [])

  const {role:{rights}} = JSON.parse(localStorage.getItem("token")) 

  const checkPagePermission = (item) => {
    return item.pagepermisson && rights.includes(item.key)
  }
  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
          {renderMenu(item.children)}
        </SubMenu>
      }
      return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]} onClick={() => {
        props.history.push(item.key)
      }}>{item.title}</Menu.Item>
    })
  }
  const selectKeys = [props.location.pathname]
  const openKeys = ["/"+props.location.pathname.split("/")[1]]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo" >全球新闻发布管理系统</div>
        <div style={{flex:1,"overflow":"auto"}}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
            {renderMenu(menu)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}
const mapStateToProps = ({ CollapsedReducer: { isCollapsed } }) => ({
  isCollapsed,
});
export default connect(mapStateToProps)(withRouter(SideMenu));