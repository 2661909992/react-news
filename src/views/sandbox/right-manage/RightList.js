import React, {useEffect, useState} from 'react';
import { Table, Tag, Button, Tooltip, Modal, Popover, Switch } from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import axios from "axios";

export default function RightList(props) {

    const [dataList,handleDataList] = useState([]);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>,
        },
        {
            title: '权限名称',
            dataIndex: 'title',
        },
        {
            title: '权限路径',
            dataIndex: 'key',
            render: (key) => <Tag color={"orange"} key={key}>{key}</Tag>,
        },
        {
            title: '操作',
            render: (item) => <div>
                <Tooltip>
                    <Button icon={<DeleteOutlined/>} shape="circle" size="large" title="删除权限" onClick={() => confirm(item)} danger/>
                </Tooltip>&nbsp;&nbsp;
                <Popover content={
                            <div>当前状态：{item.pagepermisson === 1 ? "开启" : "关闭"}&nbsp;&nbsp;&nbsp;
                                <Switch onChange={() => changeSwitchState(item)} checked={item.pagepermisson}/>
                            </div>}
                    title="权限开关"
                    trigger={item.pagepermisson===undefined ? "" : "click"}
                >
                    <Tooltip>
                        <Button icon={<EditOutlined/>} shape="circle" size="large" title="权限开关" type="primary" disabled={item.pagepermisson===undefined}/>
                    </Tooltip>
                </Popover>
            </div>,
        },
    ];

    const deleteMethod = (data) => {
        if (data.grade === 1){
            axios.delete(`http://localhost:5000/rights/${data.id}`).then(res => {
                if (res.status === 200){
                    handleDataList(dataList.filter(item => item.id !== data.id));
                }else{
                    console.log(res)
                }
            })
        }else{
            let list = dataList.filter(item => item.id === data["rightId"]);
            list[0].children = list[0].children.filter(item => item.id !== data.id);
            axios.delete(`http://localhost:5000/children/${data.id}`).then(res => {
                if (res.status === 200){
                    handleDataList([...dataList]);
                }else{
                    console.log(res)
                }
            })
        }
    }

    const changeSwitchState = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        if (item.grade === 1){
            axios.patch(`http://localhost:5000/rights/${item.id}`, {pagepermisson:item.pagepermisson}).then(res=>{
                if(res.status===200){
                    handleDataList([...dataList]);
                }else{
                    console.log(res)
                }
            });
        }else{
            axios.patch(`http://localhost:5000/children/${item.id}`, {pagepermisson:item.pagepermisson}).then(res=>{
                if(res.status===200){
                    handleDataList([...dataList]);
                }else{
                    console.log(res)
                }
            });
        }
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


    useEffect(() =>{
        axios.get("http://localhost:5000/rights?_embed=children").then((res) => {
            if (res.status === 200){
                res.data.map((item, index) => {
                    if (item.children && item.children.length < 1) delete item.children;
                    return item
                });
                handleDataList(res.data);
            }else {
                console.log(res)
            }
        })
    },[]);

    return (
        <div>
            <Table columns={columns} dataSource={dataList} pagination={{pageSize: 7}} />
        </div>
    );
}