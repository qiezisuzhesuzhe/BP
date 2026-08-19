(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-device-device"],{

/***/ "3WXb":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--15-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/filter-modules-template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./src/pages/device/device.vue?vue&type=template&id=43012106&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
try {
  components = {
    hmNavbar: __webpack_require__(/*! @/components/hm-navbar/hm-navbar.vue */ "0gc2").default,
  }
} catch (e) {
  if (
    e.message.indexOf("Cannot find module") !== -1 &&
    e.message.indexOf(".vue") !== -1
  ) {
    console.error(e.message)
    console.error("1. 排查组件名称拼写是否正确")
    console.error(
      "2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"
    )
    console.error(
      "3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件"
    )
  } else {
    throw e
  }
}
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-uni-view",
    { staticClass: "hm-page" },
    [
      _c("hm-navbar", {
        attrs: {
          title: "我的设备",
          "show-back": false,
          "bg-color": "transparent",
        },
      }),
      _c(
        "v-uni-view",
        { staticClass: "wrap" },
        [
          _vm.devices.length === 0
            ? _c(
                "v-uni-view",
                { staticClass: "empty" },
                [
                  _c(
                    "v-uni-view",
                    { staticClass: "empty__icon" },
                    [
                      _c("v-uni-text", {
                        staticClass: "fa-solid fa-microchip empty__icon-t",
                      }),
                    ],
                    1
                  ),
                  _c("v-uni-text", { staticClass: "empty__t" }, [
                    _vm._v("暂无绑定设备"),
                  ]),
                  _c("v-uni-text", { staticClass: "empty__d" }, [
                    _vm._v(
                      "扫描设备机身上的二维码，即可快速添加并开始同步健康数据"
                    ),
                  ]),
                  _c(
                    "v-uni-view",
                    {
                      staticClass: "empty__btn",
                      on: {
                        click: function ($event) {
                          arguments[0] = $event = _vm.$handleEvent($event)
                          _vm.goScan.apply(void 0, arguments)
                        },
                      },
                    },
                    [
                      _c("v-uni-text", {
                        staticClass: "fa-solid fa-qrcode empty__btn-icon",
                      }),
                      _c("v-uni-text", { staticClass: "empty__btn-t" }, [
                        _vm._v("扫描二维码添加"),
                      ]),
                    ],
                    1
                  ),
                ],
                1
              )
            : _vm._e(),
          _vm._l(_vm.devices, function (dev) {
            return _c(
              "v-uni-view",
              {
                key: dev.id,
                staticClass: "dev",
                on: {
                  click: function ($event) {
                    arguments[0] = $event = _vm.$handleEvent($event)
                    _vm.goDetail(dev.id)
                  },
                },
              },
              [
                _c(
                  "v-uni-view",
                  {
                    staticClass: "dev__icon",
                    style: { background: _vm.meta(dev).accentSoft },
                  },
                  [
                    _c("v-uni-text", {
                      staticClass: "dev__icon-t",
                      class: _vm.meta(dev).icon,
                      style: { color: _vm.meta(dev).color },
                    }),
                  ],
                  1
                ),
                _c(
                  "v-uni-view",
                  { staticClass: "dev__main" },
                  [
                    _c("v-uni-text", { staticClass: "dev__name" }, [
                      _vm._v(_vm._s(dev.name)),
                    ]),
                    _c("v-uni-text", { staticClass: "dev__sn" }, [
                      _vm._v(
                        _vm._s(dev.model) +
                          " · " +
                          _vm._s(dev.sn || dev.deviceid)
                      ),
                    ]),
                    dev.typeKey === "band-bp" && _vm.bandLive[dev.deviceid]
                      ? _c(
                          "v-uni-view",
                          { staticClass: "dev__live" },
                          [
                            _c(
                              "v-uni-view",
                              { staticClass: "dev__chip" },
                              [
                                _c("v-uni-text", {
                                  staticClass:
                                    "dev__chip-icon fa-solid fa-heart-pulse",
                                  staticStyle: { color: "#f15533" },
                                }),
                                _c(
                                  "v-uni-text",
                                  { staticClass: "dev__chip-n" },
                                  [
                                    _vm._v(
                                      _vm._s(
                                        _vm.bandLive[dev.deviceid].sbp != null
                                          ? _vm.bandLive[dev.deviceid].sbp
                                          : "--"
                                      )
                                    ),
                                  ]
                                ),
                                _c(
                                  "v-uni-text",
                                  { staticClass: "dev__chip-sep" },
                                  [_vm._v("/")]
                                ),
                                _c(
                                  "v-uni-text",
                                  {
                                    staticClass: "dev__chip-n dev__chip-n--sub",
                                  },
                                  [
                                    _vm._v(
                                      _vm._s(
                                        _vm.bandLive[dev.deviceid].dbp != null
                                          ? _vm.bandLive[dev.deviceid].dbp
                                          : "--"
                                      )
                                    ),
                                  ]
                                ),
                                _c(
                                  "v-uni-text",
                                  { staticClass: "dev__chip-u" },
                                  [_vm._v("mmHg")]
                                ),
                              ],
                              1
                            ),
                            _c(
                              "v-uni-view",
                              { staticClass: "dev__chip" },
                              [
                                _c("v-uni-text", {
                                  staticClass:
                                    "dev__chip-icon fa-solid fa-heart",
                                  staticStyle: { color: "#389a82" },
                                }),
                                _c(
                                  "v-uni-text",
                                  { staticClass: "dev__chip-n" },
                                  [
                                    _vm._v(
                                      _vm._s(
                                        _vm.bandLive[dev.deviceid].hr != null
                                          ? _vm.bandLive[dev.deviceid].hr
                                          : "--"
                                      )
                                    ),
                                  ]
                                ),
                                _c(
                                  "v-uni-text",
                                  { staticClass: "dev__chip-u" },
                                  [_vm._v("bpm")]
                                ),
                              ],
                              1
                            ),
                            _vm.bandLive[dev.deviceid].battery != null
                              ? _c(
                                  "v-uni-view",
                                  { staticClass: "dev__chip" },
                                  [
                                    _c("v-uni-text", {
                                      staticClass: "dev__chip-icon",
                                      class: _vm.batteryIcon(
                                        _vm.bandLive[dev.deviceid].battery
                                      ),
                                      style: {
                                        color: _vm.batteryColor(
                                          _vm.bandLive[dev.deviceid].battery
                                        ),
                                      },
                                    }),
                                    _c(
                                      "v-uni-text",
                                      { staticClass: "dev__chip-n" },
                                      [
                                        _vm._v(
                                          _vm._s(
                                            _vm.bandLive[dev.deviceid].battery
                                          )
                                        ),
                                      ]
                                    ),
                                    _c(
                                      "v-uni-text",
                                      { staticClass: "dev__chip-u" },
                                      [_vm._v("%")]
                                    ),
                                  ],
                                  1
                                )
                              : _vm._e(),
                          ],
                          1
                        )
                      : _c("v-uni-text", { staticClass: "dev__sync" }, [
                          _vm._v("最近同步 " + _vm._s(dev.lastSync)),
                        ]),
                  ],
                  1
                ),
                _c(
                  "v-uni-view",
                  { staticClass: "dev__right" },
                  [
                    _c(
                      "v-uni-view",
                      {
                        staticClass: "dev__status",
                        class: { "dev__status--off": !_vm.isOnline(dev) },
                      },
                      [
                        _c("v-uni-text", { staticClass: "dev__status-dot" }),
                        _c("v-uni-text", { staticClass: "dev__status-t" }, [
                          _vm._v(_vm._s(_vm.isOnline(dev) ? "在线" : "离线")),
                        ]),
                      ],
                      1
                    ),
                    _c("v-uni-text", {
                      staticClass: "fa-solid fa-angle-right dev__arrow",
                    }),
                  ],
                  1
                ),
              ],
              1
            )
          }),
        ],
        2
      ),
      _vm.devices.length > 0
        ? _c("v-uni-view", { staticClass: "hm-safe-bottom" })
        : _vm._e(),
      _vm.devices.length > 0
        ? _c(
            "v-uni-view",
            {
              staticClass: "add-bar",
              on: {
                click: function ($event) {
                  arguments[0] = $event = _vm.$handleEvent($event)
                  _vm.goScan.apply(void 0, arguments)
                },
              },
            },
            [
              _c("v-uni-text", {
                staticClass: "fa-solid fa-plus add-bar__icon",
              }),
              _c("v-uni-text", { staticClass: "add-bar__t" }, [
                _vm._v("添加其他设备"),
              ]),
            ],
            1
          )
        : _vm._e(),
    ],
    1
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "5ILI":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!./node_modules/postcss-loader/src??ref--9-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./src/pages/device/device.vue?vue&type=style&index=0&id=43012106&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "JPst");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "@charset \"UTF-8\";\n/* 安康健康管理 · 设计令牌\n   来源：/workspace/DESIGN.md\n   方案：rpx + SCSS 变量（1px = 2rpx，基于 750rpx 设计基准） */\n/* ---------- 品牌色 ---------- */\n/* ---------- 头像 ---------- */\n/* ---------- 语义状态色 ---------- */\n/* ---------- 金色（尊享装饰） ---------- */\n/* ---------- 背景 ---------- */\n/* 斜向两色渐变：左上(#ddf7ed) → 右下(#f3f3f3)，末端即底色；\n   配合 App.vue 中 background-attachment: fixed 铺满视口固定，不随页面滚动/变长 */\n/* ---------- 文字 ---------- */\n/* ---------- 描边 / 遮罩 ---------- */\n/* ---------- 字体 ---------- */\n/* 英文/数字优先匹配 DIN Pro（Mac 自带 DIN Alternate 作为备选），中文回退苹方/雅黑 */\n/* 移动端最小舒适字号（可读正文下限）：\n   说明/入口/数据标签等可读文字不得小于 12px(24rpx)；\n   $font-size-2xs(10px) 仅限角标、徽标、装饰性元素 */\n/* ---------- 语义排版 ---------- */\n/* ---------- 间距 ---------- */\n/* ---------- 区块标题 ---------- */\n/* 标题下间距 = 列表间距；上间距 = 下间距 × 2 */\n/* ---------- 尺寸 ---------- */\n/* ---------- 圆角（已减半，更克制干净） ---------- */\n/* ---------- 阴影 ---------- */\n/* ---------- 层级 ---------- */\n/* ---------- 动效 ---------- */\n.empty[data-v-43012106] {\n  padding: %?96?% %?48?% %?80?%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n.empty__icon[data-v-43012106] {\n  width: %?128?%;\n  height: %?128?%;\n  border-radius: %?999?%;\n  background: #d4f5ee;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 %?12?% %?48?% rgba(125, 212, 188, 0.18);\n  margin-bottom: %?32?%;\n}\n.empty__icon-t[data-v-43012106] {\n  font-size: %?64?%;\n  color: rgba(0, 0, 0, 0.1);\n}\n.empty__t[data-v-43012106] {\n  font-size: %?32?%;\n  font-weight: 800;\n  color: #1a2a3c;\n  line-height: 1.1;\n}\n.empty__d[data-v-43012106] {\n  display: block;\n  font-size: %?24?%;\n  color: #64748b;\n  line-height: 1.6;\n  margin-top: %?16?%;\n  max-width: %?480?%;\n}\n.empty__btn[data-v-43012106] {\n  margin-top: %?40?%;\n  display: flex;\n  align-items: center;\n  background: #389a82;\n  border-radius: %?999?%;\n  padding: %?24?% %?48?%;\n  box-shadow: 0 %?12?% %?48?% rgba(125, 212, 188, 0.18);\n}\n.empty__btn-icon[data-v-43012106] {\n  color: #ffffff;\n  font-size: %?28?%;\n  margin-right: %?16?%;\n}\n.empty__btn-t[data-v-43012106] {\n  color: #ffffff;\n  font-size: %?28?%;\n  font-weight: 600;\n}\n.dev[data-v-43012106] {\n  display: flex;\n  align-items: center;\n  background: #ffffff;\n  border-radius: %?20?%;\n  box-shadow: 0 %?4?% %?24?% rgba(15, 61, 53, 0.06);\n  padding: %?24?%;\n  margin-bottom: %?32?%;\n  transition: box-shadow 0.2s ease, -webkit-transform 0.1s ease;\n  transition: transform 0.1s ease, box-shadow 0.2s ease;\n  transition: transform 0.1s ease, box-shadow 0.2s ease, -webkit-transform 0.1s ease;\n}\n.dev[data-v-43012106]:active {\n  -webkit-transform: scale(0.99);\n          transform: scale(0.99);\n  box-shadow: 0 %?4?% %?24?% rgba(15, 61, 53, 0.06);\n}\n.dev__icon[data-v-43012106] {\n  width: %?88?%;\n  height: %?88?%;\n  border-radius: %?20?%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.dev__icon-t[data-v-43012106] {\n  font-size: %?44?%;\n}\n.dev__main[data-v-43012106] {\n  flex: 1;\n  padding: 0 %?24?%;\n  overflow: hidden;\n  min-width: 0;\n}\n.dev__name[data-v-43012106] {\n  display: block;\n  font-size: %?32?%;\n  font-weight: 800;\n  color: #1a2a3c;\n  line-height: 1.1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dev__sn[data-v-43012106] {\n  display: block;\n  font-size: %?24?%;\n  color: #334155;\n  margin-top: %?8?%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dev__sync[data-v-43012106] {\n  display: block;\n  font-size: %?20?%;\n  color: #94a3b8;\n  margin-top: %?8?%;\n}\n/* 手环实时数据：指标 chip 行 */\n.dev__live[data-v-43012106] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: %?16?%;\n  margin-top: %?16?%;\n}\n.dev__chip[data-v-43012106] {\n  display: inline-flex;\n  align-items: baseline;\n  padding: %?8?% %?16?%;\n  border-radius: %?12?%;\n  background: #f2f7fa;\n}\n.dev__chip-icon[data-v-43012106] {\n  font-size: %?24?%;\n  margin-right: %?8?%;\n  opacity: 0.9;\n}\n.dev__chip-n[data-v-43012106] {\n  font-family: \"DIN Pro\", \"DIN Alternate\", \"Helvetica Neue\", Arial, sans-serif;\n  font-weight: 800;\n  color: #1a2a3c;\n  font-size: %?28?%;\n  line-height: 1;\n}\n.dev__chip-n--sub[data-v-43012106] {\n  color: #334155;\n}\n.dev__chip-sep[data-v-43012106] {\n  margin: 0 %?4?%;\n  color: #64748b;\n  font-size: %?24?%;\n}\n.dev__chip-u[data-v-43012106] {\n  margin-left: %?8?%;\n  font-size: %?20?%;\n  color: #64748b;\n}\n.dev__right[data-v-43012106] {\n  display: flex;\n  align-items: center;\n  gap: %?16?%;\n  flex-shrink: 0;\n}\n.dev__status[data-v-43012106] {\n  display: flex;\n  align-items: center;\n  flex-shrink: 0;\n  padding: %?8?% %?16?%;\n  border-radius: %?999?%;\n  background: #27ae60;\n}\n.dev__status--off[data-v-43012106] {\n  background: #f2f7fa;\n}\n.dev__status-dot[data-v-43012106] {\n  width: %?12?%;\n  height: %?12?%;\n  border-radius: 50%;\n  background: #ffffff;\n  margin-right: %?8?%;\n}\n.dev__status--off .dev__status-dot[data-v-43012106] {\n  background: #94a3b8;\n}\n.dev__status-t[data-v-43012106] {\n  font-size: %?20?%;\n  color: #ffffff;\n  font-weight: 600;\n}\n.dev__status--off .dev__status-t[data-v-43012106] {\n  color: #64748b;\n}\n.dev__arrow[data-v-43012106] {\n  font-size: %?24?%;\n  color: #94a3b8;\n}\n.add-bar[data-v-43012106] {\n  position: fixed;\n  left: %?32?%;\n  right: %?32?%;\n  /* 底部留出 tabBar(约54px) + 安全间距 */\n  bottom: 64px;\n  height: %?88?%;\n  border-radius: %?999?%;\n  background: #389a82;\n  box-shadow: 0 %?16?% %?96?% rgba(15, 61, 53, 0.1);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: opacity 0.2s ease, -webkit-transform 0.1s ease;\n  transition: opacity 0.2s ease, transform 0.1s ease;\n  transition: opacity 0.2s ease, transform 0.1s ease, -webkit-transform 0.1s ease;\n}\n.add-bar[data-v-43012106]:active {\n  -webkit-transform: scale(0.99);\n          transform: scale(0.99);\n  opacity: 0.9;\n}\n.add-bar__icon[data-v-43012106] {\n  color: #ffffff;\n  font-size: %?32?%;\n  margin-right: %?16?%;\n}\n.add-bar__t[data-v-43012106] {\n  color: #ffffff;\n  font-size: %?28?%;\n  font-weight: 700;\n}", ""]);
// Exports
module.exports = exports;


