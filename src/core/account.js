'use strict'

require('date-utils');

import fetch from 'node-fetch';
import fs from 'fs';
import {solrQuery, execute} from './cassandra';
import {hermesApi, ACCOUNT_COLUMNS} from '../data/init';

const pageSize = 300;
const outPath = 'E:\\'

/**
 * 为所有商家生成一个时间范围内的对账文件
 * 文件名格式: ${coopId}_YYYYMMDDHH24MISS.txt
 *
 * @param dateStart[Date] 开始时间
 * @param dateEnd[Date]   结束时间
 */
let generate = async(dateStart, dateEnd) => {
  let suppliers = await getAllSupplier();
  return await Promise.all(suppliers.map((supplier) => {
    return generateAccountBySupplier(supplier, dateStart, dateEnd)
  }));
}

/**
 * 为某一个商家生成一个时间范围内的一个对账文件
 *
 * @param supplier[Object] 商家对象
 * @param dateStart[Date]  开始时间
 * @param dateEnd[Date]    结束时间
 */
let generateAccountBySupplier = async(supplier, dateStart, dateEnd) => {
  let startDateStr = `${dateStart.toYMD('-')}T00:00:00Z`,
    endDateStr = `${dateEnd.addHours(24).toYMD('-')}T00:00:00Z`;
  let rows = [],
    count,
    countSum = 0;
  try {
    count = (await getCount(supplier.coopId, startDateStr, endDateStr)).rows[0].count;
  } catch (e) {
    console.log(e);
  }
  let pageCount = Math.ceil(count / pageSize);
  for (let i = 0; i < pageCount; i++) {
    let builder = solrQuery('order');
    let query = builder
      .q('create_date', `[${startDateStr} TO ${endDateStr}]`)
      .fq('coop_id', supplier.coopId)
      .fq('status', 'SUCCESS')
      .start(i * pageSize)
      .build();
    try {
      let orderRows = (await execute(query)).rows;
      orderRows.forEach((row) => {
        countSum += Number(row.sum);
        rows.push(getAccountRow(row));
      })
    } catch (e) {
      console.log(e)
    }
  }
  rows.unshift(`${count}|${countSum}|${supplier.balance == '-1' ? '*' : supplier.balance}`)

  let fileName = `${outPath}\\${supplier.coopId}_${(new Date()).toFormat('YYYYMMDDHH24MISS')}.txt`;
  console.log('save', fileName);
  return {
    success: fs.createWriteStream(fileName, {defaultEncoding: 'utf8'}).write(rows.join('\n')),
    fileName
  }
}

/**
 * 把一条order对象转化为一条对账记录
 * 格式: 商家订单号|内部订单号|产品编号|手机号码|订单创建时间|订单完成时间|客户支付金额
 *
 * @param orderRow[Object] order对象
 * @returns [String]       一条对账记录
 */
let getAccountRow = (orderRow) => {
  return (ACCOUNT_COLUMNS.map((item) => {
    return item.endsWith('date') ? (new Date(orderRow[item])).toFormat('YYYYMMDDHH24MISSLL') : orderRow[item];
  })).join('|')
}

/**
 * 获取一段时间内某一个商家的成功订单总数
 *
 * @param coopId[String]        商家编号
 * @param startDateStr[String]  起始时间的字符串
 * @param endDateStr[String]    结束时间的字符串
 *
 * @returns [Promise]
 */
let getCount = (coopId, startDateStr, endDateStr) => {
  return execute(
    solrQuery('order')
    .q('create_date', `[${startDateStr} TO ${endDateStr}]`)
    .fq('coop_id', coopId)
    .fq('status', 'SUCCESS')
    .count(true)
    .build()
  );
}

/**
 * 获取所有的商家
 *
 * @returns Promise
 */
let getAllSupplier = () => {
  return new Promise((resolve, reject) => {
    fetch(`${hermesApi}/do/supplier/get_supplier`, {method: 'POST', body: JSON.stringify({all: true})})
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.code !== '0') {
          reject(json)
        } else {
          resolve(JSON.parse(json.result.value))
        }
      })
  })
}

export default generate;
