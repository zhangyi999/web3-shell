import BigNumber from 'bignumber.js'
import {initWeb3, nweContract} from './initWeb3'

import ERC20_ABI from './ABI/ERC20'
import {ZERO_ADDRESS} from './config'

export function ERC20(address) {
    const erc20 = nweContract( address, ERC20_ABI )
    erc20.getBalance = user => {
        if ( address === ZERO_ADDRESS ) {
            const web3 = initWeb3()
            return web3.eth.getBalance(user)
          } else {
            return erc20.methods.balanceOf(user).call()
          }
    }
    
    erc20.approve = async ( sender, numWei ) => {
      const owner = erc20.options.from
      const num = new BigNumber(numWei)
      // 取消授权
      if (num.eq(0)) {
        return {
          status: 1,
          approve: () => erc20.methods.approve( sender, numWei ),
          allowance: null
        }
      }
      const allowance = await erc20.methods.allowance( owner, sender ).call()
      // 无需授权
      if (num.lte(allowance)) {
        return {
          status: 0,
          approve: null,
          allowance
        }
      }
      // 执行授权
      return {
        status: 1,
        approve: () => erc20.methods.approve( sender, numWei ),
        allowance
      }
    }
    return erc20
}