/***/ }),

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

/***/ "T5pO":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/h5-vue-style-loader??ref--9-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!./node_modules/postcss-loader/src??ref--9-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./src/pages/device/device.vue?vue&type=style&index=0&id=43012106&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!../../../node_modules/postcss-loader/src??ref--9-oneOf-1-3!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./device.vue?vue&type=style&index=0&id=43012106&lang=scss&scoped=true& */ "5ILI");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/h5-vue-style-loader/lib/addStylesClient.js */ "TwZa").default
var update = add("39aa6c93", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "W0N+":
/*!***********************************************************************************************!*\
  !*** ./src/pages/device/device.vue?vue&type=style&index=0&id=43012106&lang=scss&scoped=true& ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_style_index_0_id_43012106_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/h5-vue-style-loader??ref--9-oneOf-1-0!../../../node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!../../../node_modules/postcss-loader/src??ref--9-oneOf-1-3!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./device.vue?vue&type=style&index=0&id=43012106&lang=scss&scoped=true& */ "T5pO");
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_style_index_0_id_43012106_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_style_index_0_id_43012106_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_style_index_0_id_43012106_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_style_index_0_id_43012106_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_style_index_0_id_43012106_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "YNKN":
/*!****************************!*\
  !*** ./src/common/band.js ***!
  \****************************/
