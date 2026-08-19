(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-rights-detail"],{

/***/ "2iPq":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--15-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/filter-modules-template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./src/pages/rights/detail.vue?vue&type=template&id=3a209140&scoped=true& ***!
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
      !_vm.right
        ? _c(
            "v-uni-view",
            { staticClass: "miss" },
            [
              _c("hm-navbar", { attrs: { title: "权益详情" } }),
              _c("v-uni-text", {
                staticClass: "miss__icon fa-solid fa-magnifying-glass",
              }),
              _c("v-uni-text", { staticClass: "miss__t" }, [
                _vm._v("未找到该权益记录"),
              ]),
              _c(
                "v-uni-view",
                {
                  staticClass: "miss__btn",
                  on: {
                    click: function ($event) {
                      arguments[0] = $event = _vm.$handleEvent($event)
                      _vm.goRights.apply(void 0, arguments)
                    },
                  },
                },
                [
                  _c("v-uni-text", { staticClass: "miss__btn-t" }, [
                    _vm._v("返回我的权益"),
                  ]),
                ],
                1
              ),
            ],
            1
          )
        : [
            _c(
              "v-uni-view",
              { staticClass: "top" },
              [
                _c("hm-navbar", {
                  attrs: { title: "权益详情", "bg-color": "transparent" },
                }),
                _c(
                  "v-uni-view",
                  { staticClass: "top__body" },
                  [
                    _c(
                      "v-uni-view",
                      { staticClass: "top__row" },
                      [
                        _c("v-uni-text", { staticClass: "top__emoji" }, [
                          _vm._v(_vm._s(_vm.right.icon)),
                        ]),
                        _c(
                          "v-uni-view",
                          { staticClass: "top__main" },
                          [
                            _c("v-uni-text", { staticClass: "top__name" }, [
                              _vm._v(_vm._s(_vm.right.name)),
                            ]),
                            _c("v-uni-text", { staticClass: "top__sub" }, [
                              _vm._v(_vm._s(_vm.right.subtitle)),
                            ]),
                          ],
                          1
                        ),
                      ],
                      1
                    ),
                    _c(
                      "v-uni-view",
                      { staticClass: "top__chips" },
                      [
                        _c(
                          "v-uni-view",
                          { staticClass: "chip" },
                          [
                            _c("v-uni-text", { staticClass: "chip__t" }, [
                              _vm._v(_vm._s(_vm.right.duration)),
                            ]),
                          ],
                          1
                        ),
                        _c(
                          "v-uni-view",
                          { staticClass: "chip" },
                          [
                            _c("v-uni-text", { staticClass: "chip__t" }, [
                              _vm._v(_vm._s(_vm.statusText)),
                            ]),
                          ],
                          1
                        ),
                        _c(
                          "v-uni-view",
                          { staticClass: "chip" },
                          [
                            _c("v-uni-text", { staticClass: "chip__t" }, [
                              _vm._v("剩余 " + _vm._s(_vm.remain)),
                            ]),
                          ],
                          1
                        ),
                      ],
                      1
                    ),
                  ],
                  1
                ),
              ],
              1
            ),
            _c(
              "v-uni-view",
              { staticClass: "hm-card panel" },
              [
                _c(
                  "v-uni-view",
                  { staticClass: "prog" },
                  [
                    _c(
                      "v-uni-view",
                      { staticClass: "prog__head" },
                      [
                        _c("v-uni-text", { staticClass: "prog__t" }, [
                          _vm._v("服务进度"),
                        ]),
                        _c("v-uni-text", { staticClass: "prog__n" }, [
                          _vm._v(
                            _vm._s(_vm.right.usedDays) +
                              " / " +
                              _vm._s(_vm.right.totalDays) +
                              " 天"
                          ),
                        ]),
                      ],
                      1
                    ),
                    _c(
                      "v-uni-view",
                      { staticClass: "prog__bar" },
                      [
                        _c("v-uni-view", {
                          staticClass: "prog__fill",
                          style: {
                            width: _vm.percent + "%",
                            background: _vm.right.accent,
                          },
                        }),
                      ],
                      1
                    ),
                    _c(
                      "v-uni-view",
                      { staticClass: "prog__foot" },
                      [
                        _c("v-uni-text", { staticClass: "prog__d" }, [
                          _vm._v(_vm._s(_vm.right.startAt) + " 开通"),
                        ]),
                        _c("v-uni-text", { staticClass: "prog__d" }, [
                          _vm._v(_vm._s(_vm.right.endAt) + " 到期"),
                        ]),
                      ],
                      1
                    ),
                  ],
                  1
                ),
                _c("v-uni-view", { staticClass: "hm-divider" }),
                _c(
                  "v-uni-view",
                  { staticClass: "stat" },
                  [
                    _c(
                      "v-uni-view",
                      { staticClass: "stat__i" },
                      [
                        _c(
                          "v-uni-text",
                          {
                            staticClass: "stat__n",
                            style: { color: _vm.right.accent },
                          },
                          [_vm._v(_vm._s(_vm.right.usedDays))]
                        ),
                        _c("v-uni-text", { staticClass: "stat__l" }, [
                          _vm._v("已服务天数"),
                        ]),
                      ],
                      1
                    ),
                    _c("v-uni-view", { staticClass: "stat__sep" }),
                    _c(
                      "v-uni-view",
                      { staticClass: "stat__i" },
                      [
                        _c(
                          "v-uni-text",
                          {
                            staticClass: "stat__n",
                            style: { color: _vm.right.accent },
                          },
                          [_vm._v(_vm._s(_vm.remainNum))]
                        ),
                        _c("v-uni-text", { staticClass: "stat__l" }, [
                          _vm._v("剩余天数"),
                        ]),
                      ],
                      1
                    ),
                    _c("v-uni-view", { staticClass: "stat__sep" }),
                    _c(
                      "v-uni-view",
                      { staticClass: "stat__i" },
                      [
                        _c(
                          "v-uni-text",
                          {
                            staticClass: "stat__n",
                            style: { color: _vm.right.accent },
                          },
                          [
                            _vm._v(
                              _vm._s(
                                _vm.right.chatStarted ? "已完成" : "待完成"
                              )
                            ),
                          ]
                        ),
                        _c("v-uni-text", { staticClass: "stat__l" }, [
                          _vm._v("首次问询"),
                        ]),
                      ],
                      1
                    ),
                  ],
                  1
                ),
              ],
              1
            ),
            !_vm.right.wecomAdded
              ? _c(
                  "v-uni-view",
                  { staticClass: "hm-card entry" },
                  [
                    _c(
                      "v-uni-view",
                      { staticClass: "entry__left" },
                      [
                        _c(
                          "v-uni-view",
                          {
                            staticClass: "entry__badge",
                            style: { background: _vm.right.accentSoft },
                          },
                          [
                            _c("v-uni-text", {
                              staticClass:
                                "entry__badge-icon fa-solid fa-user-doctor",
                              style: { color: _vm.right.accent },
                            }),
                          ],
                          1
                        ),
                        _c(
                          "v-uni-view",
                          { staticClass: "entry__main" },
                          [
                            _c("v-uni-text", { staticClass: "entry__t" }, [
                              _vm._v("加企业微信 · 1v1 专属管理师"),
                            ]),
                            _c("v-uni-text", { staticClass: "entry__d" }, [
                              _vm._v(
                                "添加后将协助您完成首次健康问询，并全程跟踪方案"
                              ),
                            ]),
                          ],
                          1
                        ),
                      ],
                      1
                    ),
                    _c(
                      "v-uni-view",
                      {
                        staticClass: "entry__btn",
                        on: {
                          click: function ($event) {
                            arguments[0] = $event = _vm.$handleEvent($event)
                            _vm.openWecom.apply(void 0, arguments)
                          },
                        },
                      },
                      [
                        _c("v-uni-text", { staticClass: "entry__btn-t" }, [
                          _vm._v("立即添加"),
                        ]),
                      ],
                      1
                    ),
                  ],
                  1
                )
              : _c(
                  "v-uni-view",
                  { staticClass: "hm-card entry entry--done" },
                  [
                    _c("v-uni-view", {
                      staticClass: "entry__ok fa-solid fa-circle-check",
                    }),
                    _c(
                      "v-uni-view",
                      { staticClass: "entry__main" },
                      [
                        _c("v-uni-text", { staticClass: "entry__t" }, [
                          _vm._v("已添加健康管理师 · 李静"),
                        ]),
                        _c("v-uni-text", { staticClass: "entry__d" }, [
                          _vm._v("您可在对话中随时发起沟通，或开始首次问询"),
                        ]),
                      ],
                      1
                    ),
                  ],
                  1
                ),
            _c(
              "v-uni-view",
              { staticClass: "sec" },
              [
                _c("v-uni-text", { staticClass: "hm-sec-title" }, [
                  _vm._v("权益内容"),
                ]),
                _c("v-uni-text", { staticClass: "hm-sec-sub" }, [
                  _vm._v("服务期内可使用的全部项目"),
                ]),
              ],
              1
            ),
            _c(
              "v-uni-view",
              { staticClass: "hm-card" },
              _vm._l(_vm.right.services, function (s, i) {
                return _c(
                  "v-uni-view",
                  {
                    key: i,
                    staticClass: "srv",
                    class: { "srv--last": i === _vm.right.services.length - 1 },
                  },
                  [
                    _c(
                      "v-uni-view",
                      {
                        staticClass: "srv__dot",
                        style: { background: _vm.right.accentSoft },
                      },
                      [
                        _c(
                          "v-uni-text",
                          {
                            staticClass: "srv__dot-t",
                            style: { color: _vm.right.accent },
                          },
                          [_vm._v("✓")]
                        ),
                      ],
                      1
                    ),
                    _c(
                      "v-uni-view",
                      { staticClass: "srv__main" },
                      [
                        _c("v-uni-text", { staticClass: "srv__name" }, [
                          _vm._v(_vm._s(s.name)),
                        ]),
                        _c("v-uni-text", { staticClass: "srv__spec" }, [
                          _vm._v(_vm._s(s.spec)),
                        ]),
                      ],
                      1
                    ),
                    _c(
                      "v-uni-text",
                      {
                        staticClass: "srv__tag",
                        style: {
                          color: _vm.right.accent,
                          background: _vm.right.accentSoft,
                        },
                      },
                      [_vm._v("可用")]
                    ),
                  ],
                  1
                )
              }),
              1
            ),
            _c(
              "v-uni-view",
              { staticClass: "sec" },
              [
                _c("v-uni-text", { staticClass: "hm-sec-title" }, [
                  _vm._v("订单信息"),
                ]),
              ],
              1
            ),
            _c(
              "v-uni-view",
              { staticClass: "hm-card" },
              [
                _c(
                  "v-uni-view",
                  { staticClass: "row" },
                  [
                    _c("v-uni-text", { staticClass: "row__l" }, [
                      _vm._v("订单编号"),
                    ]),
                    _c("v-uni-text", { staticClass: "row__v row__v--mono" }, [
                      _vm._v(_vm._s(_vm.right.orderNo)),
                    ]),
                  ],
                  1
                ),
                _c(
                  "v-uni-view",
                  { staticClass: "row" },
                  [
                    _c("v-uni-text", { staticClass: "row__l" }, [
                      _vm._v("服务包"),
                    ]),
                    _c("v-uni-text", { staticClass: "row__v" }, [
                      _vm._v(
                        _vm._s(_vm.right.name) +
                          " · " +
                          _vm._s(_vm.right.duration)
                      ),
                    ]),
                  ],
                  1
                ),
                _c(
                  "v-uni-view",
                  { staticClass: "row" },
                  [
                    _c("v-uni-text", { staticClass: "row__l" }, [
                      _vm._v("实付金额"),
                    ]),
                    _c("v-uni-text", { staticClass: "row__v row__v--price" }, [
                      _vm._v("¥" + _vm._s(_vm.right.price)),
                    ]),
                  ],
                  1
                ),
                _c(
                  "v-uni-view",
                  { staticClass: "row" },
                  [
                    _c("v-uni-text", { staticClass: "row__l" }, [
                      _vm._v("支付时间"),
                    ]),
                    _c("v-uni-text", { staticClass: "row__v" }, [
                      _vm._v(_vm._s(_vm.payAt)),
                    ]),
                  ],
                  1
                ),
                _c(
                  "v-uni-view",
                  { staticClass: "row" },
                  [
                    _c("v-uni-text", { staticClass: "row__l" }, [
                      _vm._v("企业微信"),
                    ]),
                    _c("v-uni-text", { staticClass: "row__v" }, [
                      _vm._v(
                        _vm._s(_vm.right.wecomAdded ? "已添加管理师" : "未添加")
                      ),
                    ]),
                  ],
                  1
                ),
                _c(
                  "v-uni-view",
                  {
                    staticClass: "row",
                    on: {
                      click: function ($event) {
                        arguments[0] = $event = _vm.$handleEvent($event)
                        _vm.goOrders.apply(void 0, arguments)
                      },
                    },
                  },
                  [
                    _c("v-uni-text", { staticClass: "row__l" }, [
                      _vm._v("查看全部订单"),
                    ]),
                    _c("v-uni-text", { staticClass: "row__v row__v--link" }, [
                      _vm._v("前往 ›"),
                    ]),
                  ],
                  1
                ),
              ],
              1
            ),
            _c(
              "v-uni-view",
              { staticClass: "sec" },
              [
                _c("v-uni-text", { staticClass: "hm-sec-title" }, [
                  _vm._v("服务说明"),
                ]),
              ],
              1
            ),
            _c(
              "v-uni-view",
              { staticClass: "hm-card note" },
              [
                _c("v-uni-text", { staticClass: "note__p" }, [
                  _vm._v(
                    "1. 本服务为健康管理与生活方式干预服务，不属于诊疗行为，不可替代医院就诊与医师处方。"
                  ),
                ]),
                _c("v-uni-text", { staticClass: "note__p" }, [
                  _vm._v(
                    "2. 服务期自开通日起计算 " +
                      _vm._s(_vm.right.duration) +
                      "，到期后历史记录仍可查看，但不再推送每日健康指导。"
                  ),
                ]),
                _c("v-uni-text", { staticClass: "note__p" }, [
                  _vm._v(
                    "3. 如出现胸痛、意识障碍、肢体无力等急症表现，请立即就近急诊或拨打 120。"
                  ),
                ]),
                _c("v-uni-text", { staticClass: "note__p" }, [
                  _vm._v(
                    "4. 服务期内可随时在对话中申请调整方案，医师团队将在 1 个工作日内响应。"
                  ),
                ]),
              ],
              1
            ),
            _c("v-uni-view", { staticClass: "bar-holder" }),
            _c(
              "v-uni-view",
              { staticClass: "buybar" },
              [
                _c(
                  "v-uni-view",
                  { staticClass: "buybar__l" },
                  [
                    _c("v-uni-text", { staticClass: "buybar__t" }, [
                      _vm._v(_vm._s(_vm.ctaHint)),
                    ]),
                    _c("v-uni-text", { staticClass: "buybar__d" }, [
                      _vm._v(_vm._s(_vm.ctaDesc)),
                    ]),
                  ],
                  1
                ),
                _c(
                  "v-uni-view",
                  {
                    staticClass: "buybar__btn",
                    style: { background: _vm.right.accent },
                    on: {
                      click: function ($event) {
                        arguments[0] = $event = _vm.$handleEvent($event)
                        _vm.onUse.apply(void 0, arguments)
                      },
                    },
                  },
                  [
                    _c("v-uni-text", { staticClass: "buybar__btn-t" }, [
                      _vm._v(_vm._s(_vm.ctaLabel)),
                    ]),
                  ],
                  1
                ),
              ],
              1
            ),
          ],
      _vm.wecom.show
        ? _c(
            "v-uni-view",
            { staticClass: "mask" },
            [
              _c(
                "v-uni-view",
                { staticClass: "sheet" },
                [
                  _vm.wecom.step === 1
                    ? _c(
                        "v-uni-view",
                        { staticClass: "sheet__pane" },
                        [
                          _c("v-uni-text", {
                            staticClass: "sheet__icon fa-solid fa-user-doctor",
                          }),
                          _c("v-uni-text", { staticClass: "sheet__t" }, [
                            _vm._v("添加您的专属健康管理师"),
                          ]),
                          _c("v-uni-text", { staticClass: "sheet__d" }, [
                            _vm._v(
                              "添加企业微信后，管理师将协助您完成首次健康问询，并全程跟踪服务方案"
                            ),
                          ]),
                          _c(
                            "v-uni-view",
                            { staticClass: "qr" },
                            [
                              _c(
                                "v-uni-view",
                                { staticClass: "qr__box" },
                                [
                                  _vm._l(9, function (n) {
                                    return _c("v-uni-view", {
                                      key: n,
                                      staticClass: "qr__cell",
                                      class: { "qr__cell--on": _vm.qrOn(n) },
                                    })
                                  }),
                                  _c(
                                    "v-uni-view",
                                    { staticClass: "qr__logo" },
                                    [
                                      _c(
                                        "v-uni-text",
                                        { staticClass: "qr__logo-t" },
                                        [_vm._v("企")]
                                      ),
                                    ],
                                    1
                                  ),
                                ],
                                2
                              ),
                              _c("v-uni-text", { staticClass: "qr__hint" }, [
                                _vm._v("长按识别二维码 · 企业微信认证"),
                              ]),
                            ],
                            1
                          ),
                          _c(
                            "v-uni-view",
                            { staticClass: "who" },
                            [
                              _c(
                                "v-uni-view",
                                { staticClass: "who__avatar" },
                                [
                                  _c(
                                    "v-uni-text",
                                    { staticClass: "who__avatar-t" },
                                    [_vm._v("李")]
                                  ),
                                ],
                                1
                              ),
                              _c(
                                "v-uni-view",
                                { staticClass: "who__main" },
                                [
                                  _c(
                                    "v-uni-text",
                                    { staticClass: "who__name" },
                                    [_vm._v("李静 · 高级健康管理师")]
                                  ),
                                  _c(
                                    "v-uni-text",
                                    { staticClass: "who__meta" },
                                    [_vm._v("中级营养师 / 8 年慢病管理经验")]
                                  ),
                                ],
                                1
                              ),
                              _c(
                                "v-uni-view",
                                { staticClass: "who__badge" },
                                [
                                  _c(
                                    "v-uni-text",
                                    { staticClass: "who__badge-t" },
                                    [_vm._v("认证")]
                                  ),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          _c(
                            "v-uni-view",
                            {
                              staticClass: "sheet__btn",
                              on: {
                                click: function ($event) {
                                  arguments[0] = $event =
                                    _vm.$handleEvent($event)
                                  _vm.stepAdd.apply(void 0, arguments)
                                },
                              },
                            },
                            [
                              _c(
                                "v-uni-text",
                                { staticClass: "sheet__btn-t" },
                                [_vm._v("已保存二维码，添加好友")]
                              ),
                            ],
                            1
                          ),
                          _c(
                            "v-uni-text",
                            {
                              staticClass: "sheet__cancel",
                              on: {
                                click: function ($event) {
                                  arguments[0] = $event =
                                    _vm.$handleEvent($event)
                                  _vm.closeWecom.apply(void 0, arguments)
                                },
                              },
                            },
                            [_vm._v("稍后再说")]
                          ),
                        ],
                        1
                      )
                    : _vm.wecom.step === 2
                    ? _c(
                        "v-uni-view",
                        { staticClass: "sheet__pane sheet__pane--center" },
                        [
                          _c("v-uni-view", { staticClass: "spin" }),
                          _c("v-uni-text", { staticClass: "sheet__t" }, [
                            _vm._v("正在发送好友申请…"),
                          ]),
                          _c("v-uni-text", { staticClass: "sheet__d" }, [
                            _vm._v("管理师将在 1 分钟内通过您的申请"),
                          ]),
                        ],
                        1
                      )
                    : _c(
                        "v-uni-view",
                        { staticClass: "sheet__pane sheet__pane--center" },
                        [
                          _c(
                            "v-uni-view",
                            { staticClass: "ok" },
                            [
                              _c("v-uni-text", { staticClass: "ok__t" }, [
                                _vm._v("✓"),
                              ]),
                            ],
                            1
                          ),
                          _c("v-uni-text", { staticClass: "sheet__t" }, [
                            _vm._v("已添加成功"),
                          ]),
                          _c("v-uni-text", { staticClass: "sheet__d" }, [
                            _vm._v(
                              "李静 已通过您的好友申请，对话页会询问是否激活本服务包"
                            ),
                          ]),
                          _c(
                            "v-uni-view",
                            { staticClass: "sheet__row" },
                            [
                              _c(
                                "v-uni-view",
                                {
                                  staticClass: "sheet__btn sheet__btn--sub",
                                  on: {
                                    click: function ($event) {
                                      arguments[0] = $event =
                                        _vm.$handleEvent($event)
                                      _vm.closeWecom.apply(void 0, arguments)
                                    },
                                  },
                                },
                                [
                                  _c(
                                    "v-uni-text",
                                    {
                                      staticClass:
                                        "sheet__btn-t sheet__btn-t--sub",
                                    },
                                    [_vm._v("先看权益")]
                                  ),
                                ],
                                1
                              ),
                              _c(
                                "v-uni-view",
                                {
                                  staticClass: "sheet__btn",
                                  on: {
                                    click: function ($event) {
                                      arguments[0] = $event =
                                        _vm.$handleEvent($event)
                                      _vm.enterChat.apply(void 0, arguments)
                                    },
                                  },
                                },
                                [
                                  _c(
                                    "v-uni-text",
                                    { staticClass: "sheet__btn-t" },
                                    [_vm._v("进入对话")]
                                  ),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                        ],
                        1
                      ),
                ],
                1
              ),
            ],
            1
          )
        : _vm._e(),
    ],
    2
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "8uOI":
/*!*************************************!*\
  !*** ./src/pages/rights/detail.vue ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _detail_vue_vue_type_template_id_3a209140_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./detail.vue?vue&type=template&id=3a209140&scoped=true& */ "Sit6");
/* harmony import */ var _detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./detail.vue?vue&type=script&lang=js& */ "q094");
/* empty/unused harmony star reexport *//* harmony import */ var _detail_vue_vue_type_style_index_0_id_3a209140_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./detail.vue?vue&type=style&index=0&id=3a209140&lang=scss&scoped=true& */ "SWaS");
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ "8MXW");

var renderjs





/* normalize component */

var component = Object(_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _detail_vue_vue_type_template_id_3a209140_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _detail_vue_vue_type_template_id_3a209140_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "3a209140",
  null,
  false,
  _detail_vue_vue_type_template_id_3a209140_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

/* hot reload */
if (false) { var api; }
component.options.__file = "pages/rights/detail.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "SWaS":
/*!***********************************************************************************************!*\
  !*** ./src/pages/rights/detail.vue?vue&type=style&index=0&id=3a209140&lang=scss&scoped=true& ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_style_index_0_id_3a209140_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/h5-vue-style-loader??ref--9-oneOf-1-0!../../../node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!../../../node_modules/postcss-loader/src??ref--9-oneOf-1-3!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./detail.vue?vue&type=style&index=0&id=3a209140&lang=scss&scoped=true& */ "TQrT");
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_style_index_0_id_3a209140_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_style_index_0_id_3a209140_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_style_index_0_id_3a209140_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_style_index_0_id_3a209140_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_style_index_0_id_3a209140_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "Sit6":
/*!********************************************************************************!*\
  !*** ./src/pages/rights/detail.vue?vue&type=template&id=3a209140&scoped=true& ***!
  \********************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_template_id_3a209140_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--15-0!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/filter-modules-template.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./detail.vue?vue&type=template&id=3a209140&scoped=true& */ "2iPq");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_template_id_3a209140_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_template_id_3a209140_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_template_id_3a209140_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_template_id_3a209140_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ "TQrT":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/h5-vue-style-loader??ref--9-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!./node_modules/postcss-loader/src??ref--9-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./src/pages/rights/detail.vue?vue&type=style&index=0&id=3a209140&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!../../../node_modules/postcss-loader/src??ref--9-oneOf-1-3!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./detail.vue?vue&type=style&index=0&id=3a209140&lang=scss&scoped=true& */ "ccys");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/h5-vue-style-loader/lib/addStylesClient.js */ "TwZa").default
var update = add("1159862d", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "ccys":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!./node_modules/postcss-loader/src??ref--9-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./src/pages/rights/detail.vue?vue&type=style&index=0&id=3a209140&lang=scss&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "JPst");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "@charset \"UTF-8\";\n/* 安康健康管理 · 设计令牌\n   来源：/workspace/DESIGN.md\n   方案：rpx + SCSS 变量（1px = 2rpx，基于 750rpx 设计基准） */\n/* ---------- 品牌色 ---------- */\n/* ---------- 头像 ---------- */\n/* ---------- 语义状态色 ---------- */\n/* ---------- 金色（尊享装饰） ---------- */\n/* ---------- 背景 ---------- */\n/* 斜向两色渐变：左上(#ddf7ed) → 右下(#f3f3f3)，末端即底色；\n   配合 App.vue 中 background-attachment: fixed 铺满视口固定，不随页面滚动/变长 */\n/* ---------- 文字 ---------- */\n/* ---------- 描边 / 遮罩 ---------- */\n/* ---------- 字体 ---------- */\n/* 英文/数字优先匹配 DIN Pro（Mac 自带 DIN Alternate 作为备选），中文回退苹方/雅黑 */\n/* 移动端最小舒适字号（可读正文下限）：\n   说明/入口/数据标签等可读文字不得小于 12px(24rpx)；\n   $font-size-2xs(10px) 仅限角标、徽标、装饰性元素 */\n/* ---------- 语义排版 ---------- */\n/* ---------- 间距 ---------- */\n/* ---------- 区块标题 ---------- */\n/* 标题下间距 = 列表间距；上间距 = 下间距 × 2 */\n/* ---------- 尺寸 ---------- */\n/* ---------- 圆角（已减半，更克制干净） ---------- */\n/* ---------- 阴影 ---------- */\n/* ---------- 层级 ---------- */\n/* ---------- 动效 ---------- */\n.top[data-v-3a209140] {\n  background: transparent;\n  padding-bottom: %?40?%;\n}\n.top__body[data-v-3a209140] {\n  padding: %?16?% %?32?% 0;\n}\n.top__row[data-v-3a209140] {\n  display: flex;\n  align-items: center;\n}\n.top__emoji[data-v-3a209140] {\n  color: rgba(0, 0, 0, 0.1);\n  width: %?96?%;\n  height: %?96?%;\n  border-radius: %?20?%;\n  background: #ffffff;\n  box-shadow: 0 %?4?% %?24?% rgba(15, 61, 53, 0.06);\n  font-size: %?48?%;\n  text-align: center;\n  line-height: %?96?%;\n  margin-right: %?24?%;\n}\n.top__main[data-v-3a209140] {\n  flex: 1;\n}\n.top__name[data-v-3a209140] {\n  display: block;\n  font-size: %?56?%;\n  font-weight: 800;\n  line-height: 1.1;\n  color: #1a2a3c;\n  letter-spacing: %?1?%;\n}\n.top__sub[data-v-3a209140] {\n  display: block;\n  margin-top: %?8?%;\n  font-size: %?24?%;\n  color: #64748b;\n  line-height: 1.4;\n}\n.top__chips[data-v-3a209140] {\n  display: flex;\n  flex-wrap: wrap;\n  margin-top: %?24?%;\n}\n.chip[data-v-3a209140] {\n  padding: %?8?% %?24?%;\n  border-radius: %?999?%;\n  background: rgba(212, 245, 238, 0.72);\n  border: %?1?% solid rgba(56, 154, 130, 0.12);\n  margin-right: %?16?%;\n  margin-bottom: %?8?%;\n}\n.chip__t[data-v-3a209140] {\n  font-size: %?20?%;\n  color: #389a82;\n}\n.hm-card[data-v-3a209140] {\n  margin: %?32?% %?32?% 0;\n  padding: %?24?%;\n}\n.prog__head[data-v-3a209140] {\n  display: flex;\n  justify-content: space-between;\n  align-items: baseline;\n}\n.prog__t[data-v-3a209140] {\n  font-size: %?28?%;\n  font-weight: 600;\n  color: #1a2a3c;\n}\n.prog__n[data-v-3a209140] {\n  font-size: %?24?%;\n  color: #64748b;\n}\n.prog__bar[data-v-3a209140] {\n  height: %?16?%;\n  border-radius: %?999?%;\n  background: #f2f7fa;\n  margin-top: %?16?%;\n  overflow: hidden;\n}\n.prog__fill[data-v-3a209140] {\n  height: 100%;\n  border-radius: %?999?%;\n}\n.prog__foot[data-v-3a209140] {\n  display: flex;\n  justify-content: space-between;\n  margin-top: %?16?%;\n}\n.prog__d[data-v-3a209140] {\n  font-size: %?20?%;\n  color: #94a3b8;\n}\n.stat[data-v-3a209140] {\n  display: flex;\n  align-items: center;\n}\n.stat__i[data-v-3a209140] {\n  flex: 1;\n  text-align: center;\n}\n.stat__n[data-v-3a209140] {\n  display: block;\n  font-size: %?36?%;\n  font-weight: 700;\n}\n.stat__l[data-v-3a209140] {\n  display: block;\n  margin-top: %?8?%;\n  font-size: %?20?%;\n  color: #64748b;\n}\n.stat__sep[data-v-3a209140] {\n  width: %?1?%;\n  height: %?64?%;\n  background: #f2f7fa;\n}\n.sec[data-v-3a209140] {\n  padding: %?40?% %?32?% %?16?%;\n  display: flex;\n  align-items: baseline;\n  justify-content: space-between;\n}\n.srv[data-v-3a209140] {\n  display: flex;\n  align-items: center;\n  padding-bottom: %?24?%;\n  margin-bottom: %?24?%;\n  border-bottom: %?1?% solid rgba(15, 61, 53, 0.06);\n}\n.srv--last[data-v-3a209140] {\n  padding-bottom: 0;\n  margin-bottom: 0;\n  border-bottom: none;\n}\n.srv__dot[data-v-3a209140] {\n  width: %?48?%;\n  height: %?48?%;\n  border-radius: %?6?%;\n  text-align: center;\n  line-height: %?48?%;\n  margin-right: %?24?%;\n}\n.srv__dot-t[data-v-3a209140] {\n  font-size: %?24?%;\n  font-weight: 700;\n}\n.srv__main[data-v-3a209140] {\n  flex: 1;\n}\n.srv__name[data-v-3a209140] {\n  display: block;\n  font-size: %?28?%;\n  font-weight: 600;\n  color: #1a2a3c;\n}\n.srv__spec[data-v-3a209140] {\n  display: block;\n  margin-top: %?8?%;\n  font-size: %?24?%;\n  color: #64748b;\n}\n.srv__tag[data-v-3a209140] {\n  padding: %?8?% %?16?%;\n  border-radius: %?999?%;\n  font-size: %?20?%;\n}\n.row[data-v-3a209140] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: %?24?% 0;\n  border-bottom: %?1?% solid rgba(15, 61, 53, 0.06);\n}\n.row[data-v-3a209140]:last-child {\n  border-bottom: none;\n}\n.row__l[data-v-3a209140] {\n  font-size: %?28?%;\n  color: #64748b;\n}\n.row__v[data-v-3a209140] {\n  font-size: %?28?%;\n  color: #1a2a3c;\n  font-weight: 500;\n}\n.row__v--mono[data-v-3a209140] {\n  font-size: %?24?%;\n  letter-spacing: %?1?%;\n}\n.row__v--price[data-v-3a209140] {\n  color: #f15533;\n  font-weight: 700;\n}\n.row__v--link[data-v-3a209140] {\n  color: #389a82;\n}\n.note__p[data-v-3a209140] {\n  display: block;\n  font-size: %?24?%;\n  color: #64748b;\n  line-height: 1.6;\n  margin-bottom: %?16?%;\n}\n.note__p[data-v-3a209140]:last-child {\n  margin-bottom: 0;\n}\n.bar-holder[data-v-3a209140] {\n  height: calc(env(safe-area-inset-bottom) + %?144?%);\n}\n.buybar[data-v-3a209140] {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 3000;\n  display: flex;\n  align-items: center;\n  padding: %?16?% %?32?%;\n  padding-bottom: calc(env(safe-area-inset-bottom) + %?16?%);\n  background: rgba(255, 255, 255, 0.78);\n  -webkit-backdrop-filter: blur(18px) saturate(180%);\n          backdrop-filter: blur(18px) saturate(180%);\n  box-shadow: 0 %?16?% %?96?% rgba(15, 61, 53, 0.1);\n}\n.buybar__l[data-v-3a209140] {\n  flex: 1;\n}\n.buybar__t[data-v-3a209140] {\n  display: block;\n  font-size: %?28?%;\n  font-weight: 600;\n  color: #1a2a3c;\n}\n.buybar__d[data-v-3a209140] {\n  display: block;\n  margin-top: %?8?%;\n  font-size: %?20?%;\n  color: #94a3b8;\n}\n.buybar__btn[data-v-3a209140] {\n  padding: %?24?% %?40?%;\n  border-radius: %?999?%;\n  box-shadow: 0 %?12?% %?48?% rgba(125, 212, 188, 0.18);\n}\n.buybar__btn-t[data-v-3a209140] {\n  font-size: %?28?%;\n  font-weight: 700;\n  color: #ffffff;\n}\n.miss[data-v-3a209140] {\n  padding-bottom: %?96?%;\n  text-align: center;\n}\n.miss__icon[data-v-3a209140] {\n  display: block;\n  margin-top: %?96?%;\n  font-size: %?88?%;\n}\n.miss__t[data-v-3a209140] {\n  display: block;\n  margin-top: %?24?%;\n  font-size: %?32?%;\n  color: #64748b;\n}\n.miss__btn[data-v-3a209140] {\n  display: inline-block;\n  margin-top: %?40?%;\n  padding: %?24?% %?48?%;\n  border-radius: %?999?%;\n  background: #7dd4bc;\n}\n.miss__btn-t[data-v-3a209140] {\n  font-size: %?28?%;\n  font-weight: 600;\n  color: #ffffff;\n}\n/* 健康管理师引导卡 */\n.entry[data-v-3a209140] {\n  margin: %?32?% %?32?% 0;\n  padding: %?24?%;\n  display: flex;\n  align-items: center;\n  gap: %?16?%;\n  background: #ffffff;\n  border: %?1?% solid rgba(15, 61, 53, 0.06);\n  box-shadow: 0 %?4?% %?24?% rgba(15, 61, 53, 0.06);\n}\n.entry__left[data-v-3a209140] {\n  display: flex;\n  align-items: center;\n  flex: 1;\n  min-width: 0;\n}\n.entry__badge[data-v-3a209140] {\n  width: %?64?%;\n  height: %?64?%;\n  border-radius: %?20?%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n}\n.entry__badge-icon[data-v-3a209140] {\n  font-size: %?36?%;\n}\n.entry__main[data-v-3a209140] {\n  padding-left: %?16?%;\n  flex: 1;\n  min-width: 0;\n}\n.entry__t[data-v-3a209140] {\n  display: block;\n  font-size: %?28?%;\n  font-weight: 700;\n  color: #1a2a3c;\n}\n.entry__d[data-v-3a209140] {\n  display: block;\n  font-size: %?20?%;\n  color: #64748b;\n  margin-top: %?8?%;\n  line-height: 1.4;\n}\n.entry__btn[data-v-3a209140] {\n  padding: %?16?% %?32?%;\n  border-radius: %?999?%;\n  background: #7dd4bc;\n  flex-shrink: 0;\n  box-shadow: 0 %?4?% %?24?% rgba(15, 61, 53, 0.06);\n}\n.entry__btn-t[data-v-3a209140] {\n  color: #ffffff;\n  font-size: %?24?%;\n  font-weight: 700;\n  white-space: nowrap;\n}\n.entry--done[data-v-3a209140] {\n  background: #d4f5ee;\n  border-color: transparent;\n}\n.entry__ok[data-v-3a209140] {\n  font-size: %?48?%;\n  color: #27ae60;\n  flex-shrink: 0;\n}\n/* 加企微弹层（bottom sheet） */\n.mask[data-v-3a209140] {\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  background: rgba(15, 61, 53, 0.1);\n  z-index: 4000;\n  display: flex;\n  align-items: flex-end;\n}\n.sheet[data-v-3a209140] {\n  width: 100%;\n  background: #ffffff;\n  border-top-left-radius: %?24?%;\n  border-top-right-radius: %?24?%;\n  padding: %?40?% %?40?% calc(env(safe-area-inset-bottom) + %?48?%);\n  -webkit-animation: rise-data-v-3a209140 0.28s ease-out;\n          animation: rise-data-v-3a209140 0.28s ease-out;\n}\n@-webkit-keyframes rise-data-v-3a209140 {\nfrom {\n    -webkit-transform: translateY(%?60?%);\n            transform: translateY(%?60?%);\n    opacity: 0.4;\n}\nto {\n    -webkit-transform: translateY(0);\n            transform: translateY(0);\n    opacity: 1;\n}\n}\n@keyframes rise-data-v-3a209140 {\nfrom {\n    -webkit-transform: translateY(%?60?%);\n            transform: translateY(%?60?%);\n    opacity: 0.4;\n}\nto {\n    -webkit-transform: translateY(0);\n            transform: translateY(0);\n    opacity: 1;\n}\n}\n.sheet__pane[data-v-3a209140] {\n  display: flex;\n  flex-direction: column;\n}\n.sheet__pane--center[data-v-3a209140] {\n  align-items: center;\n  padding: %?32?% 0 %?16?%;\n}\n.sheet__icon[data-v-3a209140] {\n  font-size: %?64?%;\n  text-align: center;\n}\n.sheet__t[data-v-3a209140] {\n  font-size: %?36?%;\n  font-weight: 700;\n  color: #1a2a3c;\n  text-align: center;\n  margin-top: %?16?%;\n}\n.sheet__d[data-v-3a209140] {\n  font-size: %?24?%;\n  color: #64748b;\n  text-align: center;\n  margin-top: %?16?%;\n  line-height: 1.6;\n}\n.qr[data-v-3a209140] {\n  margin-top: %?32?%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n}\n.qr__box[data-v-3a209140] {\n  width: %?300?%;\n  height: %?300?%;\n  background: #f3f3f3;\n  border: %?1?% solid rgba(15, 61, 53, 0.06);\n  border-radius: %?20?%;\n  padding: %?16?%;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n  align-content: space-between;\n  position: relative;\n}\n.qr__cell[data-v-3a209140] {\n  width: %?78?%;\n  height: %?78?%;\n  border-radius: %?10?%;\n  background: #edf5f2;\n}\n.qr__cell--on[data-v-3a209140] {\n  background: #7dd4bc;\n}\n.qr__logo[data-v-3a209140] {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: %?78?%;\n  height: %?78?%;\n  margin: %?-39?% 0 0 %?-39?%;\n  border-radius: %?14?%;\n  background: #ffffff;\n  border: %?4?% solid #7dd4bc;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.qr__logo-t[data-v-3a209140] {\n  font-size: %?36?%;\n  font-weight: 700;\n  color: #389a82;\n}\n.qr__hint[data-v-3a209140] {\n  font-size: %?20?%;\n  color: #94a3b8;\n  margin-top: %?16?%;\n}\n.who[data-v-3a209140] {\n  margin-top: %?32?%;\n  background: #d4f5ee;\n  border-radius: %?20?%;\n  padding: %?24?%;\n  display: flex;\n  align-items: center;\n}\n.who__avatar[data-v-3a209140] {\n  width: %?64?%;\n  height: %?64?%;\n  border-radius: 50%;\n  background: #7dd4bc;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.who__avatar-t[data-v-3a209140] {\n  color: #ffffff;\n  font-size: %?32?%;\n  font-weight: 700;\n}\n.who__main[data-v-3a209140] {\n  flex: 1;\n  padding: 0 %?16?%;\n}\n.who__name[data-v-3a209140] {\n  display: block;\n  font-size: %?28?%;\n  font-weight: 700;\n  color: #389a82;\n}\n.who__meta[data-v-3a209140] {\n  display: block;\n  font-size: %?20?%;\n  color: #389a82;\n  opacity: 0.8;\n  margin-top: %?8?%;\n}\n.who__badge[data-v-3a209140] {\n  background: #7dd4bc;\n  border-radius: %?999?%;\n  padding: %?8?% %?16?%;\n}\n.who__badge-t[data-v-3a209140] {\n  color: #ffffff;\n  font-size: %?20?%;\n}\n.sheet__row[data-v-3a209140] {\n  width: 100%;\n  margin-top: %?32?%;\n  display: flex;\n  gap: %?16?%;\n}\n.sheet__btn[data-v-3a209140] {\n  flex: 1;\n  background: #7dd4bc;\n  border-radius: %?999?%;\n  padding: %?24?% 0;\n  text-align: center;\n  box-shadow: 0 %?4?% %?24?% rgba(15, 61, 53, 0.06);\n}\n.sheet__btn--sub[data-v-3a209140] {\n  background: transparent;\n  border: %?1?% solid #c6d2de;\n  box-shadow: none;\n}\n.sheet__btn-t[data-v-3a209140] {\n  color: #ffffff;\n  font-size: %?32?%;\n  font-weight: 700;\n  letter-spacing: %?1?%;\n}\n.sheet__btn-t--sub[data-v-3a209140] {\n  color: #334155;\n}\n.sheet__cancel[data-v-3a209140] {\n  text-align: center;\n  font-size: %?24?%;\n  color: #94a3b8;\n  margin-top: %?24?%;\n}\n.spin[data-v-3a209140] {\n  width: %?64?%;\n  height: %?64?%;\n  border: %?4?% solid rgba(15, 61, 53, 0.06);\n  border-top-color: #389a82;\n  border-radius: 50%;\n  -webkit-animation: spin-data-v-3a209140 0.8s linear infinite;\n          animation: spin-data-v-3a209140 0.8s linear infinite;\n}\n@-webkit-keyframes spin-data-v-3a209140 {\nto {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n}\n}\n@keyframes spin-data-v-3a209140 {\nto {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n}\n}\n.ok[data-v-3a209140] {\n  width: %?96?%;\n  height: %?96?%;\n  border-radius: 50%;\n  background: #27ae60;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  -webkit-animation: pop-data-v-3a209140 0.4s ease-out;\n          animation: pop-data-v-3a209140 0.4s ease-out;\n}\n.ok__t[data-v-3a209140] {\n  color: #ffffff;\n  font-size: %?56?%;\n  font-weight: 700;\n}\n@-webkit-keyframes pop-data-v-3a209140 {\n0% {\n    -webkit-transform: scale(0.3);\n            transform: scale(0.3);\n    opacity: 0;\n}\n60% {\n    -webkit-transform: scale(1.14);\n            transform: scale(1.14);\n    opacity: 1;\n}\n100% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n}\n}\n@keyframes pop-data-v-3a209140 {\n0% {\n    -webkit-transform: scale(0.3);\n            transform: scale(0.3);\n    opacity: 0;\n}\n60% {\n    -webkit-transform: scale(1.14);\n            transform: scale(1.14);\n    opacity: 1;\n}\n100% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n}\n}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "q094":
/*!**************************************************************!*\
  !*** ./src/pages/rights/detail.vue?vue&type=script&lang=js& ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_using_components_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/using-components.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./detail.vue?vue&type=script&lang=js& */ "z6yA");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_using_components_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_detail_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "z6yA":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/using-components.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./src/pages/rights/detail.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_index_of_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.index-of.js */ "yXV3");
