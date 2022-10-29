import React, {useEffect, useState, useRef, useContext} from 'react';
import {Table, Button, Modal, message, Tooltip, Input, Form} from 'antd';
import {
    ExclamationCircleOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import axios from "axios";
import './NewsCategory.css'

export default function NewsCategory(props) {

    const {username} = JSON.parse(localStorage.getItem("token"))
    const [newsList,setNewsList] = useState([]);
    const EditableContext = React.createContext(null);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '30px',
            render: id => <b>{id}</b>
        },
        {
            title: '栏目名称',
            dataIndex: 'title',
            width: '75%',
            onCell: (record) => ({
                record,
                editable: true,
                dataIndex: 'title',
                title: '栏目名称',
                handleSave,
            }),
        },
        {
            title: '操作',
            render: (item) => <Tooltip title="删除"><Button onClick={() => confirm(item.id)} shape="circle" danger icon={<DeleteOutlined/>}/></Tooltip>,
        },
    ];

    const handleSave = (row) => {
        // 1.antd的写法，比较严谨
        // const newData = [...newsList];
        // const index = newData.findIndex((item) => row.id === item.id);
        // const item = newData[index];
        // newData.splice(index, 1, {
        //     ...item,
        //     ...row,
        // });
        // setNewsList(newData);

        // 2.可读性比较高的写法
        // setNewsList(newsList.map(item => {
        //     if (item.id === row.id){
        //         return {
        //             id: row.id,
        //             title: row.title,
        //             value: row.title
        //         }
        //     }
        //     return item
        // }));

        let params = {
            id: row.id,
            title: row.title,
            value: row.title
        }
        axios.patch(`/categories/${row.id}`, params).then(res=>{
            if (res.status === 200){
                setNewsList(newsList.map(item => {
                    console.log(item)
                    if (item.id === row.id){
                        return params
                    }
                    return item
                }));
                message.success("修改成功");
            }else {
                console.log(res)
            }
        })
    };

    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };
    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);
        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values,
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

    const confirm = (id) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确认删除？',
            okText: '是',
            cancelText: '否',
            onOk: () => {
                console.log(id)
                // axios.delete(`/categories/${id}`).then(res => {
                //     if (res.status === 200){
                //         setNewsList(newsList.filter(item =>{
                //             return item.id !== id
                //         }))
                //         message.success("已删除");
                //     }else {
                //         console.log(res);
                //     }
                // });
            }
        });
    };

    useEffect(()=> {
        axios.get(`/categories`).then(res=>{
            setNewsList(res.data);
        })
    },[username]);

    return (
        <div>
            <Table
                components={{
                    body: {
                        row: EditableRow,
                        cell: EditableCell,
                    },
                }}
                columns={columns}
                dataSource={newsList}
                rowClassName={() => 'editable-row'}
                bordered
                pagination={{pageSize: 7}}
                rowKey={(item) => item.id}/>
        </div>
    );
}