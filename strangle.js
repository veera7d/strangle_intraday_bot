
const util = require("./util");
const { place_order, is_order_executed, get_ltp } = require("./orders");
const constants = require("./constants");
const fs = require("fs");
const requests = require("./requests");

const DCN = 100;

const script = constants.scripts.FINNIFTY;
const expiry = "29AUG23";
const lots = 3;

let orders = [];
let day_SL_rupees = -200;
let booked_pnl = 0;

let CE = {
    leg: "CE",
    ltp: 0,
    strike: 19900,
    token_obj: null,
    locked: false,
    order_id: null,
    pnl: 0,
    entry: 0
}

let PE = {
    leg: "PE",
    ltp: 0,
    strike: 19900,
    token_obj: null,
    locked: false,
    order_id: null,
    pnl: 0,
    entry: 0
}

const strike_update = async (CE_PE, strike_diff) => {
    CE_PE.strike = CE_PE.strike + strike_diff;
    CE_PE.token_obj = await util.get_token_obj(script, expiry, CE_PE.strike, CE_PE.leg);
}


const update_ltps = async () => {
    CE.ltp = await get_ltp(CE.token_obj);
    PE.ltp = await get_ltp(PE.token_obj);
}

const risk_on_off = () => {
    if (CE.strike - PE.strike > DCN) {
        //risk_on
        return true;
    } else {
        //risk_off
        return false;
    }
}

const exit_all = async () => {
    //await place(CE, constants.order_action.BUY);
    orders.push({ leg: CE.leg, action: constants.order_action.BUY, ltp: CE.ltp, strike: CE.strike });

    //await place(PE, constants.order_action.BUY);
    orders.push({ leg: PE.leg, action: constants.order_action.BUY, ltp: PE.ltp, strike: PE.strike });
}

const calculate_PNL = () => {
    CE.pnl = CE.entry - CE.ltp;
    PE.pnl = PE.entry - PE.ltp;
    process.stdout.write(" CE " + CE.ltp + " PE " + PE.ltp + " TPNL " + ((booked_pnl + CE.pnl + PE.pnl) * constants.lot_size[script]).toFixed(2).toString() + "         ");
    process.stdout.write('\r');
}

const place = async (now, action) => {
    //orders.push({ leg: CE.leg, action: constants.order_action.SELL, ltp: CE_PE.ltp });
    now.locked = true;
    try {
        let response = await place_order(now.token_obj, action, lots);
        now.order_id = response.order_res.data.orderid;
        console.log("order placed ", action, now)
    }
    catch (exception) {
        console.log("exception in place order ", action, exception);
    }
    now.locked = false;
}

const adjust = async (CE_PE, strike_diff) => {

    console.log("adjust riskon ", risk_on_off(), strike_diff);
    //square corrent leg;
    //await place(CE_PE, constants.order_action.BUY);
    orders.push({ leg: CE_PE.leg, action: constants.order_action.BUY, ltp: CE_PE.ltp, strike: CE_PE.strike });
    booked_pnl = booked_pnl + CE_PE.pnl;
    //change the strike
    strike_update(CE_PE, strike_diff);
    await update_ltps();

    // open adjusted leg;
    //await place(CE_PE, constants.order_action.SELL);
    orders.push({ leg: CE_PE.leg, action: constants.order_action.SELL, ltp: CE_PE.ltp, strike: CE_PE.strike });
    CE_PE.entry = CE_PE.ltp;

    fs.promises.writeFile("./savestate.json", JSON.stringify({ "CE": CE, "PE": PE, 'orders': orders }));
}

let rules = async () => {
    await update_ltps();
    calculate_PNL();
    if ((booked_pnl + CE.pnl + PE.pnl) * constants.lot_size[script] < day_SL_rupees) {
        await exit_all()
        return;
    }
    if (CE.ltp >= 2 * PE.ltp) {
        (risk_on_off() === true) ? await adjust(PE, constants.steps[script]) : await adjust(CE, constants.steps[script]);
    } else if (PE.ltp >= 2 * CE.ltp) {
        (risk_on_off() === true) ? await adjust(CE, -constants.steps[script]) : await adjust(PE, -constants.steps[script]);
    }
    setTimeout(async () => {
        await rules();
        fs.promises.writeFile("./savestate.json", JSON.stringify({ "CE": CE, "PE": PE, 'orders': orders }));
    }, 1000);
}

const init = async () => {
    CE.token_obj = await util.get_token_obj(script, expiry, CE.strike, "CE");
    PE.token_obj = await util.get_token_obj(script, expiry, PE.strike, "PE");
    await update_ltps();
    //await place(CE, constants.order_action.SELL);
    orders.push({ leg: CE.leg, action: constants.order_action.SELL, ltp: CE.ltp, strike: CE.strike });
    CE.entry = CE.ltp;
    //await place(PE, constants.order_action.SELL);
    orders.push({ leg: PE.leg, action: constants.order_action.SELL, ltp: PE.ltp, strike: PE.strike });
    PE.entry = PE.ltp;
    await rules();
    fs.promises.writeFile("./savestate.json", JSON.stringify({ "CE": CE, "PE": PE, 'orders': orders }));
}

init();