import React, {useEffect, useState} from 'react';
import {Table, Button, Modal, message} from 'antd';
import {
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from "axios";

export default function Published(props) {

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
            title: '发布时间',
            dataIndex: 'publishTime',
            render: publishTime => filterTime(publishTime)
        },
        {
            title: '操作',
            render: (item) => <Button onClick={()=>confirm(item.id)} type="primary" >下线</Button>,
        },
    ];

    const confirm = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确认下线？',
            okText: '是',
            cancelText: '否',
            onOk: () => {
                axios.patch(`/news/${id}`, {publishState: 3}).then(res => {
                    if (res.status === 200){
                        setNewsList(newsList.filter(item =>{
                            return item.id !== id
                        }))
                        message.success("已下线");
                        props.history.push("/publish-manage/sunset");
                    }else {
                        console.log(res);
                    }
                });
            }
        });
    };

    useEffect(()=> {
        axios.get(`/news?publishState=2&author=${username}&_expand=category`).then(res=>{
            setNewsList(res.data);
        })
    },[username]);

    return (
        <div>
            <Table columns={columns} dataSource={newsList} pagination={{pageSize: 7}} rowKey={(item) => item.id}/>
        </div>
    );
}