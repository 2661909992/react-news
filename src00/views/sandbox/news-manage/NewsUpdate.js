import React, { useEffect, useState, useRef } from 'react'
import {
    PageHeader,
    Steps,
    notification,
    Button,
    Form,
    Input,
    Select,
    message,
} from "antd";
import style from './News.module.css'
import axios from 'axios';
import NewsEditor from '../../../components/news-manage/NewsEditor';
const { Step } = Steps;
const { Option } = Select;
export default function NewsAdd(props) {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([]);

    const [formInfo, setformInfo] = useState({})
    const [content, setContent] = useState("")

    // const User = JSON.parse(localStorage.getItem("token"))

    const layout = {
        //label和表单项的比例
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    };
    const NewsForm = useRef(null)
    useEffect(() => {
        axios.get("/categories").then(res => {
            console.log(res.data);
            setCategoryList(res.data)
        })
    }, [])

    useEffect(() => {
        const id = props.match.params.id;
        axios.get(`/news/${id}?_expand=role&_expand=category`).then((res) => {
            //   console.log(res.data);
            //   setNews(res.data);
            let { title, categoryId, content } = res.data;
            setContent(content);
            NewsForm.current.setFieldsValue({
                title,
                categoryId,
            });
            setContent(content)
        });
    }, [props.match.params.id]);



    const handleSave = (auditState) => {
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
        }).then(res => {
            props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

            notification.info({
                message: `通知`,
                description: `你可以到${auditState === 0 ? "草稿箱" : "审核列表"
                    }中查看您的新闻`,
                placement: "bottomRight",
            });

        })


    }

    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {
                // console.log(res);
                setformInfo(res)
                setCurrent(current + 1)
            }).catch(error => {
                console.log(error)
            })
        } else {
            if (content === "" || content.trim() === "<p></p>") {
                message.error("新闻内容不能为空")
            } else {
                setCurrent(current + 1)
            }

        }
    };

    const handlePrevious = () => {

        setCurrent(current - 1);
    };

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新新闻"
                onBack={() =>
                    props.history.goBack()
                }
                subTitle="This is a subtitle"
            />
            <Steps current={current}>
                <Step title="基本信息" description="新闻标题, 新闻分类" />
                <Step title="新闻内容" description="新闻主题内容" />
                <Step title="新闻提交" description="保存草稿或者提交审核" />
            </Steps>
            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? "" : style.active}>
                    <Form {...layout} name="basic" ref={NewsForm}>
                        <Form.Item
                            label="新闻标题"
                            name="title"
                            rules={[{ required: true, message: "请输入新闻标题" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="新闻分类"
                            name="categoryId"
                            rules={[{ required: true, message: "请输入新闻标题" }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>


                    </Form>
                </div>
                <div className={current === 1 ? "" : style.active}>
                    <NewsEditor getContent={(value) => {
                        // console.log(value);
                        setContent(value)
                    }} content={content}></NewsEditor>
                </div>
                <div className={current === 2 ? "" : style.active}></div>
            </div>


            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 && <span>
                        <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }
            </div>




        </div>
    )
}
