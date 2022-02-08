"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shortAddress = require("./shortAddress");

Object.keys(_shortAddress).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _shortAddress[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _shortAddress[key];
    }
  });
});