/**
 * Created by Baxter on 2016/5/25.
 */
'use strict';

import React, {Component} from 'react';

const DetailKeyMapping = {
  'id': 'id',
  'create_date': '订单创建时间',
  'back_end_id': '运营商订单号',
  'card_id': '产品编码',
  'coop_id': '商家编号',
  'customer': '手机号码',
  'fail_reason': '失败原因',
  'finish_code': '订单错误码',
  'finish_date': '订单完成时间',
  'from_platform': '供应商名称',
  'hermes_id': '处理订单的服务器',
  'inner_order_id': '内部订单号',
  'is_error': '是否为异常订单',
  'memo': '备注',
  'message': {
    title: '订单交互报文',
    children: {
      'BackendCallbackRequest': '运营商回调请求报文',
      'BackendCallbackResponse': '响应给运营商的报文',
      'BackendRequest': '向运营商请求的报文',
      'BackendResponse': '运营商响应报文',
      'SupplierCallbackRequest': '向供应商回调的报文',
      'SupplierCallbackResponse': '供应商响应回调的报文',
      'SupplierRequest': '供应商请求报文',
      'SupplierResponse': '向供应商响应的报文'
    }
  },
  'notify_url': '运营商回调地址',
  'status': '订单状态',
  'sum': '客户支付金额',
  'tb_order_id': '供应商订单编号',
  'tb_order_snap': '供应商订单快照',
  'to_platform': '运营商编号',
  'type': '订单类型',
};

class OrderDetail extends Component {
  static propTypes = {
    children: React.PropTypes.array,
    style: React.PropTypes.object,
    order: React.PropTypes.object
  };

  static defaultProps = {
    children: [],
    style: {},
    order: {}
  };

  render() {
    return (
      <div className="am-offcanvas-bar am-offcanvas-bar-flip"
           style={this.props.style}>
        <div className="am-offcanvas-content" style={{marginTop: '20%'}}>
          <div className="am-container">
            {Object.keys(DetailKeyMapping).map((col) => {
              if (col === 'solr_query')
                return '';
              let value = this.props.order[col];
              console.log(col, value);
              if (typeof value != 'boolean' && !value) {
                return (
                  <div className="am-u-sm-12" style={{marginBottom: '5%'}}>
                    <h2>{DetailKeyMapping[col]}</h2>
                    <p>{'无'}</p>
                  </div>
                )
              } else {
                if (col == 'message') {
                  let subMessage = DetailKeyMapping.message.children;
                  return (
                    <div className="am-u-sm-12" style={{marginBottom: '5%'}}>
                      <h2>{DetailKeyMapping.message.title}</h2>
                      {Object.keys(subMessage).map((item) => {
                        return (
                          <div>
                            <strong>{subMessage[item]}</strong>
                            <p>{value[item]}</p>
                          </div>
                        );
                      })}
                    </div>
                  )
                } else if (col.endsWith('date')) {
                  return (
                    <div className="am-u-sm-12" style={{marginBottom: '5%'}}>
                      <h2>{DetailKeyMapping[col]}</h2>
                      <p>{new Date(value).toFormat('YYYY-MM-DD HH24:MI:SS')}</p>
                    </div>
                  )
                } else {
                  return (
                    <div className="am-u-sm-12" style={{marginBottom: '5%'}}>
                      <h2>{DetailKeyMapping[col]}</h2>
                      <p>{value.toString()}</p>
                    </div>
                  )
                }
              }
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default OrderDetail;
