
import BigNumber from 'bignumber.js'

export const BN = num => new BigNumber(num)

export const MAX_UINT = '0x'+'f'.repeat(64)

export const wFormatInt = num => {
    const number = (num*1)
    // console.log(
    //     number*100 % 1,
    //     number
    // )
    // console.log({
    //     num
    // })
    return isNaN(number) ? 0 : (!number) || number===0?'0.00': (number).toLocaleString('en-US')
        // number*100 % 1 > 0 ?
        //     (number).toLocaleString('en-US').slice(0,-1):
        //     (number).toLocaleString('en-US')
}
