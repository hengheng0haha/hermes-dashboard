'use strict'

require('date-utils')
import React, {Component} from 'react';

class Table extends Component {
    render() {
        let rows = this.props.data.map((data) => {
            return (
                <TableRow show={this.props.show} data={data}/>
            )
        });
        return (
            <div>
                <table className="am-table am-table-striped am-table-hover table-main">
                    <thead>
                    <tr>
                        {this.props.names.map((name) => {
                            return <th>{name}</th>
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
                <TablePaging
                    onFirstPage={this.props.paging.onFirstPage}
                    onPrePage={this.props.paging.onPrePage}
                    onNextPage={this.props.paging.onNextPage}
                    onLastPage={this.props.paging.onLastPage}/>
            </div>
        )
    }
}

class TableRow extends React.Component {

    render() {
        var data = this.props.data;
        return (
            <tr onClick={this.handleOrderDetail}>
                {this.props.show.map((item) => {
                    return (
                        <td>{item.endsWith('date') ? (new Date(data[item]).toFormat('YYYY-MM-DD HH24:MI:SS')) : data[item]}</td>);
                })}
            </tr>
        );
    }

}

class TablePaging extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            total: 0,
            current: 1,
        }
    }

    render() {
        let totalPage = Math.ceil(this.state.total / this.props.pageSize);
        let paging = [
                {
                    title: '第一页',
                    click: this.props.onFirstPage,
                    className: 'am-pagination-first'
                },
                {
                    title: '上一页',
                    click: this.props.onPrePage,
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
                当前第{this.state.current}/{totalPage}页,
                共{this.state.total}条记录
                <div className="am-fr">
                    <ul data-am-widget="pagination" className="am-pagination am-pagination-default">
                        {paging.map((item) => {
                            let className = item.className;
                            if (className.endsWith('prev') || className.endsWith('first')) {
                                if (this.state.current == 1) {
                                    className += ' am-disabled';
                                }
                            } else {
                                if (totalPage == 0 || this.state.current == totalPage) {
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

export default Table;