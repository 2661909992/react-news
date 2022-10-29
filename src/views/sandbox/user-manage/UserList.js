import React, {useEffect, useState, useRef} from 'react';
import { Table, Tag, Button, Tooltip, Modal, Switch } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    PlusOutlined
} from '@ant-design/icons';
import axios from "axios";

import UserForm from "../../../components/user-manage/UserForm";


export default function UserList(props) {

    const [dataList,handleDataList] = useState([]);
    const [roleDataList,setRoelData] = useState([]);
    const [regionDataList,setRegionData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModal, setIsUpdateModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const addForm = useRef(null);
    const updateForm = useRef(null);
    const [updateId, setUpdateId] = useState(null);
    const {id, roleId, region, username} = JSON.parse(localStorage.getItem("token"));

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>,
        },
        {
            title: '角色名称',
            render: (item) =>
                <Tag color={item.roleId === 1 ? "orange" : (item.roleId === 2 ? "purple" : "cyan")} >
                    {item.roleId  === 1 ? "超级管理员" : (item.roleId  === 2 ? "区域管理员" : "区域编辑")}
                </Tag>,
        },
        {
            title: '地区',
            dataIndex: 'region',
            filters: [...regionDataList.map(item => ({
                text: item.title,
                value: item.value
            })),{
                text: "全球",
                value: "全球"
            }],
            onFilter: (value,item) => {
                if (value === "全球") return item.region === ""
                return item.region === value
            },
            render: item => <span>{item === "" ? "全球" : item}</span>
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            render: (item) => <div>
                <Tooltip title={item.default?"":("点击切换为："+(item.roleState ? "封禁" : "正常"))}>
                    <Switch
                        checkedChildren="正常" unCheckedChildren="封禁"
                        onChange={() => changeSwitchState(item)}
                        checked={item.roleState}
                        disabled={item.default}
                    />
                </Tooltip>
            </div>,
        },
        {
            title: '操作',
            render: (item) => <div>
                <Tooltip title="删除">
                    <Button
                        icon={<DeleteOutlined/>} shape="circle" size="large" danger
                        onClick={() => confirm(item)}
                    />
                </Tooltip>&nbsp;&nbsp;
                <Tooltip title="信息修改">
                    <Button
                        icon={<EditOutlined/>} shape="circle" size="large" type="primary"
                        onClick={()=>{updateModal(item)}}
                    />
                </Tooltip>
            </div>,
        },
    ];

    const deleteMethod = (data) => {
        axios.delete(`/users/${data.id}`).then(res => {
            if (res.status === 200){
                handleDataList(dataList.filter(item => item.id !== data.id));
            }else{
                console.log(res)
            }
        })
    }

    const changeSwitchState = (data) => {
        dataList.map(item => {
            if(item.id === data.id) item.roleState = !item.roleState;
            return item
        })
        axios.patch(`/users/${data.id}`, {roleState:data.roleState}).then(res=>{
            if(res.status===200){
                handleDataList([...dataList]);
            }else{
                console.log(res)
            }
        });
    }

    const confirm = (props) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确认删除？',
            okText: '是',
            cancelText: '否',
            onOk: () => deleteMethod(props)
        });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const updateModal = async (data) => {
        if (data.roleId === 1) {
            setIsAdmin(true)
        }else {
            setIsAdmin(false)
        }
        await setIsUpdateModal(true);
        await setUpdateId(data.id);
        updateForm.current.setFieldsValue(data);
    };

    const handleOk = () => {
        addForm.current.validateFields().then(value => {
            let proms = {
                ...value,
                roleState: true,
                default: value.roleId === 1
            }
            axios.post(`/users`, proms).then(res => {
                if (res.data === 200||201){
                    handleDataList([...dataList,res.data])
                }else{
                    console.log(res)
                }
            }).catch(err=>{
                console.log(err)
            })
            addForm.current.resetFields();
            setIsModalOpen(false);
        }).catch(err=>{
            console.log(err)
        })
    };

    const handleUpdate = () =>{
        updateForm.current.validateFields().then( async value => {
            let proms = value;
            axios.patch(`/users/${updateId}`, proms).then(res=>{
                if (res.status === 200){
                    handleDataList(dataList.map(item => {
                        if(item.id === updateId) return {...item, ...proms, role: roleDataList.filter(data => data.id === value.roleId)[0]};
                        return item;
                    }))
                }else{
                    console.log(res)
                }
            }).catch(err=>{
                console.log(err)
            })

            await setIsAdmin(!isAdmin);
            setIsUpdateModal(false)
        }).catch(err=>{
            console.log(err)
        })
    };

    useEffect(() =>{
        axios.get("/users?_expand=role").then((res) => {
            // const roleTypeList = {
            //     "1": "superadmin",
            //     "2": "admin",
            //     "3": "editor",
            // }

            if (res.status === 200){
                handleDataList(region === '' ?
                    res.data :
                    res.data.filter(item=> {
                        if (item.id === id) return item
                        return item.roleId > roleId && item.region === region;
                    })
                );
                // handleDataList(
                //     roleTypeList[roleId] === "superadmin" ?
                //         res.data :
                //         [
                //             ...res.data.filter(item => item.username === username),
                //             ...res.data.filter(item => item.region === region && roleTypeList[roleId] === "editor")
                //         ]
                // )
            }else {
                console.log(res)
            }
        })
    },[id, roleId, region, username]);

    useEffect(() =>{
        axios.get("/regions").then((res) => {
            if (res.status === 200){
                setRegionData(res.data);
            }else {
                console.log(res)
            }
        })
    },[]);

    useEffect(() =>{
        axios.get("/roles").then((res) => {
            if (res.status === 200){
                setRoelData(
                    res.data.filter(item => {
                        return item.roleType >= roleId
                    })
                );
            }else {
                console.log(res)
            }
        })
    },[roleId]);

    return (
        <div>
            <Modal title="添加用户" cancelText="取消" okText="添加"
                   visible={isModalOpen}
                   onOk={handleOk}
                   onCancel={() => {
                       addForm.current.resetFields();
                       setIsModalOpen(false);
                   }}
            >
                <UserForm ref={addForm} roleDataList={roleDataList} regionDataList={regionDataList} />
            </Modal>
            <Modal title="修改信息" cancelText="取消" okText="修改"
                   visible={isUpdateModal}
                   onOk={handleUpdate}
                   onCancel={async () => {
                       await setIsAdmin(!isAdmin);
                       updateForm.current.resetFields();
                       setIsUpdateModal(false);
                   }}
            >
                <UserForm ref={updateForm} roleDataList={roleDataList} regionDataList={regionDataList} isAdmin={isAdmin} upData={true}/>
            </Modal>
            <Button
                icon={<PlusOutlined />} size="large" type="primary" style={{borderRadius: "3px"}}
                onClick={showModal}
            >添加用户
            </Button>
            <Table columns={columns} dataSource={dataList} pagination={{pageSize: 7}} rowKey={(item) => item.id}/>
        </div>
    );
}