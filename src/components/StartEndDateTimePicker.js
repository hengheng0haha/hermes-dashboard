/**
 * Created by Baxter on 2016/5/24.
 */
'use strict';

import React, {Component} from 'react';

class StartEndDateTimePicker extends React.Component {

  static propTypes = {
    startName: React.PropTypes.string,
    endName: React.PropTypes.string,
    startValue: React.PropTypes.string,
    endValue: React.PropTypes.string,
  };

  static defaultProps = {
    startName: '开始时间',
    endName: '结束时间',
    startValue: '',
    endValue: ''
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="am-u-sm-12">
        <div className="am-alert am-alert-danger" id="my-alert"
             style={{display: 'none'}}>
          <p>开始日期应小于结束日期！</p>
        </div>
        <div className="am-g">
          <div className="am-u-sm-6">
            <button type="button" className="am-btn am-btn-default am-margin-right" id="my-start">
              {this.props.startName}
            </button>
            <input ref="start" className="am-form-field" type="text"
                   id="my-startDate"
                   value={this.props.startValue} disabled/>
          </div>
          <div className="am-u-sm-6">
            <button type="button" className="am-btn am-btn-default am-margin-right" id="my-end">
              {this.props.endName}
            </button>
            <input ref="end" className="am-form-field" type="text"
                   id="my-endDate"
                   value={this.props.endValue} disabled/>
          </div>
        </div>
      </div>
    )
  }

  getDateTime() {
    return {
      start: this.refs.start.value,
      end: this.refs.end.value
    }
  }

  componentDidMount() {
    $(function () {
      var startDate = '';
      var endDate = '';
      var $alert = $('#my-alert');
      $('#my-start').datepicker().on('changeDate.datepicker.amui', function (event) {
        if (endDate !== '' && event.date.valueOf() > endDate.valueOf()) {
          $alert.find('p').text('开始日期应小于结束日期！').end().show();
        } else {
          $alert.hide();
          startDate = new Date(event.date);
          $('#my-startDate').val($('#my-start').data('date'));
        }
        $(this).datepicker('close');
      });

      $('#my-end').datepicker().on('changeDate.datepicker.amui', function (event) {
        if (startDate !== '' && event.date.valueOf() < startDate.valueOf()) {
          $alert.find('p').text('结束日期应大于开始日期！').end().show();
        } else {
          $alert.hide();
          endDate = new Date(event.date);
          $('#my-endDate').val($('#my-end').data('date'));
        }
        $(this).datepicker('close');
      });
    });
  }
}

export default StartEndDateTimePicker
