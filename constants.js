const steps = {
    NIFTY: 50,
    BANKNIFTY: 100,
    FINNIFTY: 50
}

const lot_size = {
    NIFTY: 50,
    BANKNIFTY: 15,
    FINNIFTY: 40
}

const scripts = {
    NIFTY: "NIFTY",
    BANKNIFTY: "BANKNIFTY",
    FINNIFTY: "FINNIFTY"
}

const option_types = {
    PE: "PE",
    CE: "CE",
    ITM: "ITM",
    OTM: "OTM",
    ATM: "ATM"
}

const order_types = {
    MARKET: "MARKET",
    LIMIT: "LIMIT",
    STOPLOSS_LIMIT: "STOPLOSS_LIMIT"
}

const order_action = {
    BUY: "BUY",
    SELL: "SELL"
}

const command_const = {
    START: "START",
    BLOCK: "BLOCK",
    CONDITION: "CONDITION",
    RULE: "RULE",
    END: "END",
    TIME: "TIME",
    ENTER: "ENTER",
    EXIT: "EXIT",
    MODIFY: "MODIFY"
}

let auth_tokens = {
    client_code: "D538599",
    api_key: "TIlue2pQ",
    auth_token: "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkQ1Mzg1OTkiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwidG9rZW4iOiJleUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUpFTlRNNE5UazVJaXdpWlhod0lqb3hOamt6TWpneE5URTNMQ0pwWVhRaU9qRTJPVE14T1RRNU1EY3NJbXAwYVNJNklqRmtZVGM0TURNMExUSmlNR010TkdNeE1TMDVNamRpTFRkbE5HVmxNMll6TjJWbE1DSXNJbTl0Ym1WdFlXNWhaMlZ5YVdRaU9qZ3NJbk52ZFhKalpXbGtJam9pTXlJc0luVnpaWEpmZEhsd1pTSTZJbU5zYVdWdWRDSXNJblJ2YTJWdVgzUjVjR1VpT2lKMGNtRmtaVjloWTJObGMzTmZkRzlyWlc0aUxDSm5iVjlwWkNJNk9Dd2ljMjkxY21ObElqb2lNeUo5LkhmOXNZT1lrd1hpNWMzMC1ka25CSXRWck9sUXFYRVAtSWFYRkZUczRLb0ZrNUF5Y1Rma3pRelo0bG1xeTJFWENRVVd5eEZRRUZnMEoxUjJzdlF5bTZBIiwiaWF0IjoxNjkzMTk0OTY3LCJleHAiOjE2OTMyODEzNjd9.zywRlz52M118haEj0yzxU809Sm9u0QD7mCToB3-mu00Ia1FxbD508HKidX_et1s7iY1CahT3UpILhPncTsR0ow",
    feed_token: "eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkQ1Mzg1OTkiLCJpYXQiOjE2OTMxOTQ5NjcsImV4cCI6MTY5MzI4MTM2N30.ESxIQZZkk3f__WKU8kflV68tlwaXhixkZqkX3a-fLPJCMcwMUmjAUQPxR_19oBit3MElzmwkYhH4zZjEW4kwEQ",
    refresh_token: "eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlbiI6IlJFRlJFU0gtVE9LRU4iLCJpYXQiOjE2OTMxOTQ5Njd9.q4f7agxx23cJjux7qYtp1O1nJq44QFfqOlXvXDkL2UjNg2A3O_8zq5NB7b9jwRiotMAlXBs-KRlDDBJwgPkE4g"
}

const get_auth_tokens = () => {
    return auth_tokens;
}

const set_auth_tokens = (_auth_tokens) => {
    auth_tokens = _auth_tokens;
}

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