/*! exports provided: BAND_SERVER, bandApi, fetchBandLatest, fetchBandAddress, sendBandMessage, bindBandDevice, unbindBandDevice, fetchBandLatestBatch, extractDeviceId, bpLevel */
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extractDeviceId", function() { return extractDeviceId; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bpLevel", function() { return bpLevel; });
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.filter.js */ "TeQF");
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.iterator.constructor.js */ "6fVz");
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.iterator.filter.js */ "kQ2C");
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.iterator.for-each.js */ "fVRX");
/* harmony import */ var core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "07d7");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "rB9j");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_string_match_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.string.match.js */ "Rm1S");
/* harmony import */ var core_js_modules_es_string_match_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_match_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "UxlC");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.string.trim.js */ "SYor");
/* harmony import */ var core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "FZtP");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_9__);










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

/***/ }),

/***/ "cXfp":
/*!**************************************************************!*\
  !*** ./src/pages/device/device.vue?vue&type=script&lang=js& ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_using_components_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/using-components.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./device.vue?vue&type=script&lang=js& */ "keWE");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_using_components_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "jrQb":
/*!********************************************************************************!*\
  !*** ./src/pages/device/device.vue?vue&type=template&id=43012106&scoped=true& ***!
  \********************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_template_id_43012106_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--15-0!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/filter-modules-template.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./device.vue?vue&type=template&id=43012106&scoped=true& */ "3WXb");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_template_id_43012106_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_template_id_43012106_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_template_id_43012106_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_device_vue_vue_type_template_id_43012106_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ "keWE":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/using-components.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./src/pages/device/device.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _workspace_h5build_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/regenerator.js */ "wU9g");
