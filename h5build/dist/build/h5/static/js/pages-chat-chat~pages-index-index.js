(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-chat-chat~pages-index-index"],{

/***/ "52ql":
/*!****************************************************!*\
  !*** ./src/components/hm-timeline/hm-timeline.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _hm_timeline_vue_vue_type_template_id_65b63418_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./hm-timeline.vue?vue&type=template&id=65b63418&scoped=true& */ "UENE");
/* harmony import */ var _hm_timeline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./hm-timeline.vue?vue&type=script&lang=js& */ "PXCM");
/* empty/unused harmony star reexport *//* harmony import */ var _hm_timeline_vue_vue_type_style_index_0_id_65b63418_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./hm-timeline.vue?vue&type=style&index=0&id=65b63418&lang=scss&scoped=true& */ "WWRa");
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ "8MXW");

var renderjs





/* normalize component */

var component = Object(_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _hm_timeline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _hm_timeline_vue_vue_type_template_id_65b63418_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _hm_timeline_vue_vue_type_template_id_65b63418_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "65b63418",
  null,
  false,
  _hm_timeline_vue_vue_type_template_id_65b63418_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

/* hot reload */
if (false) { var api; }
component.options.__file = "components/hm-timeline/hm-timeline.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "MEg9":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/using-components.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./src/components/hm-timeline/hm-timeline.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_parse_int_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.parse-int.js */ "4l63");
/* harmony import */ var core_js_modules_es_parse_int_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_parse_int_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "rB9j");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_regexp_test_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.regexp.test.js */ "ALS0");
/* harmony import */ var core_js_modules_es_regexp_test_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_test_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "UxlC");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _common_mock_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/common/mock.js */ "rfkh");




//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


var COVER_TAICHI = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' + encodeURIComponent('video cover of an elderly person practicing tai chi in a green park at morning, warm sunlight, health lifestyle, clean composition') + '&image_size=landscape_16_9';
var COVER_WALK = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' + encodeURIComponent('video cover of a middle-aged man brisk walking on a tree-lined path, golden hour, health lifestyle, clean composition') + '&image_size=landscape_16_9';
var FALLBACK_IMG = '/static/img/placeholder.png';
/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'hm-timeline',
  props: {
    items: {
      type: Array,
      default: function _default() {
        return [];
      }
    }
  },
  data: function data() {
    return {
      checked: {}
    };
  },
  methods: {
    meta: function meta(cat) {
      return _common_mock_js__WEBPACK_IMPORTED_MODULE_4__["CAT_META"][cat] || {
        label: '指导',
        color: '#389a82',
        bg: '#d4f5ee'
      };
    },
    // 视频封面加载失败时兜底为本地占位图
    onCoverErr: function onCoverErr(item) {
      this.$set(item, '_coverFail', true);
    },
    // 面性图标对比度规则：深色底用浅色图标(#fff)，浅色底用 $icon-ink(透明黑 alpha=0.1)
    iconColor: function iconColor(cat) {
      var hex = (this.meta(cat).color || '').replace('#', '');
      if (!/^[0-9a-f]{6}$/i.test(hex)) return '#ffffff';
      var n = parseInt(hex, 16);
      var lum = (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255;
      return lum > 0.55 ? 'rgba(0, 0, 0, 0.1)' : '#ffffff';
    },
    exerciseCover: function exerciseCover(title) {
      var t = title || '';
      if (/太极|八段锦|瑜伽|冥想|拉伸|呼吸|正念/.test(t)) return COVER_TAICHI;
      if (/走|跑|泳|游|行|骑/.test(t)) return COVER_WALK;
      return COVER_WALK;
    },
    toggleCheck: function toggleCheck(idx) {
      this.$set(this.checked, idx, !this.checked[idx]);
      uni.showToast({
        title: this.checked[idx] ? '打卡成功' : '已取消打卡',
        icon: 'none'
      });
    },
    goAssess: function goAssess() {
      uni.navigateTo({
        url: '/pages/chat/chat'
      });
    },
    playVideo: function playVideo(title) {
      uni.showToast({
        title: '「' + (title || '跟练视频') + '」演示',
        icon: 'none'
      });
    }
  }
});

/***/ }),

