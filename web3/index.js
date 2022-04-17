import {
    setDefaultProvider,
    initWeb3
} from './initWeb3'

export * from './erc20'
export * from './multiCall'
export * from './sendTransaction'
export * as utils from './utils'

export * from './config'
export * from './BigNumber'

export * from './initWeb3'

export * from './chain_id.json'

export const decimalHex = '0x' + (1e18).toString(16) 


function pollingBlock( ) {
    let start = false
    let newBlock = 0
    let callMap = new Map();
    let stopTime;
    // poll 事件 索引
    async function poll(isUpdate) {
        const web3 = initWeb3()
        // 这里用 原生 subscribe 方法 和 getBlock 都是 7 个块通知一次
        // 要优化 就是 用 wss
        // console.log('poll')
        try {
            const {number:blockNumberChain} = await web3.eth.getBlock('latest')
            // console.log(newBlock, blockNumberChain, callMap)
            if ( newBlock < blockNumberChain || isUpdate) {
                // console.log(callMap.size)
                newBlock = blockNumberChain
                for (let [key] of callMap) {
                    if ( key instanceof Function ) {
                        key(newBlock)
                    }
                }
            }
        } catch(error) {
            console.log(error.message)
            // 区块同步报错 通知客户端
        }
        if ( start ) {
            stopTime = setTimeout(poll, 3000)
        }
    }
    return {
        start(call) {
            if ( !call ) return 
            if ( start === false ) {
                // console.log(call)
                start = true
                poll(true)
            }
            if ( callMap.has(call) ) return
            callMap.set(call, true)
        },
        remove(call) {
            if ( !call ) return
            if ( callMap.has(call) ) {
                callMap.delete(call)
            }
            if ( callMap.size === 0 ) {
                start = false
                clearTimeout(stopTime)
            }
        },
        getNewBlock: () => newBlock
    }
    
}

export const getBlock = pollingBlock()

/**
创建 web3 为容器

链接 walletConnect： new walletConnect => provider => provider 添加到 web3
退出 walletConnect： on "disconnect" callback => setDefault provider => 添加到 web3

链接 metamask ：获取 web3 provider ，setProvider
退出 metamask ：监听 account => !account[0] === true => 设置 default provider

walletConnect 链接后 不会改变 监听 account
metamask 链接后 要监听 退出 change

chainId 监听不用改变

 */


export default function getWeb3(defaultChian) {
    setDefaultProvider(defaultChian)
    // 这里的挂载可能会 导致 chainId 为 null
    return initWeb3()
}



