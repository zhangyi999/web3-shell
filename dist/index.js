"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  decimalHex: true,
  getBlock: true,
  utils: true
};
exports.decimalHex = void 0;
exports.default = getWeb3;
exports.utils = exports.getBlock = void 0;

var _initWeb = require("./initWeb3");

Object.keys(_initWeb).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _initWeb[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _initWeb[key];
    }
  });
});

var _erc = require("./erc20");

Object.keys(_erc).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _erc[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _erc[key];
    }
  });
});

var _multiCall = require("./multiCall");

Object.keys(_multiCall).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _multiCall[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _multiCall[key];
    }
  });
});

var _sendTransaction = require("./sendTransaction");

Object.keys(_sendTransaction).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _sendTransaction[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _sendTransaction[key];
    }
  });
});

var _utils = _interopRequireWildcard(require("./utils"));

exports.utils = _utils;

var _config = require("./config");

Object.keys(_config).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _config[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _config[key];
    }
  });
});

var _BigNumber = require("./BigNumber");

Object.keys(_BigNumber).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _BigNumber[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _BigNumber[key];
    }
  });
});

var _chain_id = require("./chain_id.json");

Object.keys(_chain_id).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _chain_id[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _chain_id[key];
    }
  });
});

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const decimalHex = '0x' + 1e18.toString(16);
exports.decimalHex = decimalHex;

function pollingBlock() {
  let start = false;
  let newBlock = 0;
  let callMap = new Map();
  let stopTime; // poll ?????? ??????

  async function poll(isUpdate) {
    const web3 = (0, _initWeb.initWeb3)(); // ????????? ?????? subscribe ?????? ??? getBlock ?????? 7 ??????????????????
    // ????????? ?????? ??? wss
    // console.log('poll')

    try {
      const {
        number: blockNumberChain
      } = await web3.eth.getBlock('latest'); // console.log(newBlock, blockNumberChain, callMap)

      if (newBlock < blockNumberChain || isUpdate) {
        // console.log(callMap.size)
        newBlock = blockNumberChain;

        for (let [key] of callMap) {
          if (key instanceof Function) {
            key(newBlock);
          }
        }
      }
    } catch (error) {
      console.log(error.message); // ?????????????????? ???????????????
    }

    if (start) {
      stopTime = setTimeout(poll, 3000);
    }
  }

  return {
    start(call) {
      if (!call) return;

      if (start === false) {
        // console.log(call)
        start = true;
        poll(true);
      }

      if (callMap.has(call)) return;
      callMap.set(call, true);
    },

    remove(call) {
      if (!call) return;

      if (callMap.has(call)) {
        callMap.delete(call);
      }

      if (callMap.size === 0) {
        start = false;
        clearTimeout(stopTime);
      }
    },

    getNewBlock: () => newBlock
  };
}

const getBlock = pollingBlock();
/**
?????? web3 ?????????

?????? walletConnect??? new walletConnect => provider => provider ????????? web3
?????? walletConnect??? on "disconnect" callback => setDefault provider => ????????? web3

?????? metamask ????????? web3 provider ???setProvider
?????? metamask ????????? account => !account[0] === true => ?????? default provider

walletConnect ????????? ???????????? ?????? account
metamask ????????? ????????? ?????? change

chainId ??????????????????

 */

exports.getBlock = getBlock;

function getWeb3(defaultChian) {
  (0, _initWeb.setDefaultProvider)(defaultChian); // ???????????????????????? ?????? chainId ??? null

  return (0, _initWeb.initWeb3)();
}