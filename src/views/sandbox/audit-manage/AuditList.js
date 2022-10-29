import React, {useEffect, useState} from 'react';
import {Table, Tag, Button, Modal, message} from 'antd';
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from "axios";

export default function AuditList(props) {

    const {username} = JSON.parse(localStorage.getItem("token"))
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
            title: '审核状态',
            dataIndex: 'auditState',
            render: auditState =>
                <Tag color={auditState === 1 ? "orange" : (auditState === 2 ? "green" : "red")} >
                    {auditState  === 1 ? "审核中" : (auditState  === 2 ? "审核通过" : "审核未通过")}
                </Tag>,
        },
        {
            title: '操作',
            render: (item) => <div>
                {
                    item.auditState === 1 && <Button onClick={()=>confirm(item.id,0)} >撤销</Button>
                }
                {
                    item.auditState === 2 && <Button onClick={()=>confirm(item.id,2)} type="primary" >发布</Button>
                }
                {
                    item.auditState === 3 && <Button onClick={()=>{}} danger >修改</Button>
                }
            </div>,
        },
    ];

    const publishNews = (id, type) => {
        axios.patch(`/news/${id}`, {publishState: type, publishTime: Date.now()}).then(res => {
            if (res.status === 200){
                setNewsList(newsList.filter(item =>{
                    return item.id !== id
                }))
                message.success("发布成功");
                props.history.push("/publish-manage/published");
            }else {
                console.log(res)
            }
        });
    }
    const revokeNews = (id, type) => {
        axios.patch(`/news/${id}`, {auditState: type}).then(res => {
            if (res.status === 200){
                setNewsList(newsList.filter(item =>{
                    return item.id !== id
                }))
                message.success("已撤回草稿箱");
            }else {
                console.log(res)
            }
        });
    }

    const confirm = (id, type) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: type === 2 ? '确认发布？' : ('确认撤销？'),
            okText: '是',
            cancelText: '否',
            onOk: () => {
                type === 2 ? publishNews(id, type) : revokeNews(id, type);
            }
        });
    };

    useEffect(()=> {
        axios.get(`/news?auditState_ne=0&publishState_lte=1&author=${username}&_expand=category`).then(res=>{
            setNewsList(res.data);
        })
    },[username]);

    return (
        <div>
            <Table columns={columns} dataSource={newsList} pagination={{pageSize: 7}} rowKey={(item) => item.id}/>
        </div>
    );
}