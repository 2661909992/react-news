import React, {forwardRef, useEffect, useState} from 'react';
import {Form, Input, Select} from "antd";
const { Option } = Select;

const UserForm = forwardRef((props,ref)=>{
    const [isDisable, setDisable] = useState(false)
    const {roleId,region} = JSON.parse(localStorage.getItem("token"))
    const roleObj ={
        "1":"superadmin",
        "2":"admin",
        "3":"editor"
    }

    const unSelect = (item) => {
        if(props.upData){
            if(roleObj[roleId]==="superadmin"){
                return false
            }else{
                return true
            }
        }else{
            if(roleObj[roleId]==="superadmin"){
                return false
            }else{
                return item.value!==region
            }
        }
    }

    useEffect(()=>{
        console.log(JSON.parse(localStorage.getItem("token")).roleId === 1)
        setDisable(props.isAdmin)
    },[props.isAdmin])

    return (
        <Form
            ref={ref}
            name="infoForm"
            layout="vertical"
            initialValues={{
                remember: true,
            }}
            autoComplete="off"
        >
            <Form.Item
                label="用户名"
                name="username"
                rules={[
                    {
                        required: true,
                        message: '请输入用户名!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[
                    {
                        required: true,
                        message: '请输入密码!',
                    },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                label="区域"
                name="region"
                rules={ isDisable ? []:
                    [
                        {
                            required: true,
                            message: '请选择区域!',
                        },
                    ]}
            >
                <Select disabled={isDisable}>
                    {
                        props.regionDataList.map(item=>{
                            return <Option disabled={unSelect(item)} key={item.id} value={item.value}>{item.title}</Option>
                        })
                    }
                </Select>
            </Form.Item>

            <Form.Item
                label="角色"
                name="roleId"
                rules={[
                    {
                        required: true,
                        message: '请选择角色!',
                    },
                ]}
            >
                <Select
                    onChange={(value) =>{
                        if(value === 1) {
                            ref.current.setFieldsValue({region: ""})
                            setDisable(true)
                        }else{
                            setDisable(false)
                        }
                    }}
                >
                    {
                        props.roleDataList.map(item=>{
                            return <Option key={item.id} value={item.roleType}>{item.roleName}</Option>
                        })
                    }
                </Select>
            </Form.Item>

        </Form>
    );
})

export default UserForm;