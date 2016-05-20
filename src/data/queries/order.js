/**
 * Created by Baxter on 2016/5/19.
 */
import {
  GraphQLString as StringType,
  GraphQLList as List
} from 'graphql';
import OrderType from '../types/OrderType';
import {execute} from '../../core/cassandra';

const order = {
  type: new List(OrderType),
  args: {
    tbOrderId: {
      type: StringType
    }
  },
  async resolve({request}) {
    console.log(request.body)
    let results = (await execute("SELECT * FROM hermes.orders WHERE tb_order_id = ?", ['T1605121800553190003'])).rows;
    console.log(results);
    return results.map((row) => {
      return {
        id: row.id,
        tbOrderId: row.tb_order_id,
        status: row.status
      }
    })
  }
};

export default order;
