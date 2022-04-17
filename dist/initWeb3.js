"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultProvider = getDefaultProvider;
exports.initWeb3 = initWeb3;
exports.newWeb3 = void 0;
exports.nweContract = nweContract;
exports.reInitWeb3 = reInitWeb3;
exports.setDefaultProvider = setDefaultProvider;
exports.setProvider = setProvider;

var _web = _interopRequireDefault(require("web3"));

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let defaultProvider = {}; // 初始化 web3
// 设计逻辑的原则是步骤清晰

/**
 * 1. 在钱包里，有自己的 provider
 * 2. 没有钱包，构建自己的 provider，设置默认 provider
 * 3. 使用 walletContent 需要重新配置 provider 
 */

function setDefaultProvider({
  rpc = _config.DEFAULT_PRC,
  selectedAddress = _config.PROXY_ZERO_ADDRESS,
  chainId = _config.DEFAULT_CHAIN_ID
}) {
  defaultProvider = {
    rpc,
    selectedAddress,
    chainId
  };
} // 单链模式


let web3; // getDefault provider

function getDefaultProvider() {
  let provider;

  try {
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      provider = new _web.default.providers.HttpProvider(defaultProvider.rpc, {
        ethereumNodeTimeout: 5000
      });
    }
  } catch (error) {
    provider = new _web.default.providers.HttpProvider(defaultProvider.rpc, {
      ethereumNodeTimeout: 5000
    });
  }

  return provider;
} // set Provider


function setProvider(realProvider) {
  web3 = new _web.default(realProvider);

  if (!web3.currentProvider || !web3.currentProvider.selectedAddress) {
    let user = web3.currentProvider.accounts;
    user = user ? user[0] : defaultProvider.selectedAddress;
    web3.currentProvider.selectedAddress = user; // 默认 chainId 没有

    web3.currentProvider.chainId = defaultProvider.chainId;
  }

  return web3;
} // get web3


function initWeb3() {
  if (web3) return web3;
  return setProvider(getDefaultProvider());
} // 清空web3


function reInitWeb3() {
  web3 = null;
  return initWeb3();
}

let cache = {};

function nweContract(address, abi) {
  const web3 = initWeb3();
  const owner = web3.currentProvider.selectedAddress;
  let contract = cache[address];

  if (cache[address]) {
    if (contract.options.from !== owner) {
      contract.options.from = owner;
    }

    return contract;
  }

  contract = new web3.eth.Contract(abi);
  contract.options.address = address;

  if (owner) {
    contract.options.from = owner;
  }

  cache[address] = contract;
  return contract;
}

const newWeb3 = rpc => {
  const web3 = new _web.default(new _web.default.providers.HttpProvider(rpc, {
    ethereumNodeTimeout: 5000
  }));

  web3.addPrivateKey = privateKey => web3.eth.accounts.wallet.add(privateKey);

  return web3;
};

exports.newWeb3 = newWeb3;