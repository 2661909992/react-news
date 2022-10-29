// import axios from 'axios'
import { Button } from 'antd'

// import React, { useEffect ,useState} from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Sunset() {
const {dataSource,handleDelete} = usePublish(3)
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button danger
      onClick={()=>handleDelete(id)}>
        删除
      </Button>}></NewsPublish>
    </div>
  )
}

