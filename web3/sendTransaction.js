
import {initWeb3} from './initWeb3'

export function SendOn(methods, options = {}) {
    const web3 = initWeb3()
    const from = web3.currentProvider.selectedAddress || web3.currentProvider.accounts[0]
    const owner = {
        from,
        ...options
    }
    // console.log(web3.currentProvider,'web3.currentProvider')
    methods._parent.setProvider(web3.currentProvider)
    let pro = null
    async function estimateGas() {
        try {
            const gas = await methods.estimateGas(owner)
            console.log({gas})
            if (pro === null) pro = methods.send(owner)
            return [null, 1]
        } catch(err) {
            return [err, -1]
        }
    }
    
    const getHash = async () => {
        const [err] = await estimateGas()
        if ( err ) return [err, -1]
        return new Promise( (r,j) => {
            pro.on('transactionHash', function(hash){
                r([null, hash])
            })
            pro.on('error',function(err) {
                r([err, null])
            })
        })
    }

    const confirmation = async () => {
        const [err] = await estimateGas()
        if ( err ) return [err, -1]
        return new Promise( (r,j) => {
            pro.on('confirmation', function(confirmationNumber, receipt){
                if ( confirmationNumber > 1 ) {
                    r([null, receipt])
                }
            })
            pro.on('error', function(error, receipt){
                // console.log({error})
                if ( error ) {
                    r([error, null])
                    return
                }
                if ( receipt ) {
                    r([receipt, null])
                    return
                }
            })
        })
    }

    return {
    getHash,
    confirmation,
    send: pro
    }
}
