import {initWeb3, nweContract} from './initWeb3'

import MULTI_CALL from './ABI/MULTI_CALL'
import {multiCallAddress} from './config'

function proxy(obj, key, call) {
    Object.defineProperty(obj, key, {
        get: () => call(),
        enumerable : true,
        configurable : false
    })
}

function MultiCallContract() {
    const web3 = initWeb3()
    const chainId = web3.currentProvider.chainId
    const address = multiCallAddress[chainId*1]
    if ( !address ) throw new Error(`chainId ${chainId} multi_call address not configured`)
    return nweContract( address, MULTI_CALL )
}

export async function multiCallArr(methodsArr, ...options) {
    const multiCallContract = MultiCallContract( )
    const calls = []
    const len = methodsArr.length
    for(let i = 0; i < len; i++) {
        const v = methodsArr[i]
        calls.push([
            v._parent._address,
            v.encodeABI()
        ])
    }
    const res = await multiCallContract.methods.aggregate(calls).call(...options)
    const web3 = initWeb3()
    return res[1].map((hex,i) => {
        const v = methodsArr[i]
        const result = web3.eth.abi['decodeParameters'](v._method.outputs, hex)
        if (result.__length__ === 1) {
            return result[0];
        }
        return result;
        
    })
}

// 解析组合
const isMethods = methods => methods instanceof Object && methods.encodeABI && methods._parent._address 
export async function multiCalls(methodsObj,...options) {
    // 存放 encodeABI
    let calls = []
    let pro = []
    // 存放 callsIndex
    const callsIndex = methodsObj instanceof Array?[]:{}
    // 
    
    
    function analyze(methods, parentObj, key) {
        if ( isMethods(methods) ) {
            const index = calls.length
            calls.push(methods)
            proxy(parentObj, key, () => calls[index])
        }
        else if ( methods instanceof Promise ) {
            const index = pro.length
            pro.push(methods)
            proxy(parentObj, key, () => pro[index])
        }
        else if ( methods instanceof Object ) {
            parentObj[key] = methods instanceof Array?[]:{}
            for(let index in methods) {
                analyze(methods[index], parentObj[key], index)
            }
        }
        else {
            parentObj[key] = methods
        }
    }

    for(let key in methodsObj) {
        analyze(methodsObj[key], callsIndex, key)
    }
    calls = await multiCallArr(calls,...options)
    if ( pro.length > 0 ) pro = await Promise.all(pro)
    return callsIndex
}