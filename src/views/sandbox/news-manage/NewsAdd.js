import React, { useState, useEffect, useRef } from 'react';
import { PageHeader, Steps, Divider, Button, Form, Input, Select, message } from "antd";
import axios from "axios";

import NewsEditor from "../../../components/news-manage/NewsEditor";


const { Step } = Steps;
const { Option } = Select;


export default function NewsAdd(props) {
    const [step, setStep] = useState(0);
    const [categoriesList, setCategories] = useState([]);
    const [formData, setFormData] = useState({});
    const [editorData, setEditorData] = useState("");
    const step1 = useRef(null);

    const changeStep = (state) =>{
        if (state === "next" && step < 2){
            if (step === 0 ){
                step1.current.validateFields().then(res=> {
                    setFormData(res);
                    setStep(step+1);
                }).catch(err=> {
                    console.log(err);
                });
            }else if (step === 1){
                if (editorData === "" || editorData.length<=8){
                    message.warning('新闻内容不能为空');
                    return;
                }
                setStep(step+1);
            }
        }else if(state === "back"){
            setStep(step-1)
        }
    }

    const submitNew = (type) => {
        let userData = JSON.parse(localStorage.getItem("token"));
        let params = {
            region: userData.region?userData.region:"全球",
            author: userData.username,
            roleId: userData.roleId,
            auditState: type,  // 新闻发布状态(待审核，草稿箱状态)
            publishState: 0,  // 发布新闻状态
            createTime: Date.now(),
            publishTime: 0,  // 发布新闻时间
            star: 0,  // 点赞数
            view: 0,  // 点击量
        }
        Object.assign(params, {title: formData.title,categoryId: formData.categoriesId},{content:editorData});
        axios.post("/news",params).then(res => {
            message.success(type ? "请等待审核":"保存成功" );
            props.history.push(type ? "/audit-manage/list":"/news-manage/draft");
        });
    }

    useEffect(()=> {
        axios.get("/categories").then(res => {
            setCategories(res.data)
        })
    }, [])

    return (
        <div>
            <PageHeader title="撰写新闻" />
            <Steps current={step}>
                <Step title="基本信息" description="新闻标题，新闻分类" />
                <Step title="新闻内容" description="新闻主体内容" />
                <Step title="提交新闻" description="保存草稿或提交审核" />
            </Steps>
            <Divider  style={{marginTop: "20px"}}/>
            <div>
                {
                    <div style= {step === 0 ? {display: "block"} : {display: "none"}}>
                        <Form
                            ref={step1}
                        >
                            <Form.Item label="标题" name="title" rules={[ {required: true, message: "请输入标题！"} ]}>
                                <Input/>
                            </Form.Item>
                            <Form.Item label="分类" name="categoriesId" rules={[ {required: true, message: "请输入分类！"} ]}>
                                <Select>
                                    {
                                        categoriesList.map(item => <Option value={item.id} key={item.id}>{item.title}</Option>)
                                    }
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                }
                {
                    <div style = {step === 1 ? {display: "block"} : {display: "none"}}>
                        <NewsEditor getEditorContent={ (props)=> setEditorData(props) } />
                    </div>
                }
                {
                    <div style = {step === 2 ? {display: "block"} : {display: "none"}}>

                    </div>
                }
            </div>
            <div style={{textAlign:"center",margin:"30px 0 0 -60px"}}>
                {
                    step > 0 ?
                    <Button onClick={() => changeStep("back")}>上一步</Button> :
                    null
                }
                &nbsp;&nbsp;
                {
                    step < 2 ?
                    <Button onClick={() => changeStep("next")} type="primary">下一步</Button> :
                    <div style={{marginTop:"10px"}}>
                        <Button type="primary" onClick={() => submitNew(0)}>保存到草稿</Button>&nbsp;&nbsp;
                        <Button danger onClick={() => submitNew(1)}>提交审核</Button>
                    </div>
                }
            </div>
        </div>
    );
}