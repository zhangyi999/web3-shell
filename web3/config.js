// 代理黑洞，这个地址余额都为 0
export const PROXY_ZERO_ADDRESS = '0xA4BE0c823E1026AF948F9E278377381158e54Dc9'
export const ZERO_ADDRESS = '0x'+'0'.repeat(40)
// export const MAX_UINT = '0x' + 'f'.repeat(64)

export const DEFAULT_PRC = 'https://bsc-dataseed3.defibit.io'
export const DEFAULT_CHAIN_ID = '0X38'

export const multiCallAddress = {
  1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
  56: '0x6E25E2E9d89d1Ba697B912599490268Ec0ec0724',
  97: '0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C',
  128: '0xFEe46D2e59f5F58d34a6dD7BB9d18D26360aDA38',
  256: '0x01A4bFec8Cfd2580640fc6Bd0CB11461a6C804f1',
  1337: '0xbFD3511180A40503D807c9249943431Cf847E5b7', // test
  31337: '0xD3735cbb1D8D3c8E67e3d85CF3d5689455176ff3',
  137: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
  66: '0x5De2994114e740A3BD049c74D6aE06529F6C99c6',
  100: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a'
}

export const N_TYPE = {
  heco: {
    name: 'ht',
    symbol: 'HT',
    decimals: 18,
    chainId: 128,
    chain: '0x80',
    rpcUrls: ['https://http-mainnet.hecochain.com'],
    blockExplorerUrls: ['https://hecoinfo.com'],
  },
  bsc: {
    name: 'bnb',
    symbol: 'BNB',
    decimals: 18,
    chainId: 56,
    chain: '0x38',
    rpcUrls: ['https://bsc-dataseed3.defibit.io'],
    blockExplorerUrls: ['https://bscscan.com'],
  }
} 
