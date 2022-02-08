import Web3 from 'web3'

import {
    DEFAULT_PRC,
    DEFAULT_CHAIN_ID,
    PROXY_ZERO_ADDRESS
} from './config'

let defaultProvider = {}

// 初始化 web3
// 设计逻辑的原则是步骤清晰
/**
 * 1. 在钱包里，有自己的 provider
 * 2. 没有钱包，构建自己的 provider，设置默认 provider
 * 3. 使用 walletContent 需要重新配置 provider 
 */

 export function setDefaultProvider ({rpc = DEFAULT_PRC, selectedAddress = PROXY_ZERO_ADDRESS, chainId = DEFAULT_CHAIN_ID}) {
    defaultProvider = {rpc, selectedAddress, chainId} 
}

// 单链模式
let web3

// getDefault provider
export function getDefaultProvider ( ) {
    return new Web3.providers.HttpProvider(
        defaultProvider.rpc,
        {
            ethereumNodeTimeout: 5000,
        }
    )
}

// set Provider
export function setProvider(realProvider) {
    web3 = new Web3(realProvider)
    if (!web3.currentProvider || !web3.currentProvider.selectedAddress) {
        let user = web3.currentProvider.accounts
        user = user? user[0] : defaultProvider.selectedAddress
        web3.currentProvider.selectedAddress = user
        // 默认 chainId 没有
        web3.currentProvider.chainId = defaultProvider.chainId
    }
    return web3
}

// get web3
export function initWeb3( ) {
    if ( web3 ) return web3
    return setProvider(
        getDefaultProvider()
    )
}

// 清空web3
export function reInitWeb3( ) {
    web3 = null
    return initWeb3( )
}

let cache = {}
export function nweContract( address, abi ) {
    const web3 = initWeb3()
    const owner = web3.currentProvider.selectedAddress
    let contract = cache[address]
    if ( cache[address] ) {
        if (  contract.options.from !== owner ) {
            contract.options.from = owner
        }
        return contract
    }
    contract = new web3.eth.Contract(abi)
    contract.options.address = address
    if (owner) {
        contract.options.from = owner
    }
    cache[address] = contract
    return contract
}

export const newWeb3 = rpc => {
    const web3 = new Web3(
        new Web3.providers.HttpProvider(
            rpc,
            {
                ethereumNodeTimeout: 5000,
            }
        )
    )
    web3.addPrivateKey = privateKey => web3.eth.accounts.wallet.add(privateKey);
    return web3
   
}
