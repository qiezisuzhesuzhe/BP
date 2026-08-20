(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-band-status~pages-device-device~pages-device-scan~pages-index-index"],{

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

/***/ "YNKN":
/*!****************************!*\
  !*** ./src/common/band.js ***!
  \****************************/
/*! exports provided: BAND_SERVER, bandApi, fetchBandLatest, fetchBandAddress, sendBandMessage, bindBandDevice, unbindBandDevice, fetchBandLatestBatch, subscribeEvents, extractDeviceId, bpLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BAND_SERVER", function() { return BAND_SERVER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bandApi", function() { return bandApi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchBandLatest", function() { return fetchBandLatest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchBandAddress", function() { return fetchBandAddress; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sendBandMessage", function() { return sendBandMessage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bindBandDevice", function() { return bindBandDevice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "unbindBandDevice", function() { return unbindBandDevice; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchBandLatestBatch", function() { return fetchBandLatestBatch; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribeEvents", function() { return subscribeEvents; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extractDeviceId", function() { return extractDeviceId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bpLevel", function() { return bpLevel; });
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.filter.js */ "TeQF");
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_index_of_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.index-of.js */ "yXV3");
/* harmony import */ var core_js_modules_es_array_index_of_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_index_of_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.array.push.js */ "FNk8");
/* harmony import */ var core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.array.slice.js */ "+2oP");
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.iterator.constructor.js */ "6fVz");
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.iterator.filter.js */ "kQ2C");
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.iterator.for-each.js */ "fVRX");
/* harmony import */ var core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_json_parse_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.json.parse.js */ "EjbG");
/* harmony import */ var core_js_modules_es_json_parse_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_json_parse_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "qePV");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.object.keys.js */ "tkto");
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "07d7");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "rB9j");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es_string_match_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.string.match.js */ "Rm1S");
/* harmony import */ var core_js_modules_es_string_match_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_match_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "UxlC");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.string.split.js */ "EnZy");
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/es.string.trim.js */ "SYor");
/* harmony import */ var core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "FZtP");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_16__);

















/**
 * 智能手环（血压款）—— 埃微 iwown 设备对云 数据桥接
 *
 * 后端接收服务：/workspace/band-server（Node.js，默认端口 8091）
 *  - /pb/upload 等 6 个路径接收手环 4G 直传数据（埃微自定义二进制 + protobuf）
 *  - /api/devices 供 H5 查询最新心率/血压/步数
 *
 * 本模块：后端地址配置 + 拉取/绑定封装。只展示后端真实上报的数据，
 * 未收到数据时返回 null，由页面显示占位符（--）。
 */

// 后端接收服务：H5 页面由 band-server(8091) 同源托管，API 使用相对路径，
// 这样无论从本地预览、内网穿透公网地址还是手机访问，都能正确请求到本服务
var BAND_SERVER = '';
function bandApi(path) {
  return BAND_SERVER + path;
}

// 从后端拉取手环最新状态（心率 hr / 收缩压 sbp / 舒张压 dbp / 步数 steps / 电量 battery / 时间戳 ts）
// 后端不可达或尚无上报数据时 resolve(null)，由页面显示 "--"，不做模拟兜底
// URL 附加时间戳 + 后端 no-store，双保险绕过浏览器 HTTP 缓存，保证每次轮询都是最新数据
function fetchBandLatest(deviceid) {
  return new Promise(function (resolve) {
    uni.request({
      url: bandApi('/api/devices/' + deviceid) + '?_t=' + Date.now(),
      method: 'GET',
      timeout: 5000,
      success: function success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          var latest = res.data.data && res.data.data.latest;
          if (latest && (latest.hr != null || latest.sbp != null || latest.steps != null || latest.spo2 != null || latest.ecgSamples != null || latest.sleep != null || latest.bodyTemp != null || latest.skinTemp != null || latest.stress != null)) {
            resolve(latest);
            return;
          }
        }
        resolve(null);
      },
      fail: function fail() {
        resolve(null);
      }
    });
  });
}

// 拉取当前公网上报地址（隧道重启后 lhr.life 域名会变化，后端返回最新一条）
// 后端不可达或未配置隧道时 resolve(null)，页面显示占位符；同样加时间戳防缓存
function fetchBandAddress() {
  return new Promise(function (resolve) {
    uni.request({
      url: bandApi('/api/address') + '?_t=' + Date.now(),
      method: 'GET',
      timeout: 5000,
      success: function success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0 && res.data.data) {
          resolve(res.data.data);
        } else {
          resolve(null);
        }
      },
      fail: function fail() {
        resolve(null);
      }
    });
  });
}

// 发送消息到手环（后端转发 entservice 指令下发，见 server.js /api/band/message）
// title ≤15 字节，description ≤240 字节；成功 resolve(null)，失败 resolve(错误信息)
function sendBandMessage(deviceid, title, description) {
  return new Promise(function (resolve) {
    uni.request({
      url: bandApi('/api/band/message'),
      method: 'POST',
      data: {
        device_id: deviceid,
        title: title,
        description: description
      },
      timeout: 15000,
      success: function success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          resolve(null);
        } else {
          resolve(res.data && res.data.message || '发送失败(' + (res.statusCode || '') + ')');
        }
      },
      fail: function fail() {
        resolve('无法连接消息服务');
      }
    });
  });
}

