const fs = require("fs")
const orders = require("./orders");
const constants = require("./constants");

const get_token_with_symbol_exchange = async (symbol, exchange) => {
    try {
        let data = await fs.promises.readFile("./response.json", 'utf8');
        let j_ob = JSON.parse(data)
        return j_ob.find(obj => obj.symbol === symbol && obj.exch_seg === exchange)
    }
    catch (err) {
        return err
    }
}

const get_ATM_strike = (script, ltp) => {
    step = constants.steps[script];
    rem = ltp % step;
    base = ltp - rem;
    if (ltp > base + (step / 2)) {
        return base + step;
    }
    return base;
}

let get_token_obj = async (script, exp, strike, cepe) => {
    return await get_token_with_symbol_exchange(script + exp + strike.toString() + cepe, "NFO")
}

let get_option_chain_ltps = async (script, exp, no_of_strikes, CE_PE) => {
    try {
        let script_ltp = await orders.get_ltp(await get_token_with_symbol_exchange(script, constants.exchanges.NSE));
        let atm = get_ATM_strike(script, script_ltp);
        if (CE_PE === constants.option_types.CE) {
            atm = atm + (10 * constants.steps[script]);
        } else if (CE_PE === constants.option_types.PE) {
            atm = atm - (10 * constants.steps[script]);
        }
        let strikes = [];
        let list = [];
        let promises = [];
        for (let i = 0; i < no_of_strikes; i++) {
            let strike = atm;
            strikes.push(strike);
            let token_obj = await get_token_obj(script, exp, strike, CE_PE);
            promises.push(orders.get_ltp(token_obj));
            list.push({ strike, token_obj });
            atm = (CE_PE === constants.option_types.CE) ? atm - constants.steps[script] : atm + constants.steps[script];
        }
        let values = await Promise.all([...promises]).then(async (values) => {
            for (let i = 0; i < values.length; i++) {
                if (values[i] == undefined) {
                    values[i] = await orders.get_ltp(list[i].token_obj);
                }
            }
            console.log(values);
            return [strikes,values];
        }).catch(async (exception) => console.log("exception: ", exception))
        return values;
    }
    catch (exception) {
        console.log("get_option_chain_ltps exception: ", exception);
    }
}

let get_near_number = (value, list) => {
    let values = list[1];
    let diff = []
    let min = 100;
    let min_index = -1;
    for (let i = 0; i < values.length; i++) {
        let d = Math.abs(values[i] - value);
        if (d < min) {
            min = d;
            min_index = i;
        }
        diff.push(d);
    }
    return list[0][min_index];
}

let get_strike_near_to_price = async (script, exp, price, CE_PE) => {
    let CE_PE_values = { PE: null, CE: null };
    let CE_PE_ltps = { PE: null, CE: null };
    if (CE_PE == constants.option_types.CE) {
        CE_PE_values.CE = await get_option_chain_ltps(script, exp, 15, constants.option_types.CE);
    } else if (CE_PE == constants.option_types.PE) {
        CE_PE_values.PE = await get_option_chain_ltps(script, exp, 15, constants.option_types.PE);
    } else {
        CE_PE_values.CE = await get_option_chain_ltps(script, exp, 15, constants.option_types.CE);
        CE_PE_values.PE = await get_option_chain_ltps(script, exp, 15, constants.option_types.PE);
    }
    if (CE_PE_values.CE != null) {
        CE_PE_ltps.CE = get_near_number(price, CE_PE_values.CE);
    }
    if (CE_PE_values.PE != null) {
        CE_PE_ltps.PE = get_near_number(price, CE_PE_values.PE);
    }
    return CE_PE_ltps;
}

get_strike_near_to_price(constants.scripts.NIFTY,"31AUG23",35)
.then(value=>console.log(value));

module.exports = { get_token_obj, get_strike_near_to_price }