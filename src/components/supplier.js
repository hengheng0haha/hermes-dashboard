/**
 * Created by Baxter on 2016/5/30.
 */
'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Top from './Top';
import Panel from './Panel';
import {Selected, ModalTrigger, Modal} from 'amazeui-react';
import {supplierCharge} from '../core/utils';
import {getSuppliers, transformMoney, getCards} from '../core/utils';
import Table, {ButtonInTable} from './Table';

const PRODUCT_TYPE = {
  FLOW: '流量',
  BILL: '话费'
}

class SupplierManage extends Component {
  render() {
    return (
      <div>
        <Top first="商家" second="商家管理"/>
        <div className="am-avg-sm-1 am-avg-md-4 am-margin am-padding am-text-center admin-content-list ">
          <h1>商家管理</h1>
        </div>
      </div>
    )
  }
}

class SupplierProducts extends Component {


  constructor(props) {
    super(props);
    this.state = {
      suppliers: [],
      selectedSupplier: '',
      table: {
        rows: [],
        count: '',
        current: ''
      }
    };
    this.initSuppliers = this.initSuppliers.bind(this);
    this.handleSupplierSelected = this.handleSupplierSelected.bind(this);
  }

  render() {
    return (
      <div className="am-u-sm-12">
        <Top first="商家" second="商家产品"/>
        <Panel title="选择一个商家">
          <div className="am-u-sm-12 am-u-md-3">
            <Selected
              ref="supplier"
              placeholder="选择一个商家"
              data={this.state.suppliers}
              value={this.state.selectedSupplier}
              onChange={(value) => this.handleSupplierSelected(value)}
            />
          </div>
          <div className="am-u-sm-12 am-u-md-3 am-u-end">
            <div className="am-form-group am-form-file">
              <button type="button" className="am-btn am-btn-danger am-btn-sm"
                      disabled={this.state.selectedSupplier ? '': 'disabled'}>
                <i className="am-icon-cloud-upload"></i> 选择产品列表文件
              </button>
              <input id="doc-form-file" type="file" multiple disabled={this.state.selectedSupplier ? '': 'disabled'}/>
            </div>
            <div id="file-list"></div>
          </div>
        </Panel>
        <Table
          names={{
          code: '产品编号',
          name: '产品名称',
          price: '产品价格(￥)',
          type: '产品类型',
          _operation: '操作'
          }}
          rows={this.state.table.rows}
          totalDataCount={this.state.table.count}
          currentPage={this.state.table.current}
          onFirstPage={this.handleFirstPage}
          onLastPage={this.handleLastPage}
          onPrevPage={this.handlePrevPage}
          onNextPage={this.handleNextPage}
        />
      </div>
    );
  }

  componentDidMount() {
    this.initSuppliers();
    $('#doc-form-file').on('change', function() {
      console.log('change');
      console.log(this.files);
      var fileNames = '';
      $.each(this.files, function() {
        fileNames += `<span class="am-badge">${this.name}</span>`;
      });
      $('#file-list').html(fileNames);
    });
  }

  onModalCancel() {
    console.log('cancel');
  }

  conModalConfirm(value) {
    console.log('confirm', value);
  }

  async initSuppliers() {
    let suppliers = await getSuppliers();
    let tmp = suppliers.map((supplier) => {
      return {
        value: supplier.code,
        label: supplier.name || supplier.code
      };
    });
    let state = Object.assign({}, this.state, {suppliers: tmp});
    this.setState(state);
  }

  async handleSupplierSelected(value) {
    let cards = await getCards(value);
    let rows = [];
    let index = 0;
    Object.keys(cards).forEach((item) => {
      if (cards[item].code) {
        rows.push(Object.assign({}, cards[item], {
          type: PRODUCT_TYPE[cards[item].type],
          _operation: this.cardOperation(index++)
        }));
      }
    });
    console.log(rows);
    let state = Object.assign({}, this.state, {
      table: {
        rows,
        count: rows.length,
        current: 1
      },
      selectedSupplier: value
    });
    this.setState(state);
  }

