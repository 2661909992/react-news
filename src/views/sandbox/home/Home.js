import React, {useEffect, useState, useRef} from 'react';
import { Card, Col, Row, List, Avatar, Drawer } from "antd";
import { EditOutlined, EllipsisOutlined, PieChartOutlined, BarChartOutlined } from '@ant-design/icons';
import * as Echarts from "echarts";
import _ from "lodash";

import axios from "axios";
const { Meta } = Card;

export default function Home(props) {
    const barRef = useRef()
    const pieRef = useRef()
    const [viewList, setViewList] = useState([]);
    const [starList, setStarList] = useState([]);
    const [openDrawer, setOpenDrawer] = useState(false);
    // const [pieChart, setPieChart] = useState(null);
    const [pieChartData, setPieChartData] = useState([]);
    const {username, region, role:{roleName}} = JSON.parse(localStorage.getItem('token'));

    const renderBar = (data) => {
        // 基于准备好的dom，初始化echarts实例
        let myChart = Echarts.init(barRef.current);

        // 指定图表的配置项和数据
        let option = {
            title: {
                text: '新闻分类统计'
            },
            tooltip: {},
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(data),
                axisLabel:{
                    rotate: "45",
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(data).map(item => item.length)
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.onresize = () => {
            myChart.resize();
        }
    }

    const renderPie = (data) => {

        // 基于准备好的dom，初始化echarts实例

        // 代码兼容性不是很好
        // let myChart;
        // if (!pieChart){
        //     myChart = Echarts.init(pieRef.current);
        //     setPieChart(myChart);
        // }else {
        //     myChart = pieChart;
        // }

        // 会重复渲染dom，但兼容较好，相比以上有较好的用户体验
        let myChart = Echarts.init(pieRef.current);

        let pieGroup = _.groupBy(pieChartData,item => item.category.title);
        let pieData = [];
        for (let key in pieGroup){
            pieData.push({
                name: key,
                value: pieGroup[key].length
            });
        }

        let option = {
            title: {
                text: '用户新闻发布统计',
                subtext: '分类统计',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'horizontal',
                bottom: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: pieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        option && myChart.setOption(option);
    }

    useEffect(() =>{
        Promise.all([
            axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`),
            axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`),
            axios.get(`/news?publishState=2&_expand=category`),
        ]).then(res => {
            setViewList(res[0].data);
            setStarList(res[1].data);
            renderBar(_.groupBy(res[2].data, item => item.category.title));
            setPieChartData(res[2].data.filter( item =>  item.author === username ));
        })

        return () => {
            window.onresize = null;
        }
    },[username])
    return (
        <div className="site-card-wrapper">
            <Drawer
                title="用户新闻发布统计"
                placement="right"
                width="500px"
                onClose={() => {setOpenDrawer(false)}} visible={openDrawer}>
                <div id="pieChart" ref={pieRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}/>
            </Drawer>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title={
                            <div>
                                用户最常浏览 <BarChartOutlined />
                            </div>
                        }
                          bordered
                    >
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={
                            <div>
                                用户点赞最多 <BarChartOutlined />
                            </div>
                        }
                          bordered
                    >
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <PieChartOutlined key="pieView" onClick={() => {
                                setOpenDrawer(true);
                                setTimeout(() => {
                                    renderPie();
                                },0)
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={username}
                            description={ region === "" ? <span><b>全球</b>&nbsp;&nbsp;&nbsp;{roleName}</span> : <span><b>{region}</b>&nbsp;&nbsp;&nbsp;{roleName}</span>}
                        />
                    </Card>
                </Col>
            </Row>
            <div id="barChart" ref={barRef} style={{ width: '100%', height: '400px', marginTop: '30px' }}/>
        </div>
    );
}