/***/ "PXCM":
/*!*****************************************************************************!*\
  !*** ./src/components/hm-timeline/hm-timeline.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_using_components_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/using-components.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./hm-timeline.vue?vue&type=script&lang=js& */ "MEg9");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_using_components_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "Ti2B":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/h5-vue-style-loader??ref--9-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!./node_modules/postcss-loader/src??ref--9-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./src/components/hm-timeline/hm-timeline.vue?vue&type=style&index=0&id=65b63418&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../../../node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!../../../node_modules/postcss-loader/src??ref--9-oneOf-1-3!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./hm-timeline.vue?vue&type=style&index=0&id=65b63418&lang=scss&scoped=true& */ "ZKEX");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/h5-vue-style-loader/lib/addStylesClient.js */ "TwZa").default
var update = add("7f7365d8", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "UENE":
/*!***********************************************************************************************!*\
  !*** ./src/components/hm-timeline/hm-timeline.vue?vue&type=template&id=65b63418&scoped=true& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_template_id_65b63418_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--15-0!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/filter-modules-template.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./hm-timeline.vue?vue&type=template&id=65b63418&scoped=true& */ "ewDN");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_template_id_65b63418_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_template_id_65b63418_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_template_id_65b63418_scoped_true___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_template_id_65b63418_scoped_true___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ "WWRa":