/* harmony import */ var core_js_modules_es_array_index_of_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_index_of_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.push.js */ "FNk8");
/* harmony import */ var core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_push_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.iterator.constructor.js */ "6fVz");
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.iterator.for-each.js */ "fVRX");
/* harmony import */ var core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "07d7");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "FZtP");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_5__);






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

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      id: '',
      wecom: {
        show: false,
        step: 1
      },
      timers: []
    };
  },
  computed: {
    right: function right() {
      return this.$store.getters.rightById(this.id);
    },
    statusText: function statusText() {
      var r = this.right;
      if (!r) return '';
      if (r.status !== 'active') return '已到期';
      return r.chatStarted ? '服务进行中' : '待开始使用';
    },
    remainNum: function remainNum() {
      var r = this.right;
      if (!r) return 0;
      var n = Math.ceil((r.endTs - Date.now()) / 86400000);
      return n > 0 ? n : 0;
    },
    remain: function remain() {
      return this.remainNum > 0 ? this.remainNum + ' 天' : '已到期';
    },
    percent: function percent() {
      var r = this.right;
      if (!r || !r.totalDays) return 0;
      var p = Math.round(r.usedDays / r.totalDays * 100);
      return Math.min(100, Math.max(2, p));
    },
    payAt: function payAt() {
      var r = this.right;
      if (!r) return '';
      var o = this.$store.getters.orderByNo(r.orderNo);
      return o && o.payAt || r.startAt;
    },
    // 底部 CTA 文案（三步状态）
    ctaLabel: function ctaLabel() {
      var r = this.right;
      if (!r) return '';
      if (!r.wecomAdded) return '添加企业微信';
      if (r.chatStarted) return '继续健康对话';
      return '开始首次问询';
    },
    ctaHint: function ctaHint() {
      var r = this.right;
      if (!r) return '';
      if (!r.wecomAdded) return '先加健康管理师';
      if (r.chatStarted) return '方案进行中';
      return '请完成首次问询';
    },
    ctaDesc: function ctaDesc() {
      var r = this.right;
      if (!r) return '';
      if (!r.wecomAdded) return '1v1 专属管理师协助激活服务包';
      if (r.chatStarted) return '每日健康指导已推送至首页';
      return '约 2 分钟，共 5 个问题';
    }
  },
  onLoad: function onLoad(opt) {
    this.id = opt && opt.id || '';
    if (!this.id) {
      var a = this.$store.getters.activeRight;
      if (a) this.id = a.id;
    }
  },
  onUnload: function onUnload() {
    this.timers.forEach(function (t) {
      return clearTimeout(t);
    });
    this.timers = [];
  },
  methods: {
    delay: function delay(fn, ms) {
      this.timers.push(setTimeout(fn, ms));
    },
    qrOn: function qrOn(n) {
      return [1, 2, 3, 4, 6, 7, 9].indexOf(n) > -1;
    },
    openWecom: function openWecom() {
      this.wecom = {
        show: true,
        step: 1
      };
    },
    closeWecom: function closeWecom() {
      this.wecom.show = false;
    },
    stepAdd: function stepAdd() {
      var _this = this;
      this.wecom.step = 2;
      this.delay(function () {
        _this.wecom.step = 3;
        _this.$store.dispatch('bindWecom', _this.id);
      }, 1800);
    },
    enterChat: function enterChat() {
      this.wecom.show = false;
      uni.navigateTo({
        url: '/pages/chat/chat?rightId=' + this.id
      });
    },
    onUse: function onUse() {
      var r = this.right;
      if (!r) return;
      if (!r.wecomAdded) {
        this.openWecom();
        return;
      }
      uni.navigateTo({
        url: '/pages/chat/chat?rightId=' + r.id
      });
    },
    goRights: function goRights() {
      uni.reLaunch({
        url: '/pages/rights/rights'
      });
    },
    goOrders: function goOrders() {
      uni.navigateTo({
        url: '/pages/mine/orders'
      });
    }
  }
});

/***/ })

}]);