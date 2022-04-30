"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMultiCall = addMultiCall;
exports.multiCallArr = multiCallArr;
exports.multiCalls = multiCalls;

var _initWeb = require("./initWeb3");

var _MULTI_CALL = _interopRequireDefault(require("./ABI/MULTI_CALL"));

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function proxy(obj, key, call) {
  Object.defineProperty(obj, key, {
    get: () => call(),
    enumerable: true,
    configurable: false
  });
}

let mulSupplementary = _config.multiCallAddress;

function MultiCallContract() {
  const web3 = (0, _initWeb.initWeb3)();
  const chainId = web3.currentProvider.chainId;
  const address = mulSupplementary[chainId * 1];
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
} // {chainId: address}


function addMultiCall(chainConfig = {}) {
  mulSupplementary = _objectSpread(_objectSpread({}, mulSupplementary), chainConfig);
}