/*!**************************************************************************************************************!*\
  !*** ./src/components/hm-timeline/hm-timeline.vue?vue&type=style&index=0&id=65b63418&lang=scss&scoped=true& ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_style_index_0_id_65b63418_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/h5-vue-style-loader??ref--9-oneOf-1-0!../../../node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!../../../node_modules/postcss-loader/src??ref--9-oneOf-1-3!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../../../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./hm-timeline.vue?vue&type=style&index=0&id=65b63418&lang=scss&scoped=true& */ "Ti2B");
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_style_index_0_id_65b63418_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_style_index_0_id_65b63418_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_style_index_0_id_65b63418_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_style_index_0_id_65b63418_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_hm_timeline_vue_vue_type_style_index_0_id_65b63418_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "ZKEX":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!./node_modules/postcss-loader/src??ref--9-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./src/components/hm-timeline/hm-timeline.vue?vue&type=style&index=0&id=65b63418&lang=scss&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../../../node_modules/css-loader/dist/runtime/api.js */ "JPst");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "@charset \"UTF-8\";\n/* 安康健康管理 · 设计令牌\n   来源：/workspace/DESIGN.md\n   方案：rpx + SCSS 变量（1px = 2rpx，基于 750rpx 设计基准） */\n/* ---------- 品牌色 ---------- */\n/* ---------- 头像 ---------- */\n/* ---------- 语义状态色 ---------- */\n/* ---------- 金色（尊享装饰） ---------- */\n/* ---------- 背景 ---------- */\n/* 斜向两色渐变：左上(#ddf7ed) → 右下(#f3f3f3)，末端即底色；\n   配合 App.vue 中 background-attachment: fixed 铺满视口固定，不随页面滚动/变长 */\n/* ---------- 文字 ---------- */\n/* ---------- 描边 / 遮罩 ---------- */\n/* ---------- 字体 ---------- */\n/* 英文/数字优先匹配 DIN Pro（Mac 自带 DIN Alternate 作为备选），中文回退苹方/雅黑 */\n/* 移动端最小舒适字号（可读正文下限）：\n   说明/入口/数据标签等可读文字不得小于 12px(24rpx)；\n   $font-size-2xs(10px) 仅限角标、徽标、装饰性元素 */\n/* ---------- 语义排版 ---------- */\n/* ---------- 间距 ---------- */\n/* ---------- 区块标题 ---------- */\n/* 标题上间距三倍于下间距：上远下近，强化层级 */\n/* ---------- 尺寸 ---------- */\n/* ---------- 圆角（已减半，更克制干净） ---------- */\n/* ---------- 阴影 ---------- */\n/* ---------- 层级 ---------- */\n/* ---------- 动效 ---------- */\n.tl__row[data-v-65b63418] {\n  display: flex;\n  align-items: stretch;\n}\n.tl__rail[data-v-65b63418] {\n  width: %?64?%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  flex-shrink: 0;\n}\n.tl__dot[data-v-65b63418] {\n  width: %?56?%;\n  height: %?56?%;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-top: %?8?%;\n  box-shadow: 0 %?4?% %?24?% rgba(15, 61, 53, 0.06);\n}\n.tl__dot-icon[data-v-65b63418] {\n  font-size: %?28?%;\n  line-height: %?28?%;\n}\n.tl__line[data-v-65b63418] {\n  flex: 1;\n  width: %?1?%;\n  background: #f2f7fa;\n  margin: %?8?% 0;\n}\n.tl__card[data-v-65b63418] {\n  flex: 1;\n  background: #ffffff;\n  border-radius: %?20?%;\n  padding: %?24?%;\n  margin: 0 0 %?32?% %?8?%;\n  box-shadow: 0 %?4?% %?24?% rgba(15, 61, 53, 0.06);\n}\n.tl__head[data-v-65b63418] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: %?8?%;\n}\n.tl__time[data-v-65b63418] {\n  font-size: %?28?%;\n  font-weight: 700;\n  color: #334155;\n  letter-spacing: %?1?%;\n}\n.tl__tag[data-v-65b63418] {\n  font-size: %?20?%;\n  padding: %?8?% %?16?%;\n  border-radius: %?999?%;\n}\n.tl__title[data-v-65b63418] {\n  display: block;\n  font-size: %?28?%;\n  font-weight: 600;\n  color: #1a2a3c;\n  margin-bottom: %?8?%;\n}\n.tl__desc[data-v-65b63418] {\n  display: block;\n  font-size: %?24?%;\n  color: #64748b;\n  line-height: 1.6;\n}\n/* ---------- 运动：视频封面 ---------- */\n.tl__cover[data-v-65b63418] {\n  position: relative;\n  margin-top: %?16?%;\n  border-radius: %?12?%;\n  overflow: hidden;\n}\n.tl__cover-img[data-v-65b63418] {\n  width: 100%;\n  height: %?320?%;\n  display: block;\n}\n.tl__cover-mask[data-v-65b63418] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: linear-gradient(180deg, rgba(15, 61, 53, 0.05) 55%, rgba(15, 61, 53, 0.42));\n}\n.tl__cover-play[data-v-65b63418] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: %?64?%;\n  height: %?64?%;\n  margin-left: %?-32?%;\n  margin-top: %?-32?%;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.92);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 %?12?% %?48?% rgba(125, 212, 188, 0.18);\n}\n.tl__cover-play-icon[data-v-65b63418] {\n  color: #389a82;\n  font-size: %?28?%;\n  margin-left: %?4?%;\n}\n.tl__cover-dur[data-v-65b63418] {\n  position: absolute;\n  right: %?16?%;\n  bottom: %?16?%;\n  color: #ffffff;\n  font-size: %?20?%;\n  background: rgba(0, 0, 0, 0.35);\n  padding: %?2?% %?8?%;\n  border-radius: %?6?%;\n  letter-spacing: %?1?%;\n}\n.tl__cover-label[data-v-65b63418] {\n  position: absolute;\n  left: %?16?%;\n  bottom: %?16?%;\n  color: #ffffff;\n  font-size: %?20?%;\n  background: rgba(0, 0, 0, 0.35);\n  padding: %?2?% %?8?%;\n  border-radius: %?6?%;\n}\n/* ---------- 操作按钮（餐/评估） ---------- */\n.tl__action[data-v-65b63418] {\n  margin-top: %?16?%;\n  display: inline-flex;\n  align-items: center;\n  padding: %?8?% %?24?%;\n  border-radius: %?999?%;\n  background: #d4f5ee;\n  border: %?1?% solid rgba(56, 154, 130, 0.12);\n}\n.tl__action--primary[data-v-65b63418] {\n  background: rgba(212, 245, 238, 0.72);\n}\n.tl__action--done[data-v-65b63418] {\n  background: #f2f7fa;\n}\n.tl__action-icon[data-v-65b63418] {\n  font-size: %?24?%;\n  margin-right: %?8?%;\n  color: rgba(0, 0, 0, 0.1);\n}\n.tl__action--done .tl__action-icon[data-v-65b63418] {\n  color: #27ae60;\n}\n.tl__action-t[data-v-65b63418] {\n  font-size: %?24?%;\n  font-weight: 600;\n  color: #389a82;\n}\n.tl__action--done .tl__action-t[data-v-65b63418] {\n  color: #64748b;\n}", ""]);
// Exports
module.exports = exports;


/***/ }),

