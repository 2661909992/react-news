import React, {useState, useEffect} from 'react';
import {Button, Modal, Table, Tooltip, Tree} from "antd";
import axios from "axios";
import {DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined} from "@ant-design/icons";


export default function RoleList(props) {

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => <b>{id}</b>,
        },
        {
            title: '角色',
            dataIndex: 'roleName',
        },
        {
            title: '操作',
            render: (item) => <div>
                <Tooltip title="删除角色" >
                    <Button icon={<DeleteOutlined />} shape="circle" size="large" danger
                            onClick={() => confirm(item)}
                    />
                </Tooltip>&nbsp;&nbsp;
                <Tooltip title="权限">
                    <Button icon={<UnorderedListOutlined />} shape="circle" size="large" type="primary"
                            onClick={() => showModal(item)}

                    />
                </Tooltip>
            </div>,
        },
    ];


    const confirm = (props) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确认删除？',
            okText: '是',
            cancelText: '否',
            onOk: () => deleteMethod(props)
        });
    };

    const deleteMethod = (data) => {
        console.log(data)
        if (data){
            axios.delete(`http://localhost:5000/roles/${data.id}`).then(res => {
                if (res.status === 200){
                    setRoleData(roleDataList.filter(item => item.id !== data.id));
                }else{
                    console.log(res)
                }
            })
        }else{
            axios.delete(`http://localhost:5000/children/${data.id}`).then(res => {
                if (res.status === 200){
                    // handleDataList([...dataList]);
                }else{
                    console.log(res)
                }
            })
        }
    };

    const handleOk = () => {
        if (openId === 0) return alert("您未做任何更改");
        setRoleData(roleDataList.map((item)=>{
            return item.id === openId ? {...item, rights: authorityScope} : item;
        }))
        axios.patch(`http://localhost:5000/roles/${openId}`, {
            rights: authorityScope
        }).then(res=> {
            if (res.status === 200){

            }else{
                console.log(res)
            }
        })
        setIsModalOpen(false);
    };

    const showModal = (data) => {
        console.log(data)
        setOpenId(data.id);
        setAuthorityScope(data.rights);
        setIsModalOpen(true);
    };

    const onCheck = (checkedKeysValue) => {
        setAuthorityScope(checkedKeysValue);
    };

    const [roleDataList, setRoleData] = useState([]);
    const [treeDataList, setTreeData] = useState([]);
    const [authorityScope, setAuthorityScope] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openId, setOpenId] = useState(0);

    useEffect(()=>{
        // axios.get(`http://localhost:5000/roles`).then(res=>{
        //     setRoleData(res.data);
        //     console.log(res)
        // })
        // axios.get(`http://localhost:5000/rights?_embed=children`).then(res=>{
        //     setTreeData(res.data);
        //     console.log(res)
        // })
        Promise.all([axios.get("/roles"),axios.get("/rights?_embed=children")]).then(res => {
            setRoleData(res[0].data);
            setTreeData(res[1].data);
        })
    }, [])
    return (
        <div>
            <Modal title="权限分配" cancelText="取消" okText="确认"
                   visible={isModalOpen} onOk={handleOk} onCancel={()=>{setIsModalOpen(false)}}>
                <Tree
                    checkable
                    treeData={treeDataList}
                    checkedKeys={authorityScope}
                    checkStrictly={true}
                    onCheck={onCheck}
                />
            </Modal>
            <Table
                dataSource={roleDataList}
                columns={columns}
                rowKey={(item) => item.id}
            />
        </div>
    );
}