// 把手环设备注册到后端（绑定 deviceid 与用户）
function bindBandDevice(deviceid, name) {
  return new Promise(function (resolve) {
    uni.request({
      url: bandApi('/api/devices'),
      method: 'POST',
      data: {
        deviceid: deviceid,
        name: name
      },
      timeout: 5000,
      success: function success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          resolve(res.data.data);
        } else {
          resolve(null);
        }
      },
      fail: function fail() {
        resolve(null);
      }
    });
  });
}

// 解绑手环设备（从后端设备库移除）
function unbindBandDevice(deviceid) {
  return new Promise(function (resolve) {
    if (!deviceid) {
      resolve(null);
      return;
    }
    uni.request({
      url: bandApi('/api/devices/' + encodeURIComponent(deviceid)),
      method: 'DELETE',
      timeout: 5000,
      success: function success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      fail: function fail() {
        resolve(false);
      }
    });
  });
}

// 批量拉取多个 deviceid 的最新状态（给设备列表页用）
// 返回 { [deviceid]: latestSnapshot | null }
function fetchBandLatestBatch(deviceids) {
  return new Promise(function (resolve) {
    var ids = Array.isArray(deviceids) ? deviceids.filter(Boolean) : [];
    if (ids.length === 0) {
      resolve({});
      return;
    }
    var out = {};
    var remain = ids.length;
    ids.forEach(function (id) {
      uni.request({
        url: bandApi('/api/devices/' + id) + '?_t=' + Date.now(),
        method: 'GET',
        timeout: 5000,
        success: function success(res) {
          if (res.statusCode === 200 && res.data && res.data.code === 0 && res.data.data && res.data.data.latest) {
            out[id] = res.data.data.latest;
          } else {
            out[id] = null;
          }
        },
        fail: function fail() {
          out[id] = null;
        },
        complete: function complete() {
          remain--;
          if (remain <= 0) resolve(out);
        }
      });
    });
    // 兜底超时 8s
    setTimeout(function () {
      ids.forEach(function (id) {
        if (!(id in out)) out[id] = null;
      });
      if (remain > 0) {
        remain = 0;
        resolve(out);
      }
    }, 8000);
  });
}

