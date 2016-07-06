'use strict';

import fetch from 'node-fetch';
import fs from 'fs';
import moment from 'moment-timezone';

import {solrQuery, execute} from './cassandra';
import {hermesApi, ACCOUNT_COLUMNS} from '../data/init';
import {getDateRange, getCardsPriceBySupplier} from '../core/serverUtils';
import {types} from 'cassandra-driver';

const pageSize = 300;
const outPath = '/home/account/';
const TZ = 'Asia/Shanghai';
const FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS';

/**
 * 为所有商家生成一个时间范围内的对账文件
 * 文件名格式: ${coopId}_YYYYMMDDHHmmss.txt
 *
 * @param dateStart[Date] 开始时间
 * @param dateEnd[Date]   结束时间
 * @param supplier[Object] 商家
 */
let generate = async(dateStart, dateEnd, supplier) => {
  if (supplier) {
    return await generateAccountBySupplier(supplier, dateStart, dateEnd);
  } else {
    let suppliers = await getAllSupplier();
    return await Promise.all(suppliers.map(async(supplier) => {
      return await generateAccountBySupplier(supplier, dateStart, dateEnd)
    }));
  }

};

let info = (date, coopId) => {
  let fileName = getAccountFileName(date, coopId);
  let path = `${outPath}${fileName}`;
  if (fs.existsSync(path)) {
    let stat = fs.lstatSync(path);
    console.log(stat);
    let createTime = moment.tz(stat.birthtime, TZ).format(FORMAT);
    let size = stat.size;
    return {
      fileName,
      path,
      createTime,
      size
    }
  } else {
    return {};
  }
};

let getAccountFileName = (date, coopId) => {

  return `${coopId}_${moment(date).format('YYYYMMDD')}.txt`;
};

/**
 * 为某一个商家生成一个时间范围内的一个对账文件
 *
 * @param supplier[Object] 商家对象
 * @param dateStart[Date]  开始时间
 * @param dateEnd[Date]    结束时间
 */
let generateAccountBySupplier = (supplier, dateStart, dateEnd) => {
  return new Promise(async(resolve, reject) => {
    try {
      let CARDS = await getCardsPriceBySupplier(supplier.supplierName);
      let dateRange = getDateRange(dateStart, dateEnd);
      let rows = [],
        count,
        countCardSum = types.BigDecimal.fromNumber(0);
      count = (await getCount(supplier.coopId, dateRange)).rows[0].count;
      let pageCount = Math.ceil(count / pageSize);
      for (let i = 0; i < pageCount; i++) {
        let builder = solrQuery('orders');
        let query = builder
          .q('create_date', dateRange)
          .fq('coop_id', supplier.coopId)
          .fq('status', 'SUCCESS')
          .start(i * pageSize)
          .limit(pageSize)
          .build();
        let orderRows = (await execute(query)).rows;
        orderRows.forEach((row) => {
          let cardPrice = String(CARDS[row.card_id]);
          countCardSum = countCardSum.add(types.BigDecimal.fromString(cardPrice));

          let tmp = getAccountRow(row);
          tmp.push(cardPrice);
          rows.push(tmp.join('|'));
        })
      }
      rows.unshift(`${count}|${countCardSum}`);

      let fileName = `${outPath}${getAccountFileName(dateStart, supplier.coopId)}`;
      console.log('save', fileName);
      let file = fs.createWriteStream(fileName, {defaultEncoding: 'utf8'});
      file.write(rows.join('\n'), 'utf8', () => {
        console.log('finish');
        file.close();
        resolve({success: true, fileName})
      });
    } catch (e) {
      reject(e);
    }
  })

};

/**
 * 把一条order对象转化为一条对账记录
 * 格式: 商家订单号|内部订单号|产品编号|手机号码|订单创建时间|订单完成时间|客户支付金额
 *
 * @param orderRow[Object] order对象
 * @returns [String]       一条对账记录
 */
let getAccountRow = (orderRow) => {
  return ACCOUNT_COLUMNS.map((item) => {

    return item.endsWith('date') ? moment(new Date(orderRow[item])).format('YYYYMMDDHHmmssSSS') : orderRow[item];
  })
}

/**
 * 获取一段时间内某一个商家的成功订单总数
 *
 * @param coopId[String]        商家编号
 * @param range[String]         时间范围
 *
 * @returns [Promise]
 */
let getCount = (coopId, range) => {
  return execute(
    solrQuery('orders')
      .q('create_date', range)
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

export {
  generate,
  info,
  outPath
};
