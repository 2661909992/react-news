import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {Button, Form, Input, message} from 'antd';
import React,{ useCallback } from 'react';
import {loadFull} from "tsparticles";
import Particles from "react-tsparticles";

import Options from "./particles.json";


import "./Login.css"
import axios from "axios";



export default function Login(props) {
    const particlesInit = useCallback(async (engine) => {
        console.log(engine);
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        await console.log(container);
    }, []);

    const onFinish = (fromData) =>{
        axios.get(`http://localhost:5000/users?username=${fromData.username}&&password=${fromData.password}&&roleState=true&&_expand=role`).then(res => {
            if (res.data.length === 0){
                message.error("用户名/密码 错误");
            }else{
                localStorage.setItem("token",JSON.stringify(res.data[0]));
                props.history.replace("/");
            }
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div className="login">
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={Options}
            />
            <div className="formContainer">
                <div className="formTitle">新闻发布管理系统</div>
                <Form
                    name="login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >

                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登&nbsp;&nbsp;&nbsp;录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}