/*
https://smartapi.angelbroking.com/publisher-login?api_key=TIlue2pQ
http://localhost.com/
auth_token=eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkQ1Mzg1OTkiLCJyb2xlcyI6MCwidXNlcnR5cGUiOiJVU0VSIiwidG9rZW4iOiJleUpoYkdjaU9pSklVelV4TWlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKemRXSWlPaUpFTlRNNE5UazVJaXdpWlhod0lqb3hOamt6TWpneE5URTNMQ0pwWVhRaU9qRTJPVE14T1RRNU1EY3NJbXAwYVNJNklqRmtZVGM0TURNMExUSmlNR010TkdNeE1TMDVNamRpTFRkbE5HVmxNMll6TjJWbE1DSXNJbTl0Ym1WdFlXNWhaMlZ5YVdRaU9qZ3NJbk52ZFhKalpXbGtJam9pTXlJc0luVnpaWEpmZEhsd1pTSTZJbU5zYVdWdWRDSXNJblJ2YTJWdVgzUjVjR1VpT2lKMGNtRmtaVjloWTJObGMzTmZkRzlyWlc0aUxDSm5iVjlwWkNJNk9Dd2ljMjkxY21ObElqb2lNeUo5LkhmOXNZT1lrd1hpNWMzMC1ka25CSXRWck9sUXFYRVAtSWFYRkZUczRLb0ZrNUF5Y1Rma3pRelo0bG1xeTJFWENRVVd5eEZRRUZnMEoxUjJzdlF5bTZBIiwiaWF0IjoxNjkzMTk0OTY3LCJleHAiOjE2OTMyODEzNjd9.zywRlz52M118haEj0yzxU809Sm9u0QD7mCToB3-mu00Ia1FxbD508HKidX_et1s7iY1CahT3UpILhPncTsR0ow
feed_token=eyJhbGciOiJIUzUxMiJ9.eyJ1c2VybmFtZSI6IkQ1Mzg1OTkiLCJpYXQiOjE2OTMxOTQ5NjcsImV4cCI6MTY5MzI4MTM2N30.ESxIQZZkk3f__WKU8kflV68tlwaXhixkZqkX3a-fLPJCMcwMUmjAUQPxR_19oBit3MElzmwkYhH4zZjEW4kwEQ
refresh_token=eyJhbGciOiJIUzUxMiJ9.eyJ0b2tlbiI6IlJFRlJFU0gtVE9LRU4iLCJpYXQiOjE2OTMxOTQ5Njd9.q4f7agxx23cJjux7qYtp1O1nJq44QFfqOlXvXDkL2UjNg2A3O_8zq5NB7b9jwRiotMAlXBs-KRlDDBJwgPkE4g
*/

let headers = {
    'Content-Type': 'application/json',
    'X-ClientLocalIP': '192.168.168.168',
    'X-ClientPublicIP': '106.193.147.98',
    'X-MACAddress': 'fe80::216e:6507:4b90:3719',
    'Accept': 'application/json',
    'X-PrivateKey': get_auth_tokens().api_key,
    'X-UserType': 'USER',
    'X-SourceID': 'WEB',
    'Authorization': 'Bearer ' + get_auth_tokens().auth_token
}

const exchanges = {
    NSE: "NSE",
    BSE: "BSE",
    NFO: "NFO",
    MCX: "MCX"
}

const leg_status = {
    init: "init",
    open: "open",
    running: "running",
    closed: "closed"
}

const order_status_list = {
    complete: "complete",
    trigger_pending: "trigger pending",
    rejected: "rejected",
    cancelled: "cancelled"
}

module.exports = { order_status_list, leg_status, steps, scripts, option_types, get_auth_tokens, set_auth_tokens, order_action, order_types, headers, exchanges, months, lot_size, command_const }



/*
{
        "token": "26009",
        "symbol": "BANKNIFTY",
        "name": "BANKNIFTY",
        "expiry": "",
        "strike": "-1.000000",
        "lotsize": "-1",
        "instrumenttype": "",
        "exch_seg": "NSE",
        "tick_size": "-1.000000"
    },
    {
        "token": "26000",
        "symbol": "NIFTY",
        "name": "NIFTY",
        "expiry": "",
        "strike": "-1.000000",
        "lotsize": "-1",
        "instrumenttype": "",
        "exch_seg": "NSE",
        "tick_size": "-1.000000"
    }



    {
            "symboltoken": "52630",
            "symbolname": "BANKNIFTY",
            "instrumenttype": "OPTIDX",
            "priceden": "1.00",
            "pricenum": "1.00",
            "genden": "1.00",
            "gennum": "1.00",
            "precision": "2",
            "multiplier": "-1",
            "boardlotsize": "1",
            "exchange": "NFO",
            "producttype": "INTRADAY",
            "tradingsymbol": "BANKNIFTY29MAR2340200CE",
            "symbolgroup": "XX",
            "strikeprice": "40200.0",
            "optiontype": "CE",
            "expirydate": "29MAR2023",
            "lotsize": "25",
            "cfbuyqty": "0",
            "cfsellqty": "0",
            "cfbuyamount": "0.00",
            "cfsellamount": "0.00",
            "buyavgprice": "7.15",
            "sellavgprice": "6.60",
            "avgnetprice": "0.00",
            "netvalue": "-13.75",
            "netqty": "0",
            "totalbuyvalue": "178.75",
            "totalsellvalue": "165.00",
            "cfbuyavgprice": "0.00",
            "cfsellavgprice": "0.00",
            "totalbuyavgprice": "7.15",
            "totalsellavgprice": "6.60",
            "netprice": "0.00",
            "buyqty": "25",
            "sellqty": "25",
            "buyamount": "178.75",
            "sellamount": "165.00",
            "pnl": "-13.75",
            "realised": "-13.75",
            "unrealised": "-0.00",
            "ltp": "6.9",
            "close": "9.0"
        }
*/