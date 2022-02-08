"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.multiCallArr = multiCallArr;
exports.multiCalls = multiCalls;

var _initWeb = require("./initWeb3");

var _MULTI_CALL = _interopRequireDefault(require("./ABI/MULTI_CALL"));

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function proxy(obj, key, call) {
  Object.defineProperty(obj, key, {
    get: () => call(),
    enumerable: true,
    configurable: false
  });
}

function MultiCallContract() {
  const web3 = (0, _initWeb.initWeb3)();
  const chainId = web3.currentProvider.chainId;
  const address = _config.multiCallAddress[chainId * 1];
  if (!address) throw new Error(`chainId ${chainId} multi_call address not configured`);
  return (0, _initWeb.nweContract)(address, _MULTI_CALL.default);
}

async function multiCallArr(methodsArr, ...options) {
  const multiCallContract = MultiCallContract();
  const calls = [];
  const len = methodsArr.length;

  for (let i = 0; i < len; i++) {
    const v = methodsArr[i];
    calls.push([v._parent._address, v.encodeABI()]);
  }

  const res = await multiCallContract.methods.aggregate(calls).call(...options);
  const web3 = (0, _initWeb.initWeb3)();
  return res[1].map((hex, i) => {
    const v = methodsArr[i];
    const result = web3.eth.abi['decodeParameters'](v._method.outputs, hex);

    if (result.__length__ === 1) {
      return result[0];
    }

    return result;
  });
} // 解析组合


const isMethods = methods => methods instanceof Object && methods.encodeABI && methods._parent._address;

async function multiCalls(methodsObj, ...options) {
  // 存放 encodeABI
  let calls = [];
  let pro = []; // 存放 callsIndex

  const callsIndex = methodsObj instanceof Array ? [] : {}; // 

  function analyze(methods, parentObj, key) {
    if (isMethods(methods)) {
      const index = calls.length;
      calls.push(methods);
      proxy(parentObj, key, () => calls[index]);
    } else if (methods instanceof Promise) {
      const index = pro.length;
      pro.push(methods);
      proxy(parentObj, key, () => pro[index]);
    } else if (methods instanceof Object) {
      parentObj[key] = methods instanceof Array ? [] : {};

      for (let index in methods) {
        analyze(methods[index], parentObj[key], index);
      }
    } else {
      parentObj[key] = methods;
    }
  }

  for (let key in methodsObj) {
    analyze(methodsObj[key], callsIndex, key);
  }

  calls = await multiCallArr(calls, ...options);
  if (pro.length > 0) pro = await Promise.all(pro);
  return callsIndex;
}