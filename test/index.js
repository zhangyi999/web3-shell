
const {
    newWeb3,
    setDefaultProvider,
    initWeb3
} = require('../dist')


const node1 = newWeb3('https://bsc-dataseed1.binance.org')

async function main() {
    
    console.log(
        await node1.eth.getBalance("0xc1B48D563F85cD36D94bA190FB8222015FD0DBF7")
    )
}

main()
