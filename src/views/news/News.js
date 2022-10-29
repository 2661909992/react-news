import React, {useEffect, useState} from 'react';
import { PageHeader, Row, Col, Card, List } from 'antd';
import _ from "lodash";

import axios from "axios";


export default function News(props) {

    const [newsGroupList, setNewsGroupList] = useState([]);

    useEffect(()=> {
        axios.get("/news?publishState=2&_expand=category").then(res => {
            setNewsGroupList(Object.entries(_.groupBy(res.data, item => item.category.title)));
        })
    },[])

    return (
        <div style={{
            width: "95%",
            margin: "0 auto"
        }}>
            <PageHeader
                className="site-page-header"
                title="大新闻"
                subTitle="时事资讯"
            />
            <div className="site-card-wrapper">
                <Row gutter={[16,16]}>
                    {
                        newsGroupList.map((item, index) =>
                            <Col span={8} key={index}>
                                <Card title={item[0]} bordered hoverable>
                                    <List
                                        size="small"
                                        dataSource={item[1]}
                                        pagination={{pageSize: 3}}
                                        renderItem={(i) => <List.Item><a href={`#/detail/${i.id}`}>{i.title}</a></List.Item>}
                                    />
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>
        </div>
    );
}