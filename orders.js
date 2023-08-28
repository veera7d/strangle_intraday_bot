const requests = require("./requests");
const constants = require("./constants");

const get_order_body = (token_obj, oaction, quantity) => {
    return {
        "variety": "NORMAL",
        "tradingsymbol": token_obj.symbol,
        "symboltoken": token_obj.token,
        "transactiontype": oaction,
        "exchange": token_obj.exch_seg,
        "ordertype": "MARKET",
        "producttype": "INTRADAY",
        "duration": "DAY",
        //"price": price,
        //"triggerprice": price,
        "squareoff": "0",
        "stoploss": "0",
        "quantity": quantity.toString(),
    }
}

const place_order = async (token_obj, order_action, lots) => {
    let quantity = constants.lot_size[token_obj.name] * lots;
    try {
        let order_res = await requests.place_order(get_order_body(token_obj, order_action, quantity));
        //console.log(order_res);
        return { order_res: order_res, token_obj: token_obj };
    } catch (ex) {
        console.log("order_util place order", ex);
        throw ex;
    }
}

const is_order_executed = async (orderid) => {
    let out = false
    try {
        let order_res = await requests.get_orderbook();
        //console.log("order_res: ----", order_res.data)
        for (let order of order_res.data) {
            console.log("order.orderid:", order.orderid)
            if (order.orderid == orderid && order.status === constants.order_status_list.executed) {
                out = true
            }
        }
    }
    catch (exception) {
        console.log("error while getting order book", exception);
    }
    return out;
}

const ltp_body = (token_obj)=>{
    return {
        exchange:token_obj.exch_seg,
        symboltoken:token_obj.token,
        tradingsymbol:token_obj.symbol
    }
}

const get_ltp = async (token_obj) => {
    try {
        let ltp_res_body = await requests.get_ltp_data(ltp_body(token_obj));
        return ltp_res_body.data.ltp;
    }
    catch (ex) {
        console.log("exception in getltp ", ex);
    }
}

module.exports = { place_order, is_order_executed, get_ltp };