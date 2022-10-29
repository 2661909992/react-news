import React,{useEffect,useState} from 'react';
import { HeartTwoTone,HeartFilled } from '@ant-design/icons';
import {PageHeader, Descriptions, message} from 'antd';
import axios from "axios";

export default function Detail(props) {

    const [newsData,setNewsData] = useState({});
    const [isStar,setIsStar] = useState(false);

    const filterTime = (time) => {
        const date = new Date(time)
        const Y = date.getFullYear() // 年
        const M = date.getMonth() + 1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1 // 月
        const D = date.getDate() // 日
        const H = date.getHours() // 时
        let m = date.getMinutes() // 分
        let S = date.getSeconds() // 秒
        m = m < 9 ? ("0"+m) : m;
        S = S < 9 ? ("0"+S) : S;
        return `${Y}/${M}/${D}-${H}:${m}:${S}`
    }

    const handleStar = () => {
        axios.patch(`/news/${props.match.params.id}`, {star: newsData.star + 1}).then(res => {
            if (res.status === 200) {
                setNewsData({...newsData, star: newsData.star + 1});
                setIsStar(true);
                message.success("赞+1");
            }
        });
    }

    useEffect(()=> {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res =>{
            setNewsData({...res.data, view: res.data.view + 1});
            return res.data;
        }).then(res => {
            axios.patch(`/news/${props.match.params.id}`, {view: res.view + 1});
        })
    },[props.match.params.id])

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsData.title}
                subTitle={
                    <div>
                        {newsData.category?.title} &nbsp;
                        {
                            isStar ?
                            <HeartFilled style={{ color: 'hotpink' }} onClick={() => { message.success("已点赞")} }/> :
                            < HeartTwoTone twoToneColor="#eb2f96" onClick={() => {handleStar()}}/>
                        }
                    </div>
                }
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="作者">{newsData.author}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">
                        {
                            newsData.publishTime ?
                                filterTime(newsData.publishTime):
                                "-"
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="区域">{newsData.region}</Descriptions.Item>
                    <Descriptions.Item label="访问数量"><span style={{color:"green"}}>{newsData.view}</span></Descriptions.Item>
                    <Descriptions.Item label="点赞数量"><span style={{color:"green"}}>{newsData.star}</span></Descriptions.Item>
                    <Descriptions.Item label="评论数量"><span style={{color:"green"}}>0</span></Descriptions.Item>
                </Descriptions>
            </PageHeader>
            {/*
                dangerouslySetInnerHTML={{__html:newsData.content}}  react 富文本内容转换，类似vue的v-html
            */}
            <div dangerouslySetInnerHTML={{__html: newsData.content}} style={{border: "1px solid silver", margin: "25px"}}/>
        </div>
    );
}