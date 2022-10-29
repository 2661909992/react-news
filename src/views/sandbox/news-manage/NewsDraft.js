import React, {useState, useEffect} from 'react';
import {Button, message, Modal, Table, Tooltip} from "antd";
import axios from "axios";
import {DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined, UploadOutlined} from "@ant-design/icons";


export default function NewsDraft(props) {

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: id => <b>{id}</b>,
        },
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
            title: '创建时间',
            dataIndex: 'createTime',
            render: time => filterTime(time)
        },
        {
            title: '操作',
            render: (item) => <div>
                <Tooltip title="删除" >
                    <Button icon={<DeleteOutlined />} shape="circle" size="small" danger
                            onClick={() => confirm(item,"delete")}
                    />
                </Tooltip>&nbsp;&nbsp;
                <Tooltip title="编辑">
                    <Button icon={<UnorderedListOutlined />} shape="circle" size="small" type="primary" onClick={() => props.history.push(`/news-manage/update/${item.id}`)} />
                </Tooltip>&nbsp;&nbsp;
                <Tooltip title="提交审核">
                    <Button icon={<UploadOutlined />} shape="circle" size="small" onClick={() => confirm(item.id,"commit")} />
                </Tooltip>
            </div>,
        },
    ];

    const filterTime = (time) => {
        const date = new Date(time)
        const Y = date.getFullYear() // 年
        const M = date.getMonth() + 1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1 // 月
        const D = date.getDate() // 日
        const H = date.getHours() // 时
        let m = date.getMinutes() // 分
        let S = date.getSeconds() // 秒
        m = m < 10 ? ("0"+m) : m;
        S = S < 10 ? ("0"+S) : S;
        return `${Y}/${M}/${D}-${H}:${m}:${S}`
    }

    const confirm = (data,type) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: type === "delete" ? '确认删除' : '提交审核',
            okText: '是',
            cancelText: '否',
            onOk: () => {
                if (type === "delete"){
                    deleteMethod(data);
                }else if (type === "commit"){
                    commit(data);
                }
            }
        });
    };

    const deleteMethod = (data) => {
        axios.delete(`/news/${data.id}`).then(res => {
            if (res.status === 200){
                setDraftList(draftList.filter(item => item.id !== data.id));
            }else{
                console.log(res)
            }
        })
    };

    const commit = (id) => {
        axios.patch(`/news/${id}`, {auditState: 1}).then(res => {
            if (res.status === 200){
                message.success("请等待审核");
                props.history.push("/audit-manage/list");
            }else {
                console.log(res)
            }
        });
    }

    const [draftList, setDraftList] = useState([]);
    const {username} = JSON.parse(localStorage.getItem("token"));

    useEffect(()=>{
        axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res=>{
            setDraftList(res.data)
        })
    }, [username])
    return (
        <div>
            <Table
                dataSource={draftList}
                columns={columns}
                pagination={{pageSize: 7}}
                rowKey={(item) => item.id}
            />
        </div>
    );
}