/***/ "ewDN":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--15-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/filter-modules-template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./src/components/hm-timeline/hm-timeline.vue?vue&type=template&id=65b63418&scoped=true& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return recyclableRender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
var components
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "v-uni-view",
    { staticClass: "tl" },
    _vm._l(_vm.items, function (item, idx) {
      return _c(
        "v-uni-view",
        { key: idx, staticClass: "tl__row" },
        [
          _c(
            "v-uni-view",
            { staticClass: "tl__rail" },
            [
              _c(
                "v-uni-view",
                {
                  staticClass: "tl__dot",
                  style: { background: _vm.meta(item.cat).color },
                },
                [
                  _c("v-uni-text", {
                    staticClass: "tl__dot-icon",
                    class: item.icon,
                    style: { color: _vm.iconColor(item.cat) },
                  }),
                ],
                1
              ),
              idx < _vm.items.length - 1
                ? _c("v-uni-view", { staticClass: "tl__line" })
                : _vm._e(),
            ],
            1
          ),
          _c(
            "v-uni-view",
            { staticClass: "tl__card" },
            [
              _c(
                "v-uni-view",
                { staticClass: "tl__head" },
                [
                  _c("v-uni-text", { staticClass: "tl__time" }, [
                    _vm._v(_vm._s(item.time)),
                  ]),
                  _c(
                    "v-uni-text",
                    {
                      staticClass: "tl__tag",
                      style: {
                        color: _vm.meta(item.cat).color,
                        background: _vm.meta(item.cat).bg,
                      },
                    },
                    [_vm._v(" " + _vm._s(_vm.meta(item.cat).label) + " ")]
                  ),
                ],
                1
              ),
              _c("v-uni-text", { staticClass: "tl__title" }, [
                _vm._v(_vm._s(item.title)),
              ]),
              _c("v-uni-text", { staticClass: "tl__desc" }, [
                _vm._v(_vm._s(item.desc)),
              ]),
              item.cat === "exercise"
                ? _c(
                    "v-uni-view",
                    {
                      staticClass: "tl__cover",
                      on: {
                        click: function ($event) {
                          arguments[0] = $event = _vm.$handleEvent($event)
                          _vm.playVideo(item.title)
                        },
                      },
                    },
                    [
                      _c("v-uni-image", {
                        staticClass: "tl__cover-img",
                        attrs: {
                          src: item._coverFail
                            ? _vm.FALLBACK_IMG
                            : _vm.exerciseCover(item.title),
                          mode: "aspectFill",
                        },
                        on: {
                          error: function ($event) {
                            arguments[0] = $event = _vm.$handleEvent($event)
                            _vm.onCoverErr(item)
                          },
                        },
                      }),
                      _c("v-uni-view", { staticClass: "tl__cover-mask" }),
                      _c(
                        "v-uni-view",
                        { staticClass: "tl__cover-play" },
                        [
                          _c("v-uni-text", {
                            staticClass: "fa-solid fa-play tl__cover-play-icon",
                          }),
                        ],
                        1
                      ),
                      _c("v-uni-text", { staticClass: "tl__cover-dur" }, [
                        _vm._v("02:30"),
                      ]),
                      _c("v-uni-text", { staticClass: "tl__cover-label" }, [
                        _vm._v("跟练视频"),
                      ]),
                    ],
                    1
                  )
                : _vm._e(),
              item.cat === "nutrition"
                ? _c(
                    "v-uni-view",
                    {
                      staticClass: "tl__action",
                      class: { "tl__action--done": _vm.checked[idx] },
                      on: {
                        click: function ($event) {
                          arguments[0] = $event = _vm.$handleEvent($event)
                          _vm.toggleCheck(idx)
                        },
                      },
                    },
                    [
                      _c("v-uni-text", {
                        staticClass: "tl__action-icon",
                        class: _vm.checked[idx]
                          ? "fa-solid fa-circle-check"
                          : "fa-solid fa-camera",
                      }),
                      _c("v-uni-text", { staticClass: "tl__action-t" }, [
                        _vm._v(
                          _vm._s(_vm.checked[idx] ? "已拍照打卡" : "拍照打卡")
                        ),
                      ]),
                    ],
                    1
                  )
                : _vm._e(),
              item.cat === "assessment"
                ? _c(
                    "v-uni-view",
                    {
                      staticClass: "tl__action tl__action--primary",
                      on: {
                        click: function ($event) {
                          arguments[0] = $event = _vm.$handleEvent($event)
                          _vm.goAssess.apply(void 0, arguments)
                        },
                      },
                    },
                    [
                      _c("v-uni-text", {
                        staticClass:
                          "tl__action-icon fa-solid fa-clipboard-list",
                      }),
                      _c("v-uni-text", { staticClass: "tl__action-t" }, [
                        _vm._v("立即评估"),
                      ]),
                    ],
                    1
                  )
                : _vm._e(),
            ],
            1
          ),
        ],
        1
      )
    }),
    1
  )
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ })

}]);