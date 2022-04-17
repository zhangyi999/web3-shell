
const {
    newWeb3,
    setDefaultProvider,
    initWeb3
} = require('../dist')

// 1.13.15.154
const node1 = newWeb3('http://1.13.15.154:18545')
// https://eth-mainnet.alchemyapi.io/v2/Efj4nBC3ZWIMTt_FnL68RCYaeVO9JWhi
async function main() {
    
    console.log(
        await node1.eth.getBalance("0xc1B48D563F85cD36D94bA190FB8222015FD0DBF7")
    )
}

main()
