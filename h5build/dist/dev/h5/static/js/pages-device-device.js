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
                      : dev.typeKey === "radar" && _vm.radarLive[dev.deviceid]
                      ? _c(
                          "v-uni-view",
                          { staticClass: "dev__live" },
                          [
                            _c(
                              "v-uni-view",
                              { staticClass: "dev__chip" },
                              [
                                _c("v-uni-text", {
                                  staticClass: "dev__chip-icon",
                                  class: _vm.inBedIcon(dev.deviceid),
                                  style: {
                                    color: _vm.inBedColor(dev.deviceid),
                                  },
                                }),
                                _c(
                                  "v-uni-text",
                                  {
                                    staticClass: "dev__chip-n dev__chip-n--txt",
                                  },
                                  [_vm._v(_vm._s(_vm.inBedText(dev.deviceid)))]
                                ),
                              ],
                              1
                            ),
                            _vm.radarLive[dev.deviceid].respRate != null
                              ? _c(
                                  "v-uni-view",
                                  { staticClass: "dev__chip" },
                                  [
                                    _c("v-uni-text", {
                                      staticClass:
                                        "dev__chip-icon fa-solid fa-wind",
                                      staticStyle: { color: "#8dcdd8" },
                                    }),
                                    _c(
                                      "v-uni-text",
                                      { staticClass: "dev__chip-n" },
                                      [
                                        _vm._v(
                                          _vm._s(
                                            _vm.radarLive[dev.deviceid].respRate
                                          )
                                        ),
                                      ]
                                    ),
                                    _c(
                                      "v-uni-text",
                                      { staticClass: "dev__chip-u" },
                                      [_vm._v("次/分")]
                                    ),
                                  ],
                                  1
                                )
                              : _vm._e(),
                            _vm.radarLive[dev.deviceid].bodyMove != null
                              ? _c(
                                  "v-uni-view",
                                  { staticClass: "dev__chip" },
                                  [
                                    _c("v-uni-text", {
                                      staticClass:
                                        "dev__chip-icon fa-solid fa-person-walking",
                                      staticStyle: { color: "#f2994a" },
                                    }),
                                    _c(
                                      "v-uni-text",
                                      { staticClass: "dev__chip-n" },
                                      [
                                        _vm._v(
                                          _vm._s(
                                            _vm.radarLive[dev.deviceid].bodyMove
                                          )
                                        ),
                                      ]
                                    ),
                                    _c(
                                      "v-uni-text",
                                      { staticClass: "dev__chip-u" },
                                      [_vm._v("次")]
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
exports.push([module.i, "@charset \"UTF-8\";\n/* 享相健康+ · 设计令牌\n   来源：/workspace/DESIGN.md\n   方案：rpx + SCSS 变量（1px = 2rpx，基于 750rpx 设计基准） */\n/* ---------- 品牌色 ---------- */\n/* ---------- 头像 ---------- */\n/* ---------- 语义状态色 ---------- */\n/* ---------- 金色（尊享装饰） ---------- */\n/* ---------- 背景 ---------- */\n/* 斜向两色渐变：左上(#ddf7ed) → 右下(#f3f3f3)，末端即底色；\n   配合 App.vue 中 background-attachment: fixed 铺满视口固定，不随页面滚动/变长 */\n/* ---------- 文字 ---------- */\n/* ---------- 描边 / 遮罩 ---------- */\n/* ---------- 字体 ---------- */\n/* 英文/数字优先匹配 DIN Pro（Mac 自带 DIN Alternate 作为备选），中文回退苹方/雅黑 */\n/* 移动端最小舒适字号（可读正文下限）：\n   说明/入口/数据标签等可读文字不得小于 12px(24rpx)；\n   $font-size-2xs(10px) 仅限角标、徽标、装饰性元素 */\n/* ---------- 语义排版 ---------- */\n/* ---------- 间距 ---------- */\n/* ---------- 区块标题 ---------- */\n/* 标题下间距 = 列表间距；上间距 = 下间距 × 2 */\n/* ---------- 尺寸 ---------- */\n/* ---------- 圆角（已减半，更克制干净） ---------- */\n/* ---------- 阴影 ---------- */\n/* ---------- 层级 ---------- */\n/* ---------- 动效 ---------- */\n.empty[data-v-43012106] {\n  padding: %?96?% %?48?% %?80?%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n.empty__icon[data-v-43012106] {\n  width: %?128?%;\n  height: %?128?%;\n  border-radius: %?999?%;\n  background: #d4f5ee;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 %?12?% %?48?% rgba(125, 212, 188, 0.18);\n  margin-bottom: %?32?%;\n}\n.empty__icon-t[data-v-43012106] {\n  font-size: %?64?%;\n  color: rgba(0, 0, 0, 0.1);\n}\n.empty__t[data-v-43012106] {\n  font-size: %?32?%;\n  font-weight: 800;\n  color: #1a2a3c;\n  line-height: 1.1;\n}\n.empty__d[data-v-43012106] {\n  display: block;\n  font-size: %?24?%;\n  color: #64748b;\n  line-height: 1.6;\n  margin-top: %?16?%;\n  max-width: %?480?%;\n}\n.empty__btn[data-v-43012106] {\n  margin-top: %?40?%;\n  display: flex;\n  align-items: center;\n  background: #389a82;\n  border-radius: %?999?%;\n  padding: %?24?% %?48?%;\n  box-shadow: 0 %?12?% %?48?% rgba(125, 212, 188, 0.18);\n}\n.empty__btn-icon[data-v-43012106] {\n  color: #ffffff;\n  font-size: %?28?%;\n  margin-right: %?16?%;\n}\n.empty__btn-t[data-v-43012106] {\n  color: #ffffff;\n  font-size: %?28?%;\n  font-weight: 600;\n}\n.dev[data-v-43012106] {\n  display: flex;\n  align-items: center;\n  background: #ffffff;\n  border-radius: %?20?%;\n  box-shadow: 0 %?4?% %?24?% rgba(15, 61, 53, 0.06);\n  padding: %?24?%;\n  margin-left: %?32?%;\n  margin-right: %?32?%;\n  margin-bottom: %?32?%;\n  transition: box-shadow 0.2s ease, -webkit-transform 0.1s ease;\n  transition: transform 0.1s ease, box-shadow 0.2s ease;\n  transition: transform 0.1s ease, box-shadow 0.2s ease, -webkit-transform 0.1s ease;\n}\n.dev[data-v-43012106]:active {\n  -webkit-transform: scale(0.99);\n          transform: scale(0.99);\n  box-shadow: 0 %?4?% %?24?% rgba(15, 61, 53, 0.06);\n}\n.dev__icon[data-v-43012106] {\n  width: %?88?%;\n  height: %?88?%;\n  border-radius: %?20?%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.dev__icon-t[data-v-43012106] {\n  font-size: %?44?%;\n}\n.dev__main[data-v-43012106] {\n  flex: 1;\n  padding: 0 %?24?%;\n  overflow: hidden;\n  min-width: 0;\n}\n.dev__name[data-v-43012106] {\n  display: block;\n  font-size: %?32?%;\n  font-weight: 800;\n  color: #1a2a3c;\n  line-height: 1.1;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dev__sn[data-v-43012106] {\n  display: block;\n  font-size: %?24?%;\n  color: #334155;\n  margin-top: %?8?%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.dev__sync[data-v-43012106] {\n  display: block;\n  font-size: %?20?%;\n  color: #94a3b8;\n  margin-top: %?8?%;\n}\n/* 手环实时数据：指标 chip 行 */\n.dev__live[data-v-43012106] {\n  display: flex;\n  align-items: center;\n  flex-wrap: wrap;\n  gap: %?16?%;\n  margin-top: %?16?%;\n}\n.dev__chip[data-v-43012106] {\n  display: inline-flex;\n  align-items: baseline;\n  padding: %?8?% %?16?%;\n  border-radius: %?12?%;\n  background: #f2f7fa;\n}\n.dev__chip-icon[data-v-43012106] {\n  font-size: %?24?%;\n  margin-right: %?8?%;\n  opacity: 0.9;\n}\n.dev__chip-n[data-v-43012106] {\n  font-family: \"DIN Pro\", \"DIN Alternate\", \"Helvetica Neue\", Arial, sans-serif;\n  font-weight: 800;\n  color: #1a2a3c;\n  font-size: %?28?%;\n  line-height: 1;\n}\n.dev__chip-n--sub[data-v-43012106] {\n  color: #334155;\n}\n/* 中文短语（如\"在床/离床\"）不走英文数字字体，避免字形与字重错位 */\n.dev__chip-n--txt[data-v-43012106] {\n  font-family: inherit;\n  font-weight: 700;\n  font-size: %?24?%;\n}\n.dev__chip-sep[data-v-43012106] {\n  margin: 0 %?4?%;\n  color: #64748b;\n  font-size: %?24?%;\n}\n.dev__chip-u[data-v-43012106] {\n  margin-left: %?8?%;\n  font-size: %?20?%;\n  color: #64748b;\n}\n.dev__right[data-v-43012106] {\n  display: flex;\n  align-items: center;\n  gap: %?16?%;\n  flex-shrink: 0;\n}\n.dev__status[data-v-43012106] {\n  display: flex;\n  align-items: center;\n  flex-shrink: 0;\n  padding: %?8?% %?16?%;\n  border-radius: %?999?%;\n  background: #27ae60;\n}\n.dev__status--off[data-v-43012106] {\n  background: #f2f7fa;\n}\n.dev__status-dot[data-v-43012106] {\n  width: %?12?%;\n  height: %?12?%;\n  border-radius: 50%;\n  background: #ffffff;\n  margin-right: %?8?%;\n}\n.dev__status--off .dev__status-dot[data-v-43012106] {\n  background: #94a3b8;\n}\n.dev__status-t[data-v-43012106] {\n  font-size: %?20?%;\n  color: #ffffff;\n  font-weight: 600;\n}\n.dev__status--off .dev__status-t[data-v-43012106] {\n  color: #64748b;\n}\n.dev__arrow[data-v-43012106] {\n  font-size: %?24?%;\n  color: #94a3b8;\n}\n.add-bar[data-v-43012106] {\n  position: fixed;\n  left: %?32?%;\n  right: %?32?%;\n  /* 底部留出 tabBar(约54px) + 安全间距 */\n  bottom: 64px;\n  height: %?88?%;\n  border-radius: %?999?%;\n  background: #389a82;\n  box-shadow: 0 %?16?% %?96?% rgba(15, 61, 53, 0.1);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: opacity 0.2s ease, -webkit-transform 0.1s ease;\n  transition: opacity 0.2s ease, transform 0.1s ease;\n  transition: opacity 0.2s ease, transform 0.1s ease, -webkit-transform 0.1s ease;\n}\n.add-bar[data-v-43012106]:active {\n  -webkit-transform: scale(0.99);\n          transform: scale(0.99);\n  opacity: 0.9;\n}\n.add-bar__icon[data-v-43012106] {\n  color: #ffffff;\n  font-size: %?32?%;\n  margin-right: %?16?%;\n}\n.add-bar__t[data-v-43012106] {\n  color: #ffffff;\n  font-size: %?28?%;\n  font-weight: 700;\n}", ""]);
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

/***/ "gMwk":
/*!*****************************!*\
  !*** ./src/common/radar.js ***!
  \*****************************/
/*! exports provided: lastRadarError, getLastRadarError, fetchRadarStatus, pingRadarPlatform, verifyRadarDevice, listRadarDevices, fetchRadarRecord, fetchRadarLatest, fetchRadarLatestBatch, fetchRadarAttributes, bindRadarDevice, unbindRadarDevice, RADAR_STATE_TEXT, radarStateText, radarInBed, respLevel */
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
/* harmony import */ var _workspace_h5build_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/typeof.js */ "U8pU");
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.array.filter.js */ "TeQF");
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.find.js */ "fbCW");
/* harmony import */ var core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.array.map.js */ "2B1R");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.iterator.constructor.js */ "6fVz");
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.iterator.filter.js */ "kQ2C");
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_iterator_find_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.iterator.find.js */ "9mV7");
/* harmony import */ var core_js_modules_es_iterator_find_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_find_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_iterator_map_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.iterator.map.js */ "q0NK");
/* harmony import */ var core_js_modules_es_iterator_map_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_map_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "qePV");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.object.keys.js */ "tkto");
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "07d7");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "rB9j");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var core_js_modules_es_regexp_test_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.regexp.test.js */ "ALS0");
/* harmony import */ var core_js_modules_es_regexp_test_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_test_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var _common_mock_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @/common/mock.js */ "rfkh");
/* harmony import */ var _common_band_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @/common/band.js */ "YNKN");
/* harmony import */ var _common_radar_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @/common/radar.js */ "gMwk");















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





