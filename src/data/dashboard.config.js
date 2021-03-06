/**
 * Created by Baxter on 2016/5/31.
 */

const DEBUG = false;

const hermes = {
  host: DEBUG ? '172.16.10.20' : '172.16.10.60',
  port: '8080'
};

const cassandra = {
  nodes: DEBUG ? ['172.16.10.20'] : ['172.16.10.40'],
  user: DEBUG ? '' : 'cassandra',
  password: DEBUG ? '' : 'cassandra'
};

export {hermes, cassandra};
