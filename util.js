const fs = require("fs")
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

let get_token_obj = async (script, exp, strike, cepe) => {
    return await get_token_with_symbol_exchange(script + exp + strike.toString() + cepe, "NFO")
}


module.exports = { get_token_obj }