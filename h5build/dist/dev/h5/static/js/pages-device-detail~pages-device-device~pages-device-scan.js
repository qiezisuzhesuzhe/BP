(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-device-detail~pages-device-device~pages-device-scan"],{

/***/ "HaE+":
/*!*********************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _asyncToGenerator; });
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "07d7");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_0__);

function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}


/***/ }),

/***/ "gMwk":
/*!*****************************!*\
  !*** ./src/common/radar.js ***!
  \*****************************/
/*! exports provided: lastRadarError, getLastRadarError, fetchRadarStatus, pingRadarPlatform, verifyRadarDevice, listRadarDevices, fetchRadarRecord, fetchRadarLatest, fetchRadarLatestBatch, fetchRadarAttributes, bindRadarDevice, unbindRadarDevice, RADAR_STATE_TEXT, radarStateText, radarInBed, respLevel, heartRateLevel, radarStruggleAlert */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lastRadarError", function() { return lastRadarError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLastRadarError", function() { return getLastRadarError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchRadarStatus", function() { return fetchRadarStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "pingRadarPlatform", function() { return pingRadarPlatform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "verifyRadarDevice", function() { return verifyRadarDevice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listRadarDevices", function() { return listRadarDevices; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchRadarRecord", function() { return fetchRadarRecord; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchRadarLatest", function() { return fetchRadarLatest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchRadarLatestBatch", function() { return fetchRadarLatestBatch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchRadarAttributes", function() { return fetchRadarAttributes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bindRadarDevice", function() { return bindRadarDevice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unbindRadarDevice", function() { return unbindRadarDevice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RADAR_STATE_TEXT", function() { return RADAR_STATE_TEXT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "radarStateText", function() { return radarStateText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "radarInBed", function() { return radarInBed; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "respLevel", function() { return respLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "heartRateLevel", function() { return heartRateLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "radarStruggleAlert", function() { return radarStruggleAlert; });
/* harmony import */ var _workspace_h5build_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/slicedToArray.js */ "ODXe");
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.filter.js */ "TeQF");
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_array_index_of_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.array.index-of.js */ "yXV3");
/* harmony import */ var core_js_modules_es_array_index_of_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_index_of_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.array.map.js */ "2B1R");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_date_to_json_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.date.to-json.js */ "9LPj");
/* harmony import */ var core_js_modules_es_date_to_json_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_date_to_json_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.iterator.constructor.js */ "6fVz");
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.iterator.filter.js */ "kQ2C");
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.iterator.for-each.js */ "fVRX");
/* harmony import */ var core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_iterator_map_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.iterator.map.js */ "q0NK");
/* harmony import */ var core_js_modules_es_iterator_map_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_map_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_json_stringify_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.json.stringify.js */ "6cQw");
/* harmony import */ var core_js_modules_es_json_stringify_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_json_stringify_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "qePV");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "07d7");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "rB9j");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_es_regexp_test_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.regexp.test.js */ "ALS0");
/* harmony import */ var core_js_modules_es_regexp_test_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_test_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.string.iterator.js */ "PKPk");
/* harmony import */ var core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/es.string.trim.js */ "SYor");
/* harmony import */ var core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "FZtP");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "3bBZ");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _band_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./band.js */ "YNKN");


















/**
 * 睡眠监测仪（毫米波雷达款）—— 智慧物联网云平台数据桥接
 *
 * 后端接收服务：/workspace/band-server/radar.js（挂在 band-server 上，默认端口 8091）
 *  - 平台鉴权：appKey + timestamp + signature=MD5(path+timestamp+appSecret)
 *  - 实时数据：MQTT 订阅 topic 推送 → 后端归一化 → SSE kind='radar' 下发前端
 *  - /api/radar/* 供 H5 校验设备、绑定/解绑、查询最新呼吸/体动/离床
 *
 * 本模块只展示后端真实上报的数据，未收到数据时返回 null，由页面显示占位符（--）。
 * 地址解析复用 band.js 的 bandApi()：雷达接口与手环接口同源同端口。
 */


