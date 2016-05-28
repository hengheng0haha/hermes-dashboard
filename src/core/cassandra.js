/**
 * Created by Baxter on 2016/4/9.
 */

'use strict';

import * as driver from 'cassandra-driver';

const _nodes = ['172.16.10.20'];
const _user = "";
const _password = "";
const _keyspace = "hermes";

const authProvider = (_user === "" || _password === "") ? undefined : new driver.auth.PlainTextAuthProvider(_user, _password);

const client = new driver.Client({
  contactPoints: _nodes,
  authProvider,
});

const execute = (cql, params) => {
  return new Promise((resolve, reject) => {
    client.execute(cql, params, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  });
}

let solrQuery = (table, keyspace = 'hermes') => {
  return new SolrBuilder(keyspace, table);
};

class SolrBuilder {

  constructor(keyspace, table) {
    this._result = {
      q: '*:*',
      fq: [],
      start: 0
    };
    this._count = false;
    this._limit = 300;
    this.keyspace = keyspace || _keyspace;
    this.table = table;
  }

  q(qk, qv) {
    this._result.q = `${qk || '*'}:${qv || '*'}`;
    return this;
  }

  fq(fqk, fqv) {
    if (Array.isArray(fqk) && fqv === undefined) {
      fqk.forEach((item) => {
        this._result.fq.push(item);
      });
      return this;
    } else if (typeof(fqk) === 'string') {
      this._result.fq.push(`${fqk}:${fqv}`);
      return this;
    }
    throw new TypeError;
  }

  start(start) {
    if (Number.isSafeInteger(start)) {
      this._result.start = start;
      return this;
    }
    throw new TypeError;
  }

  facet(facet) {
    if (typeof(facet) === 'object') {
      this._result['facet'] = facet;
      return this;
    }
    throw new TypeError;
  }

  sort(sort, type) {
    if (typeof(sort) === 'string') {
      if (type === undefined) {
        this._result['sort'] = sort;

      } else {
        this._result['sort'] = `${sort} ${type || 'asc'}`;
      }
      return this;
    }
    throw new TypeError;
  }


  limit(limit) {
    if (Number.isSafeInteger(limit)) {
      this._limit = limit;
      return this;
    }
    throw new TypeError;
  }

  count(count) {
    if (typeof(count) === 'boolean') {
      this._count = count;
      return this;
    }
    throw new TypeError;
  }

  toString() {
    return JSON.stringify(this._result);
  }

  isCount() {
    return this._count;
  }

  getLimit() {
    return this._limit;
  }

  result() {
    return this._result;
  }

  build() {
    let query = `SELECT ${this._count ? 'count(*)' : '*'} FROM ${this.keyspace}.${this.table} WHERE solr_query='${JSON.stringify(this._result)}' ${(this._result['facet'] === undefined && !this._count) ? ('LIMIT ' + this._limit) : ''};`;
    return query;
  }

}

export {
  solrQuery,
  client,
  execute
}
