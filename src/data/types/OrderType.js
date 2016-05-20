/**
 * Created by Baxter on 2016/5/19.
 */

import {
  GraphQLObjectType as ObjectType,
  GraphQLString as StringType
} from 'graphql'

const OrderType = new ObjectType({
  name: 'Order',
  fields: {
    id: {type: StringType},
    tbOrderId: {type: StringType},
    status: {type: StringType}
  }
})

export default OrderType;
