import React,{useEffect,useState} from 'react';

import { PageHeader,Descriptions } from 'antd';
import axios from "axios";

export default function NewsPreview(props) {

    const [newsData,setNewsData] = useState([]);
    const auditStateList = ["未提交","审核中","已通过","未通过"];
    const publishStateList = ["未发布","待发布","已上线","已下线"];
    const colorList = ["black","orange","green","red"]

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

    useEffect(()=> {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res =>{
            setNewsData(res.data);
        })
    },[props.match.params.id])

    return (
        <div>
            <PageHeader
                ghost={false}
                onBack={() => window.history.back()}
                title={newsData.title}
                subTitle={newsData.category?.title}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsData.author}</Descriptions.Item>
                    <Descriptions.Item label="创建时间">{filterTime(newsData.createTime)}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">
                        {
                            newsData.publishTime ?
                            filterTime(newsData.publishTime):
                            "-"
                        }
                    </Descriptions.Item>
                    <Descriptions.Item label="区域">{newsData.region}</Descriptions.Item>
                    <Descriptions.Item label="审核状态">
                        <span style={{color:colorList[newsData.auditState]}}>{auditStateList[newsData.auditState]}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="发布状态">
                        <span style={{color:colorList[newsData.publishState]}}>{publishStateList[newsData.publishState]}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="访问数量"><span style={{color:"green"}}>{newsData.view}</span></Descriptions.Item>
                    <Descriptions.Item label="点赞数量"><span style={{color:"green"}}>{newsData.star}</span></Descriptions.Item>
                    <Descriptions.Item label="评论数量"><span style={{color:"green"}}>0</span></Descriptions.Item>
                </Descriptions>
            </PageHeader>
            {/*
                dangerouslySetInnerHTML={{__html:newsData.content}}  react 富文本内容转换，类似vue的v-html
            */}
            <div dangerouslySetInnerHTML={{__html: newsData.content}} style={{border: "1px solid silver"}}/>
        </div>
    );
}