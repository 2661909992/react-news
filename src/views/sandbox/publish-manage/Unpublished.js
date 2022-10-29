import React, {useEffect, useState} from 'react';
import {Table, Tag, Button, Modal, message} from 'antd';
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from "axios";

export default function Unpublished(props) {

    const {username} = JSON.parse(localStorage.getItem("token"))
    const [newsList,setNewsList] = useState([]);

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

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'title',
            render: (title,item) => <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
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
            title: '创建时间',
            dataIndex: 'createTime',
            render: createTime => filterTime(createTime)
        },
        {
            title: '操作',
            render: (item) => <Button onClick={()=>confirm(item.id,2)} type="primary" >发布</Button>
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

    const confirm = (id, type) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确认发布？',
            okText: '是',
            cancelText: '否',
            onOk: () => publishNews(id, type)
        });
    };

    useEffect(()=> {
        axios.get(`/news?publishState=1&author=${username}&_expand=category`).then(res=>{
            setNewsList(res.data);
        })
    },[username]);

    return (
        <div>
            <Table columns={columns} dataSource={newsList} pagination={{pageSize: 7}} rowKey={(item) => item.id}/>
        </div>
    );
}