import React, {useEffect, useState} from 'react';
import {Table, Button, Modal, message, Tooltip} from 'antd';
import {
    ExclamationCircleOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import axios from "axios";

export default function Audit(props) {

    const filterTime = (time) => {
        const date = new Date(time)
        const Y = date.getFullYear() // 年
        const M = date.getMonth() + 1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1 // 月
        const D = date.getDate() // 日
        let H = date.getHours() // 时
        let m = date.getMinutes() // 分
        let S = date.getSeconds() // 秒
        H = H < 10 ? ("0"+H) : H;
        m = m < 10 ? ("0"+m) : m;
        S = S < 10 ? ("0"+S) : S;
        return `${Y}/${M}/${D}-${H}:${m}:${S}`
    }

    const {id, roleId, region, username} = JSON.parse(localStorage.getItem("token"));
    const [newsList,setNewsList] = useState([]);

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title,item) => <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: category => category.title
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            render: createTime => filterTime(createTime)
        },
        {
            title: '操作',
            render: (item) => <div>
                <Tooltip title="通过"><Button onClick={() => confirm(item.id, 2)} icon={<CheckOutlined/>} shape="circle" type="primary"/></Tooltip>
                &nbsp;&nbsp;
                <Tooltip title="驳回"><Button onClick={() => confirm(item.id, 3)} icon={<CloseOutlined/>} shape="circle" danger/></Tooltip>
            </div>,
        },
    ];

    const publishNews = (id, type) => {
        axios.patch(`/news/${id}`, {auditState: type,publishState: 1}).then(res => {
            if (res.status === 200){
                setNewsList(newsList.filter(item =>{
                    return item.id !== id
                }));
                message.success("同意发布");
            }else {
                console.log(res);
            }
        });
    }
    const revokeNews = (id, type) => {
        axios.patch(`/news/${id}`, {auditState: type}).then(res => {
            if (res.status === 200){
                setNewsList(newsList.filter(item =>{
                    return item.id !== id
                }));
                message.success("已撤回");
            }else {
                console.log(res);
            }
        });
    }

    const confirm = (id, type) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: type === 3 ? '确认驳回' : ('确认通过'),
            okText: '是',
            cancelText: '否',
            onOk: () => {
                type === 3 ?  revokeNews(id, type) :publishNews(id, type);
            }
        });
    };

    useEffect(()=> {
        axios.get(`/news?auditState=1&_expand=category`).then(res=>{
            if (res.status === 200){
                setNewsList(region === '' ?
                    res.data :
                    res.data.filter(item=> {
                        if (item.id === id) return item
                        return item.roleId > roleId && item.region === region;
                    })
                );
            }else {
                console.log(res)
            }
        })
    },[id, region, roleId, username]);

    return (
        <div>
            <Table columns={columns} dataSource={newsList} pagination={{pageSize: 7}} rowKey={(item) => item.id}/>
        </div>
    );
}