var lastRadarError = null;
function getLastRadarError() {
  return lastRadarError;
}
function _logReq(tag, url, resOrErr, extra) {
  try {
    var isErr = resOrErr && resOrErr.__fail || resOrErr && typeof resOrErr.statusCode === 'number' && (resOrErr.statusCode < 200 || resOrErr.statusCode >= 300);
    var code = resOrErr && typeof resOrErr.statusCode === 'number' ? resOrErr.statusCode : resOrErr && resOrErr.__fail ? 'FAIL' : '?';
    var busCode = resOrErr && resOrErr.data && typeof resOrErr.data.code !== 'undefined' ? resOrErr.data.code : null;
    if (isErr || busCode != null && busCode !== 0) {
      var msg = '[radar][' + tag + '] 失败 HTTP=' + code + ' 业务=' + busCode + '  URL=' + url + (extra ? '  EXTRA=' + JSON.stringify(extra) : '');
      if (typeof console !== 'undefined' && console.error) console.error(msg, resOrErr || '');
      lastRadarError = {
        at: Date.now(),
        tag: tag,
        url: url,
        http: code,
        bus: busCode,
        extra: extra || null
      };
    } else if (typeof console !== 'undefined' && console.debug) {
      console.debug('[radar][' + tag + '] OK HTTP=' + code + ' 业务=' + busCode + '  ' + url, extra || '');
    }
  } catch (e) {/* ignore */}
}

// 统一请求封装：失败一律 resolve(fallback)，绝不 reject，也不弹 toast（会被轮询高频调用）
function _req(tag, path, method, data, fallback) {
  return new Promise(function (resolve) {
    var url = Object(_band_js__WEBPACK_IMPORTED_MODULE_18__["bandApi"])(path);
    uni.request({
      url: url,
      method: method || 'GET',
      data: data || undefined,
      timeout: 20000,
      success: function success(res) {
        var ok = res.statusCode === 200 && res.data && res.data.code === 0;
        _logReq(tag, url, res, ok ? null : {
          message: res.data && res.data.message || null
        });
        resolve(ok ? res.data.data : fallback);
      },
      fail: function fail(err) {
        _logReq(tag, url, Object.assign({
          __fail: true
        }, err || {}));
        resolve(fallback);
      }
    });
  });
}

/* ---------------- 通道自检 ---------------- */

// 平台通道状态：{ company, appKey, apiBase, modelName, mq: { state, error, msgCount... }, devices }
// mq.state: idle / connecting / connected / reconnecting / offline / error
function fetchRadarStatus() {
  return _req('GET /api/radar/status', '/api/radar/status?_t=' + Date.now(), 'GET', null, null);
}

// 平台连通性 + 签名校验（调型号列表）。返回 { ok, models } 或 null
function pingRadarPlatform() {
  return _req('GET /api/radar/ping', '/api/radar/ping?_t=' + Date.now(), 'GET', null, null);
}

/* ---------------- 设备查询 ---------------- */

// 扫码后绑定前置校验：设备号是否真实存在于平台
// 成功返回 { deviceImei, deviceId, model, typeName, state, stateText, companyName, site }
// 平台查不到 / 网络失败均返回 null
function verifyRadarDevice(deviceid) {
  if (!deviceid) return Promise.resolve(null);
  return _req('GET /api/radar/verify/:imei', '/api/radar/verify/' + encodeURIComponent(deviceid) + '?_t=' + Date.now(), 'GET', null, null);
}

// 本地已绑定的雷达设备列表（不含 history）
function listRadarDevices() {
  return _req('GET /api/radar/devices', '/api/radar/devices?_t=' + Date.now(), 'GET', null, []);
}

// 单台雷达完整记录：{ deviceid, name, model, latest, attrs, state, stateText, site, lastSeen }
// refresh=true 时后端会回平台同步一次基础信息（受每秒 1 次限流保护，略慢）
function fetchRadarRecord(deviceid, refresh) {
  if (!deviceid) return Promise.resolve(null);
  var path = '/api/radar/devices/' + encodeURIComponent(deviceid) + '?_t=' + Date.now();
  if (refresh) path += '&refresh=1';
  return _req('GET /api/radar/devices/:imei', path, 'GET', null, null);
}

// 只取最新快照（给设备列表页用）
function fetchRadarLatest(deviceid) {
  return fetchRadarRecord(deviceid).then(function (rec) {
    return rec && rec.latest ? rec.latest : null;
  });
}

// 批量拉取多台雷达最新快照，返回 { [deviceid]: latest | null }
function fetchRadarLatestBatch(deviceids) {
  var ids = Array.isArray(deviceids) ? deviceids.filter(Boolean) : [];
  if (ids.length === 0) return Promise.resolve({});
  return Promise.all(ids.map(function (id) {
    return fetchRadarLatest(id).then(function (v) {
      return [id, v];
    });
  })).then(function (pairs) {
    var out = {};
    pairs.forEach(function (_ref) {
      var _ref2 = Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref, 2),
        id = _ref2[0],
        v = _ref2[1];
      out[id] = v;
    });
    return out;
  });
}