  cardOperation(index) {
    return (
      <ButtonInTable>
        <button className="am-btn am-btn-default am-btn-xs am-text-secondary">
          <span className="am-icon-pencil-square-o" value={index}></span> 修改
        </button>
        <button className="am-btn am-btn-default am-btn-xs am-text-danger">
          <span className="am-icon-pencil-square-o" value={index}></span> 删除
        </button>
      </ButtonInTable>
    )
  }

  handleFirstPage() {

  }

  handlePrevPage() {

  }

  handleNextPage() {

  }

  handleLastPage() {
  }
}

class SupplierBilling extends Component {

  constructor(props) {
    super(props);
    this.state = {
      suppliers: [],
      selectedSupplier: '',
      balance: '0'
    };

    this.initSuppliers = this.initSuppliers.bind(this);
    this.onModalConfirm = this.onModalConfirm.bind(this);
  }

  render() {
    let modal = (
      <Modal type="prompt" title="充值">
        请输入充值金额
        <input type="number" className="am-modal-prompt-input"/>
      </Modal>
    );
    return (
      <div className="am-u-sm-12">
        <Top first="商家管理" second="商家计费"/>
        <Panel title="选择一个商家">
          <div className="am-u-sm-12 am-u-md-3 ">
            <Selected
              ref="supplier"
              placeholder="选择一个商家"
              data={this.state.suppliers}
              value={this.state.selectedSupplier}
              onChange={(value) => {
                this.handleSupplierSelected(value);
              }}
            />
          </div>
          <div className="am-u-sm-12 am-u-md-3 am-u-end">
            <ModalTrigger
              modal={modal}
              onCancel={this.onModalCancel}
              onConfirm={this.onModalConfirm}>
              <button
                type="button"
                className="am-btn am-btn-success "
                disabled={this.state.balance == '-1' ? 'disabled' : ''}
              >充值
              </button>
            </ModalTrigger>
          </div>
        </Panel>
        <ul className="am-avg-sm-1 am-avg-md-1 am-padding am-text-center admin-content-list ">
          <li style={{fontSize: '4em'}}>
            {`￥${transformMoney(this.state.balance)}`}
          </li>
        </ul>
      </div>
    );
  }

  componentDidMount() {
    this.initSuppliers();
    this.balanceInterval = setInterval(async() => {
      if (!this.state.selectedSupplier) {
        void 0;
      }
      let supplier = (await getSuppliers({name: this.state.selectedSupplier, way: 'hermes'}))[0];
      let state = Object.assign({}, this.state, {
        balance: supplier.balance.toString()
      });
      this.setState(state);
    }, 10000)
  }

  componentWillUnmount() {
    clearInterval(this.balanceInterval);
  }

  onModalCancel() {
    console.log("cancel");
  }

  async onModalConfirm(data) {
    if (!this.state.selectedSupplier) {
      alert('请选择一个商家');
      void 0;
    }
    if (Number(data) <= 0) {
      alert('充值金额必须为正数!')
    } else {
      let chargeResult = await supplierCharge(this.state.selectedSupplier, data);
      let state = Object.assign({}, this.state, {
        balance: chargeResult.balance.toString()
      });
      this.setState(state);
    }
  }

  async initSuppliers() {
    let suppliers = await getSuppliers();
    let tmp = suppliers.map((supplier) => {
      return {
        value: supplier.code,
        label: supplier.name || supplier.code
      };
    });
    let state = Object.assign({}, this.state, {suppliers: tmp});
    this.setState(state);
  }

  async handleSupplierSelected(value) {
    let supplier = (await getSuppliers({name: value, way: 'hermes'}))[0];
    let state = Object.assign({}, this.state, {
      balance: supplier.balance.toString(),
      selectedSupplier: value
    });
    this.setState(state);
  }

}

export {
  SupplierBilling,
  SupplierManage,
  SupplierProducts
}
