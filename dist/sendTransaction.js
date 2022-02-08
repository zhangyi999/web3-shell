"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SendOn = SendOn;

var _initWeb = require("./initWeb3");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function SendOn(methods, options = {}) {
  const web3 = (0, _initWeb.initWeb3)();
  const from = web3.currentProvider.selectedAddress || web3.currentProvider.accounts[0];

  const owner = _objectSpread({
    from
  }, options); // console.log(web3.currentProvider,'web3.currentProvider')


  methods._parent.setProvider(web3.currentProvider);

  let pro = null;

  async function estimateGas() {
    try {
      const gas = await methods.estimateGas(owner);
      console.log({
        gas
      });
      if (pro === null) pro = methods.send(owner);
      return [null, 1];
    } catch (err) {
      return [err, -1];
    }
  }

  const getHash = async () => {
    const [err] = await estimateGas();
    if (err) return [err, -1];
    return new Promise((r, j) => {
      pro.on('transactionHash', function (hash) {
        r([null, hash]);
      });
      pro.on('error', function (err) {
        r([err, null]);
      });
    });
  };

  const confirmation = async () => {
    const [err] = await estimateGas();
    if (err) return [err, -1];
    return new Promise((r, j) => {
      pro.on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber > 1) {
          r([null, receipt]);
        }
      });
      pro.on('error', function (error, receipt) {
        // console.log({error})
        if (error) {
          r([error, null]);
          return;
        }

        if (receipt) {
          r([receipt, null]);
          return;
        }
      });
    });
  };

  return {
    getHash,
    confirmation,
    send: pro
  };
}