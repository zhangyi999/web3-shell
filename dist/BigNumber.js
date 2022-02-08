"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wFormatInt = exports.MAX_UINT = exports.BN = void 0;

var _bignumber = _interopRequireDefault(require("bignumber.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BN = num => new _bignumber.default(num);

exports.BN = BN;
const MAX_UINT = '0x' + 'f'.repeat(64);
exports.MAX_UINT = MAX_UINT;

const wFormatInt = num => {
  const number = num * 1; // console.log(
  //     number*100 % 1,
  //     number
  // )
  // console.log({
  //     num
  // })

  return isNaN(number) ? 0 : !number || number === 0 ? '0.00' : number.toLocaleString('en-US'); // number*100 % 1 > 0 ?
  //     (number).toLocaleString('en-US').slice(0,-1):
  //     (number).toLocaleString('en-US')
};

exports.wFormatInt = wFormatInt;