/* harmony import */ var _workspace_h5build_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "HaE+");
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.array.filter.js */ "TeQF");
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.array.find.js */ "fbCW");
/* harmony import */ var core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.map.js */ "2B1R");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.iterator.constructor.js */ "6fVz");
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.iterator.filter.js */ "kQ2C");
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_iterator_find_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.iterator.find.js */ "9mV7");
/* harmony import */ var core_js_modules_es_iterator_find_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_find_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_iterator_map_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.iterator.map.js */ "q0NK");
/* harmony import */ var core_js_modules_es_iterator_map_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_map_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "qePV");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "07d7");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var _common_mock_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/common/mock.js */ "rfkh");
/* harmony import */ var _common_band_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @/common/band.js */ "YNKN");











//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



var LIVE_POLL_MS = 60 * 1000; // 列表页每 1 分钟拉一次手环实时数据（与详情页一致）

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      bandLive: {},
      // { [deviceid]: latestSnapshot }
      timer: null
    };
  },
  computed: {
    devices: function devices() {
      return this.$store.getters.devices;
    }
  },
  onShow: function onShow() {
    var _this = this;
    this.pullBandLive();
    this.clearTimer();
    this.timer = setInterval(function () {
      return _this.pullBandLive();
    }, LIVE_POLL_MS);
  },
  onHide: function onHide() {
    this.clearTimer();
  },
  onUnload: function onUnload() {
    this.clearTimer();
  },
  methods: {
    clearTimer: function clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    // 拉取所有血压款手环的后端实时数据
    pullBandLive: function pullBandLive() {
      var _this2 = this;
      return Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])().m(function _callee() {
        var bandIds, data;
        return Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              bandIds = _this2.devices.filter(function (d) {
                return d.typeKey === 'band-bp' && d.deviceid;
              }).map(function (d) {
                return d.deviceid;
              });
              if (!(bandIds.length === 0)) {
                _context.n = 1;
                break;
              }
              _this2.bandLive = {};
              return _context.a(2);
            case 1:
              _context.n = 2;
              return Object(_common_band_js__WEBPACK_IMPORTED_MODULE_12__["fetchBandLatestBatch"])(bandIds);
            case 2:
              data = _context.v;
              if (data) _this2.bandLive = data;
            case 3:
              return _context.a(2);
          }
        }, _callee);
      }))();
    },
    meta: function meta(dev) {
      return _common_mock_js__WEBPACK_IMPORTED_MODULE_11__["DEVICE_TYPES"].find(function (t) {
        return t.key === dev.typeKey;
      }) || _common_mock_js__WEBPACK_IMPORTED_MODULE_11__["DEVICE_TYPES"][0];
    },
    // 在线判断：血压款以后端 latest 更新时间 + 电量为准，其他设备走 store
    isOnline: function isOnline(dev) {
      if (dev.typeKey === 'band-bp' && dev.deviceid) {
        var l = this.bandLive[dev.deviceid];
        if (!l) return dev.online === true;
        // updatedAt 20 分钟内视为在线
        if (l.updatedAt) return Date.now() - l.updatedAt < 20 * 60 * 1000;
        return l.hr != null || l.sbp != null || l.battery != null;
      }
      return dev.online === true;
    },
    batteryIcon: function batteryIcon(b) {
      var v = Number(b);
      if (isNaN(v)) return 'fa-solid fa-battery-three-quarters';
      if (v >= 80) return 'fa-solid fa-battery-full';
      if (v >= 50) return 'fa-solid fa-battery-three-quarters';
      if (v >= 20) return 'fa-solid fa-battery-half';
      if (v >= 10) return 'fa-solid fa-battery-quarter';
      return 'fa-solid fa-battery-empty';
    },
    batteryColor: function batteryColor(b) {
      var v = Number(b);
      if (isNaN(v)) return '#94a3b8';
      if (v >= 50) return '#27ae60';
      if (v >= 20) return '#f2994a';
      return '#f15533';
    },
    goDetail: function goDetail(id) {
      var dev = this.$store.getters.deviceById(id);
      if (dev && dev.typeKey === 'band-bp') {
        uni.navigateTo({
          url: '/pages/band/status?id=' + id
        });
        return;
      }
      uni.navigateTo({
        url: '/pages/device/detail?id=' + id
      });
    },
    goScan: function goScan() {
      uni.navigateTo({
        url: '/pages/device/scan'
      });
    }
  }
});

/***/ }),

/***/ "vjPZ":
/*!*************************************!*\
  !*** ./src/pages/device/device.vue ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _device_vue_vue_type_template_id_43012106_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./device.vue?vue&type=template&id=43012106&scoped=true& */ "jrQb");
/* harmony import */ var _device_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./device.vue?vue&type=script&lang=js& */ "cXfp");
/* empty/unused harmony star reexport *//* harmony import */ var _device_vue_vue_type_style_index_0_id_43012106_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./device.vue?vue&type=style&index=0&id=43012106&lang=scss&scoped=true& */ "W0N+");
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ "8MXW");

var renderjs





/* normalize component */

var component = Object(_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _device_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _device_vue_vue_type_template_id_43012106_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _device_vue_vue_type_template_id_43012106_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "43012106",
  null,
  false,
  _device_vue_vue_type_template_id_43012106_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

/* hot reload */
if (false) { var api; }
component.options.__file = "pages/device/device.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ })

}]);