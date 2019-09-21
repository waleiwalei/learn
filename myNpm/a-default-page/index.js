import React, { Component } from 'react';
import './index.scss';

const showInfo = {
    empty: {
        img: '//s.qunarzz.com/q_vip/common/empty.png',
        info: '<p>抱歉</p><p>没有找到满足条件的结果</p>'
    },
    error: {
        img: '//s.qunarzz.com/q_vip/common/error.png',
        info: '<p>数据请求失败</p><p>请检查一下网络是否通畅</p>'
    },
    loading: {
        info: '<p>正在加载中，请稍候...</p>'
    }
}

class DefaultPage extends Component{
	constructor(props) {
		super(props);
	}

	render() {
        const { status } = this.props;
        const pageInfo = showInfo[status] || {};
        
        return (<div className="m-default-page">
            <div className="default-img">
                {
                    pageInfo.img && 
                    <img src={pageInfo.img} alt=""/>
                }
            </div>
            <div dangerouslySetInnerHTML={{__html: pageInfo.info}}></div>
        </div>);
    }
}
export default DefaultPage;