// 型号属性表（日后拿到真实 deviceModelName 后校准字段映射用）
function fetchRadarAttributes(model) {
  var m = String(model || '').trim();
  if (!m) return Promise.resolve(null);
  return _req('GET /api/radar/attributes', '/api/radar/attributes?model=' + encodeURIComponent(m), 'GET', null, null);
}

/* ---------------- 绑定 / 解绑 ---------------- */

// 绑定雷达设备：后端先向平台校验设备真实存在，再落本地库并广播 device_bind
// 返回设备记录，失败返回 null（错误详情见 getLastRadarError()）
function bindRadarDevice(deviceid, name) {
  if (!deviceid) return Promise.resolve(null);
  return _req('POST /api/radar/devices', '/api/radar/devices', 'POST', {
    deviceid: deviceid,
    name: name || ''
  }, null);
}

// 解绑：后端打 markedUnbound 标记而非真删，保住历史数据
function unbindRadarDevice(deviceid) {
  if (!deviceid) return Promise.resolve(false);
  return _req('DELETE /api/radar/devices/:imei', '/api/radar/devices/' + encodeURIComponent(deviceid), 'DELETE', null, null).then(function (d) {
    return !!d;
  });
}

/* ---------------- 展示辅助 ---------------- */

// 平台设备状态码 → 中文
var RADAR_STATE_TEXT = {
  0: '正常',
  1: '故障',
  2: '报警',
  3: '手动报警',
  4: '离线',
  5: '待删除',
  6: '停用',
  7: '未激活'
};
function radarStateText(state) {
  if (state == null || state === '') return '';
  return RADAR_STATE_TEXT[Number(state)] || String(state);
}

// 在床状态判定：latest.inBed 由后端按属性名关键词归一（1/0 或 有人/无人）
// 返回 true 在床 / false 离床 / null 未知
function radarInBed(latest) {
  if (!latest) return null;
  var v = latest.inBed;
  if (v == null || v === '') return null;
  if (typeof v === 'number') return v > 0;
  var s = String(v);
  if (/^(1|true|yes)$/i.test(s) || s.indexOf('有人') >= 0 || s.indexOf('在床') >= 0) return true;
  if (/^(0|false|no)$/i.test(s) || s.indexOf('无人') >= 0 || s.indexOf('离床') >= 0) return false;
  return null;
}

// 呼吸频率评估（成人静息 12-20 次/分）：返回 { level, text }
function respLevel(respRate) {
  var v = Number(respRate);
  if (!isFinite(v) || v <= 0) return {
    level: 'unknown',
    text: ''
  };
  if (v < 12) return {
    level: 'low',
    text: '偏慢'
  };
  if (v <= 20) return {
    level: 'normal',
    text: '正常'
  };
  if (v <= 24) return {
    level: 'high',
    text: '偏快'
  };
  return {
    level: 'danger',
    text: '过快'
  };
}

// 心率评估（成人静息 60-100 bpm）：返回 { level, text }
function heartRateLevel(hr) {
  var v = Number(hr);
  if (!isFinite(v) || v <= 0) return {
    level: 'unknown',
    text: ''
  };
  if (v < 60) return {
    level: 'low',
    text: '偏慢'
  };
  if (v <= 100) return {
    level: 'normal',
    text: '正常'
  };
  if (v <= 120) return {
    level: 'high',
    text: '偏快'
  };
  return {
    level: 'danger',
    text: '过快'
  };
}

// 异常挣扎检测：struggleAlert > 0 视为有挣扎预警
// 返回 { count, active, level, text }
function radarStruggleAlert(latest) {
  if (!latest) return {
    count: 0,
    active: false,
    level: 'normal',
    text: '无'
  };
  var c = Number(latest.struggleAlert) || 0;
  if (c <= 0) return {
    count: 0,
    active: false,
    level: 'normal',
    text: '无'
  };
  if (c <= 2) return {
    count: c,
    active: true,
    level: 'warning',
    text: '偶发'
  };
  if (c <= 5) return {
    count: c,
    active: true,
    level: 'high',
    text: '频繁'
  };
  return {
    count: c,
    active: true,
    level: 'danger',
    text: '剧烈'
  };
}

/***/ })

}]);