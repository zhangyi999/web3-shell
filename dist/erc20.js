"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ERC20 = ERC20;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _initWeb = require("./initWeb3");

var _ERC = _interopRequireDefault(require("./ABI/ERC20"));

var _config = require("./config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ERC20(address) {
  const erc20 = (0, _initWeb.nweContract)(address, _ERC.default);

  erc20.getBalance = user => {
    if (address === _config.ZERO_ADDRESS) {
      const web3 = (0, _initWeb.initWeb3)();
      return web3.eth.getBalance(user);
    } else {
      return erc20.methods.balanceOf(user).call();
    }
  };

  erc20.approve = async (sender, numWei) => {
    const owner = erc20.options.from;
    const num = new _bignumber.default(numWei); // 取消授权

    if (num.eq(0)) {
      return {
        status: 1,
        approve: () => erc20.methods.approve(sender, numWei),
        allowance: null
      };
    }

    const allowance = await erc20.methods.allowance(owner, sender).call(); // 无需授权

    if (num.lte(allowance)) {
      return {
        status: 0,
        approve: null,
        allowance
      };
    } // 执行授权


    return {
      status: 1,
      approve: () => erc20.methods.approve(sender, numWei),
      allowance
    };
  };

  return erc20;
}