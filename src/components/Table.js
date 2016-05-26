'use strict';

require('date-utils');
import React, {Component} from 'react';

class Table extends Component {

  static propTypes = {
    names: React.PropTypes.array,
    onFirstPage: React.PropTypes.func,
    onPrePage: React.PropTypes.func,
    onNextPage: React.PropTypes.func,
    onLastPage: React.PropTypes.func,
    pageSize: React.PropTypes.number,
    rows: React.PropTypes.array,
    currentPage: React.PropTypes.number,
    totalDataCount: React.PropTypes.number
  };

  static defaultProps = {
    names: [],
    paging: {},
    pageSize: 10,
    rows: [],
    currentPage: 0,
    totalDataCount: 0
  };


  constructor(props) {
    super(props);
  }

  render() {
    let body = this.props.rows.map((row) => {
      return (<TableRow {...{
        show: Object.keys(this.props.names),
        data: row
      }}/>)
    });

    return (
      <div>
        <table className="am-table am-table-striped am-table-hover table-main">
          <thead>
          <tr>
            {Object.keys(this.props.names).map((name) => {
              return <th>{this.props.names[name]}</th>
            })}
          </tr>
          </thead>
          <tbody>
          {body}
          </tbody>
        </table>
        <TablePaging
          onFirstPage={this.props.onFirstPage}
          onPrevPage={this.props.onPrevPage}
          onNextPage={this.props.onNextPage}
          onLastPage={this.props.onLastPage}
          current={this.props.currentPage || 1}
          total={this.props.totalDataCount}
          pageSize={this.props.pageSize || 10}
        />
      </div>
    );
  }

}

class TableRow extends React.Component {

  static propTypes = {
    data: React.PropTypes.array,
    show: React.PropTypes.array
  };

  static defaultProps = {
    data: [],
    show: []
  };

  render() {
    var data = this.props.data;
    return (
      <tr>
        {this.props.show.map((item) => {
          let cell = new Date(data[item]);
          if (cell == 'Invalid Date') {
            cell = data[item];
          } else {
            cell = cell.toFormat('YYYY-MM-DD HH24:MI:SS');
          }
          return (
            <td>{cell}</td>);
        })}
      </tr>
    );
  }

}

class TablePaging extends React.Component {

  static propTypes = {
    onFirstPage: React.PropTypes.func,
    onPrePage: React.PropTypes.func,
    onNextPage: React.PropTypes.func,
    onLastPage: React.PropTypes.func,
    total: React.PropTypes.number,
    current: React.PropTypes.number,
    pageSize: React.PropTypes.number
  };

  static defaultProps = {
    total: 0,
    current: 0
  };

  render() {
    let totalPage = Math.ceil((this.props.total / this.props.pageSize) || 0);
    let paging = [
      {
        title: '第一页',
        click: this.props.onFirstPage,
        className: 'am-pagination-first'
      },
      {
        title: '上一页',
        click: this.props.onPrevPage,
        className: 'am-pagination-prev'
      },
      {
        title: '下一页',
        click: this.props.onNextPage,
        className: 'am-pagination-next'
      },
      {
        title: '最末页',
        click: this.props.onLastPage,
        className: 'am-pagination-last'
      }
    ]
    return (
      <div className="am-cf">
        当前第{this.props.current}/{totalPage}页,
        共{this.props.total}条记录
        <div className="am-fr">
          <ul data-am-widget="pagination" className="am-pagination am-pagination-default">
            {paging.map((item) => {
              let className = item.className;
              if (className.endsWith('prev') || className.endsWith('first')) {
                if (this.props.current == 1) {
                  className += ' am-disabled';
                }
              } else {
                if (totalPage == 0 || this.props.current == totalPage) {
                  className += ' am-disabled';
                }
              }
              return <li className={className}><a style={{cursor: 'pointer'}}
                                                  onClick={item.click}>{item.title}</a></li>
            })}
          </ul>
        </div>
      </div>
    )
  }
}

class ButtonInTable extends Component {

  static propTypes = {
    children: React.PropTypes.array
  };

  static defaultProps = {
    children: []
  };

  render() {
    return (
      <div className="am-btn-toolbar">
        <div className="am-btn-group am-btn-group-xs">
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Table;
export {
  ButtonInTable
}