/* ---------------- SSE 实时事件订阅（手环主动上报 → 前端即时感知） ---------------- */
// 返回一个 { close(), isOpen() } 对象；
// 用法：
//   const sub = subscribeEvents({
//     deviceid: '86xxx..', // 可选，仅收该设备
//     kinds: ['pb','alarm','sos','status','deviceinfo','calllog','device_bind','device_unbind'],
//     onOpen: () => {},
//     onClose: () => {},
//     onEvent: ({ kind, ts, id, payload }) => {},
//     onError: (err) => {}
//   })
// 页面离开时 sub.close()
function subscribeEvents() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    deviceid = _ref.deviceid,
    kinds = _ref.kinds,
    onOpen = _ref.onOpen,
    onClose = _ref.onClose,
    onEvent = _ref.onEvent,
    onError = _ref.onError;
  var opts = {
    deviceid: deviceid || null,
    kinds: kinds || [],
    onOpen: onOpen,
    onClose: onClose,
    onEvent: onEvent,
    onError: onError
  };
  var es = null;
  var closed = false;
  var manual = false;
  var lastTs = 0;
  function buildUrl() {
    var query = [];
    if (opts.deviceid) query.push('deviceid=' + encodeURIComponent(opts.deviceid));
    if (opts.kinds && opts.kinds.length) query.push('kinds=' + encodeURIComponent(opts.kinds.join(',')));
    if (lastTs) query.push('since=' + lastTs);
    return bandApi('/api/events/stream') + (query.length ? '?' + query.join('&') : '');
  }
  function fireOpen() {
    opts.onOpen && opts.onOpen();
  }
  function fireClose() {
    opts.onClose && opts.onClose();
  }
  function fireError(err) {
    opts.onError && opts.onError(err);
  }
  function fireEvent(evt) {
    if (!evt) return;
    try {
      if (evt.ts && Number(evt.ts) > lastTs) lastTs = Number(evt.ts);
    } catch (e) {}
    opts.onEvent && opts.onEvent(evt);
  }
  function start() {
    if (closed) return;
    if (typeof EventSource !== 'undefined') {
      // H5 / 支持 EventSource 的平台
      try {
        es = new EventSource(buildUrl(), {
          withCredentials: false
        });
      } catch (e) {
        fireError(e && e.message ? e.message : String(e));
        scheduleReconnect();
        return;
      }
      es.onopen = function () {
        fireOpen();
      };
      es.onerror = function (e) {
        if (closed) return;
        fireError(e && e.message ? e.message : 'sse error');
        // EventSource 自身会自动重连，只需关闭 & 重建以追加 since
        try {
          es && es.close();
        } catch (_e) {}
        scheduleReconnect();
      };
      es.onmessage = function (ev) {
        try {
          var data = JSON.parse(ev.data);
          fireEvent(data);
        } catch (e) {
          fireError('parse sse message failed: ' + String(e));
        }
      };
      // 同时监听有名字的事件（后端 event: 对应事件名）
      var KINDS_EXPECTED = ['pb', 'alarm', 'sos', 'calllog', 'deviceinfo', 'status', 'device_bind', 'device_unbind'];
      KINDS_EXPECTED.forEach(function (k) {
        es.addEventListener(k, function (ev) {
          try {
            var data = JSON.parse(ev.data);
            fireEvent(Object.assign({
              kind: k
            }, data));
          } catch (e) {}
        });
      });
      return;
    }
    // 兜底：uni-app 小程序/APP 环境没有 EventSource，用 uni.request 长轮询（15 秒 + 立即再拉 + since）
    manual = true;
    longPollOnce();
  }
  var reconnectTimer = null;
  function scheduleReconnect() {
    if (closed) return;
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(start, 3000);
  }
  var lpTimer = null;
  function longPollOnce() {
    if (closed) return;
    clearTimeout(lpTimer);
    var done = false;
    var req = uni.request({
      url: buildUrl(),
      method: 'GET',
      // 允许长连接：超时 60s，服务端保持
      timeout: 60000,
      header: {
        Accept: 'text/event-stream'
      },
      success: function success(res) {
        if (done) return;
        done = true;
        if (res && typeof res.data === 'string') {
          // 解析 SSE 文本事件块
          var blocks = String(res.data).split(/\n\n/);
          blocks.forEach(function (blk) {
            var lines = blk.split(/\n/);
            var kind = null;
            var id = null;
            var dataStr = '';
            lines.forEach(function (l) {
              if (l.indexOf('event:') === 0) kind = l.slice(6).trim();else if (l.indexOf('id:') === 0) id = l.slice(3).trim();else if (l.indexOf('data:') === 0) dataStr += l.slice(5);
            });
            if (!dataStr) return;
            try {
              var d = JSON.parse(dataStr);
              fireEvent(Object.assign({
                kind: kind || d.kind || null,
                id: id || d.id || null
              }, d));
            } catch (e) {}
          });
        }
        fireOpen();
        // 立刻再拉下一条（since 已更新）
        lpTimer = setTimeout(longPollOnce, 800);
      },
      fail: function fail(err) {
        if (done) return;
        done = true;
        fireError(err && err.errMsg ? err.errMsg : 'long poll error');
        scheduleReconnect();
      }
    });
    // 防阻塞：最多 55 秒强制认为请求结束
    setTimeout(function () {
      if (done) return;
      done = true;
      try {
        req && req.abort && req.abort();
      } catch (e) {}
      lpTimer = setTimeout(longPollOnce, 300);
    }, 55000);
  }
  start();
  return {
    close: function close() {
      closed = true;
      clearTimeout(reconnectTimer);
      clearTimeout(lpTimer);
      if (es) {
        try {
          es.close();
        } catch (e) {}
        es = null;
      }
      fireClose();
    },
    isOpen: function isOpen() {
      if (manual) return !closed;
      return !!es && es.readyState === 1;
    }
  };
}

// 从二维码文本中宽容提取设备号（IMEI/deviceid），兼容多种厂商二维码格式
function extractDeviceId(text) {
  var raw = String(text || '').trim();
  if (!raw) return '';
  // 1) 参数形式：imei/deviceid/device_id/sn/serial = 值
  var p = raw.match(/(?:imei|device[_-]?id|device_id|sn|serial)\s*[=:"'：\s]\s*([A-Za-z0-9]{8,20})/i);
  if (p) return p[1];
  // 2) JSON 键值形式
  var j = raw.match(/["']?(?:imei|device[_-]?id|device_id|sn|serial)["']?\s*[:=]\s*["']?([A-Za-z0-9]{8,20})/i);
  if (j) return j[1];
  // 3) 任意位置出现的 15 位连续数字（IMEI）
  var d15 = raw.match(/(?:^|[^\d])(\d{15})(?:[^\d]|$)/);
  if (d15) return d15[1];
  // 3.5) 去除空格/横线后的连续数字（如 "86 0132 0608 7222 3"）
  var compact = raw.replace(/[\s-]/g, '');
  var d15c = compact.match(/(?:^|[^\d])(\d{15})(?:[^\d]|$)/);
  if (d15c) return d15c[1];
  // 4) 兜底：10~20 位连续数字
  var d = raw.match(/(?:^|[^\d])(\d{10,20})(?:[^\d]|$)/);
  if (d) return d[1];
  return '';
}

// 血压状态分级
function bpLevel(sbp, dbp) {
  if (sbp == null || dbp == null) return {
    key: 'none',
    label: '--',
    color: '#94a3b8'
  };
  if (sbp >= 140 || dbp >= 90) return {
    key: 'high',
    label: '偏高',
    color: '#f15533'
  };
  if (sbp >= 120 || dbp >= 80) return {
    key: 'normal-h',
    label: '正常偏高',
    color: '#f2994a'
  };
  return {
    key: 'normal',
    label: '正常',
    color: '#27ae60'
  };
}

/***/ })

}]);