// SSE 事件 800ms 内批量合并，避免 pb 高频上报触发多次 pull
var MERGE_MS = 800;
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      bandLive: {},
      // { [deviceid]: latestSnapshot }
      radarLive: {},
      // { [deviceid]: 雷达最新快照 }
      _sub: null,
      _mergeTimer: null
    };
  },
  computed: {
    devices: function devices() {
      return this.$store.getters.devices;
    }
  },
  onShow: function onShow() {
    this.pullBandLive();
    this.pullRadarLive();
    this.startSse();
  },
  onHide: function onHide() {
    this.stopSse();
    this._clearMerge();
  },
  onUnload: function onUnload() {
    this.stopSse();
    this._clearMerge();
  },
  methods: {
    startSse: function startSse() {
      var _this = this;
      this.stopSse();
      this._sub = Object(_common_band_js__WEBPACK_IMPORTED_MODULE_16__["subscribeEvents"])({
        kinds: ['pb', 'alarm', 'sos', 'status', 'deviceinfo', 'device_bind', 'device_unbind', 'radar'],
        onEvent: function onEvent(evt) {
          return _this.handleSse(evt);
        }
      });
    },
    stopSse: function stopSse() {
      if (this._sub) {
        try {
          this._sub.close();
        } catch (e) {}
        this._sub = null;
      }
    },
    _clearMerge: function _clearMerge() {
      if (this._mergeTimer) {
        clearTimeout(this._mergeTimer);
        this._mergeTimer = null;
      }
    },
    handleSse: function handleSse(evt) {
      var _this2 = this;
      var kind = evt.kind || '';
      var p = evt && evt.payload || {};
      // device_bind / unbind：直接刷新列表 store（无需特殊处理，Vuex 会联动）
      // 有 deviceid 且带快照：按事件类型分流写入 radarLive / bandLive
      if (p && p.deviceid && p.snapshot && Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_typeof_js__WEBPACK_IMPORTED_MODULE_2__["default"])(p.snapshot) === 'object') {
        var snap = Object.assign({}, p.snapshot || {});
        for (var _i = 0, _Object$keys = Object.keys(snap); _i < _Object$keys.length; _i++) {
          var k = _Object$keys[_i];
          if (snap[k] === null || snap[k] === undefined || snap[k] === '') delete snap[k];
        }
        var bucket = kind === 'radar' ? 'radarLive' : 'bandLive';
        var prev = this[bucket][p.deviceid] || {};
        this.$set(this[bucket], p.deviceid, Object.assign({}, prev, snap));
      }
      // 其他变动（在线状态、新增设备等）：延迟合并批量拉 1 次
      this._clearMerge();
      this._mergeTimer = setTimeout(function () {
        _this2._mergeTimer = null;
        _this2.pullBandLive();
        _this2.pullRadarLive();
      }, MERGE_MS);
      // 异常告警：设备列表页不需要强弹窗，仅用轻 toast（去重依赖 mergeTimer 合并）
      if (kind === 'alarm') {
        uni.showToast({
          title: '某手环上报健康告警',
          icon: 'none'
        });
      } else if (kind === 'sos') {
        uni.showToast({
          title: '⚠️ 收到手环 SOS 呼叫',
          icon: 'none'
        });
      }
    },
    // 拉取所有血压款手环的后端实时数据
    pullBandLive: function pullBandLive() {
      var _this3 = this;
      return Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])().m(function _callee() {
        var bandIds, data;
        return Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              bandIds = _this3.devices.filter(function (d) {
                return /^band/.test(d.typeKey || '') && d.deviceid;
              }).map(function (d) {
                return d.deviceid;
              });
              if (!(bandIds.length === 0)) {
                _context.n = 1;
                break;
              }
              _this3.bandLive = {};
              return _context.a(2);
            case 1:
              _context.n = 2;
              return Object(_common_band_js__WEBPACK_IMPORTED_MODULE_16__["fetchBandLatestBatch"])(bandIds);
            case 2:
              data = _context.v;
              if (data) _this3.bandLive = data;
            case 3:
              return _context.a(2);
          }
        }, _callee);
      }))();
    },
    // 拉取所有睡眠监测仪（雷达款）的后端实时数据
    pullRadarLive: function pullRadarLive() {
      var _this4 = this;
      return Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])().m(function _callee2() {
        var ids, data;
        return Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              ids = _this4.devices.filter(function (d) {
                return d.typeKey === 'radar' && d.deviceid;
              }).map(function (d) {
                return d.deviceid;
              });
              if (!(ids.length === 0)) {
                _context2.n = 1;
                break;
              }
              _this4.radarLive = {};
              return _context2.a(2);
            case 1:
              _context2.n = 2;
              return Object(_common_radar_js__WEBPACK_IMPORTED_MODULE_17__["fetchRadarLatestBatch"])(ids);
            case 2:
              data = _context2.v;
              if (data) _this4.radarLive = data;
            case 3:
              return _context2.a(2);
          }
        }, _callee2);
      }))();
    },
    // 在床状态：true 在床 / false 离床 / null 平台未上报该属性
    inBedText: function inBedText(deviceid) {
      var v = Object(_common_radar_js__WEBPACK_IMPORTED_MODULE_17__["radarInBed"])(this.radarLive[deviceid]);
      if (v === true) return '在床';
      if (v === false) return '离床';
      return '待上报';
    },
    inBedIcon: function inBedIcon(deviceid) {
      var v = Object(_common_radar_js__WEBPACK_IMPORTED_MODULE_17__["radarInBed"])(this.radarLive[deviceid]);
      if (v === true) return 'fa-solid fa-bed';
      if (v === false) return 'fa-solid fa-person-walking-arrow-right';
      return 'fa-solid fa-satellite-dish';
    },
    inBedColor: function inBedColor(deviceid) {
      var v = Object(_common_radar_js__WEBPACK_IMPORTED_MODULE_17__["radarInBed"])(this.radarLive[deviceid]);
      if (v === true) return '#389a82';
      if (v === false) return '#f2994a';
      return '#94a3b8';
    },
    meta: function meta(dev) {
      return _common_mock_js__WEBPACK_IMPORTED_MODULE_15__["DEVICE_TYPES"].find(function (t) {
        return t.key === dev.typeKey;
      }) || _common_mock_js__WEBPACK_IMPORTED_MODULE_15__["DEVICE_TYPES"][0];
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
      // 雷达款：以平台推送的最近上报时间为准（雷达常驻供电，上报间隔通常在分钟级）
      if (dev.typeKey === 'radar' && dev.deviceid) {
        var _l = this.radarLive[dev.deviceid];
        if (!_l) return dev.online === true;
        if (_l.ts) return Date.now() - _l.ts < 20 * 60 * 1000;
        return false;
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
      // 来源为设备列表 tab：绑定成功后 switchTab 回本页查看新设备
      uni.navigateTo({
        url: '/pages/device/scan?from=device'
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