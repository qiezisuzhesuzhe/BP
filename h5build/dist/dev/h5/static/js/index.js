/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"index": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "static/js/" + ({"pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1":"pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1","pages-band-status":"pages-band-status","pages-chat-chat~pages-index-index":"pages-chat-chat~pages-index-index","pages-chat-chat":"pages-chat-chat","pages-index-index":"pages-index-index","pages-device-detail":"pages-device-detail","pages-device-device":"pages-device-device","pages-device-scan":"pages-device-scan","pages-health-health":"pages-health-health","pages-mall-mall":"pages-mall-mall","pages-message-message":"pages-message-message","pages-mine-agreement":"pages-mine-agreement","pages-mine-mine":"pages-mine-mine","pages-mine-orders":"pages-mine-orders","pages-mine-profile":"pages-mine-profile","pages-pay-pay":"pages-pay-pay","pages-rights-detail":"pages-rights-detail","pages-rights-rights":"pages-rights-rights","pages-service-detail":"pages-service-detail"}[chunkId]||chunkId) + ".js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([0,"chunk-vendors"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /workspace/h5build/src/main.js */"Vtdi");


/***/ }),

/***/ "9Lmf":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--15-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/filter-modules-template.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/wrap-loader??ref--18!./src/App.vue?vue&type=template&id=472cff63& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
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
  return _c("App", { attrs: { keepAliveInclude: _vm.keepAliveInclude } })
}
var recyclableRender = false
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "E77e":
/*!****************************************************!*\
  !*** ./src/App.vue?vue&type=template&id=472cff63& ***!
  \****************************************************/
/*! exports provided: render, staticRenderFns, recyclableRender, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_template_id_472cff63___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--15-0!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/filter-modules-template.js!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/page-meta.js!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/wrap-loader??ref--18!./App.vue?vue&type=template&id=472cff63& */ "9Lmf");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_template_id_472cff63___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_template_id_472cff63___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "recyclableRender", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_template_id_472cff63___WEBPACK_IMPORTED_MODULE_0__["recyclableRender"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_15_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_filter_modules_template_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_page_meta_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_template_id_472cff63___WEBPACK_IMPORTED_MODULE_0__["components"]; });



/***/ }),

/***/ "GSuk":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/h5-vue-style-loader??ref--9-oneOf-1-0!./node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!./node_modules/postcss-loader/src??ref--9-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/wrap-loader??ref--18!./src/App.vue?vue&type=style&index=0&lang=scss& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(/*! !../node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!../node_modules/postcss-loader/src??ref--9-oneOf-1-3!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/wrap-loader??ref--18!./App.vue?vue&type=style&index=0&lang=scss& */ "yEaF");
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(/*! ../node_modules/@dcloudio/vue-cli-plugin-uni/packages/h5-vue-style-loader/lib/addStylesClient.js */ "TwZa").default
var update = add("9efe5c22", content, false, {"sourceMap":false,"shadowMode":false});
// Hot Module Replacement
if(false) {}

/***/ }),

/***/ "I77X":
/*!**********************************************!*\
  !*** ./src/App.vue?vue&type=script&lang=js& ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_using_components_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/babel-loader/lib!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/using-components.js!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/wrap-loader??ref--18!./App.vue?vue&type=script&lang=js& */ "O07N");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_13_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_16_0_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_uni_app_loader_using_components_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "O07N":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--13-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--16-0!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-uni-app-loader/using-components.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/wrap-loader??ref--18!./src/App.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _common_band_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/common/band.js */ "YNKN");

/* harmony default export */ __webpack_exports__["default"] = ({
  onLaunch: function onLaunch() {},
  onShow: function onShow() {},
  // 暴露给"设置页/开发者调试页"配置后端地址用
  methods: {
    setBandServer: _common_band_js__WEBPACK_IMPORTED_MODULE_0__["setBandServer"],
    getBandServer: _common_band_js__WEBPACK_IMPORTED_MODULE_0__["getBandServer"]
  }
});

/***/ }),

/***/ "Pf3K":
/*!*********************!*\
  !*** ./src/App.vue ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _App_vue_vue_type_template_id_472cff63___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App.vue?vue&type=template&id=472cff63& */ "E77e");
/* harmony import */ var _App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App.vue?vue&type=script&lang=js& */ "I77X");
/* empty/unused harmony star reexport *//* harmony import */ var _App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App.vue?vue&type=style&index=0&lang=scss& */ "XAuw");
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js */ "8MXW");

var renderjs





/* normalize component */

var component = Object(_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _App_vue_vue_type_template_id_472cff63___WEBPACK_IMPORTED_MODULE_0__["render"],
  _App_vue_vue_type_template_id_472cff63___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null,
  false,
  _App_vue_vue_type_template_id_472cff63___WEBPACK_IMPORTED_MODULE_0__["components"],
  renderjs
)

/* hot reload */
if (false) { var api; }
component.options.__file = "App.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "Q2AE":
/*!****************************!*\
  !*** ./src/store/index.js ***!
  \****************************/
/*! exports provided: fmtDate, fmtDateTime, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fmtDate", function() { return fmtDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fmtDateTime", function() { return fmtDateTime; });
/* harmony import */ var _workspace_h5build_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/defineProperty.js */ "rePB");
/* harmony import */ var core_js_modules_es_error_to_string_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.error.to-string.js */ "1AHG");
/* harmony import */ var core_js_modules_es_error_to_string_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_error_to_string_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.array.concat.js */ "ma9I");
/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.array.filter.js */ "TeQF");
/* harmony import */ var core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.find.js */ "fbCW");
/* harmony import */ var core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.array.map.js */ "2B1R");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.array.slice.js */ "+2oP");
/* harmony import */ var core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_slice_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_array_unshift_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.array.unshift.js */ "PGW+");
/* harmony import */ var core_js_modules_es_array_unshift_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_unshift_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_date_to_json_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.date.to-json.js */ "9LPj");
/* harmony import */ var core_js_modules_es_date_to_json_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_date_to_json_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.iterator.constructor.js */ "6fVz");
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.iterator.filter.js */ "kQ2C");
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_iterator_find_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.iterator.find.js */ "9mV7");
/* harmony import */ var core_js_modules_es_iterator_find_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_find_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.iterator.for-each.js */ "fVRX");
/* harmony import */ var core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_es_iterator_map_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.iterator.map.js */ "q0NK");
/* harmony import */ var core_js_modules_es_iterator_map_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_map_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var core_js_modules_es_json_parse_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.json.parse.js */ "EjbG");
/* harmony import */ var core_js_modules_es_json_parse_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_json_parse_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var core_js_modules_es_json_stringify_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/es.json.stringify.js */ "6cQw");
/* harmony import */ var core_js_modules_es_json_stringify_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_json_stringify_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/es.object.keys.js */ "tkto");
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "07d7");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var core_js_modules_es_parse_int_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! core-js/modules/es.parse-int.js */ "4l63");
/* harmony import */ var core_js_modules_es_parse_int_js__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_parse_int_js__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! core-js/modules/es.regexp.to-string.js */ "JfAA");
/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "FZtP");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! vue */ "4UNb");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! vuex */ "JstF");
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(vuex__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var _common_mock_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @/common/mock.js */ "rfkh");
























vue__WEBPACK_IMPORTED_MODULE_21__["default"].use(vuex__WEBPACK_IMPORTED_MODULE_22___default.a);
var STORAGE_KEY = 'ankang_store_v1';
function now() {
  return Date.now();
}
function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}
function fmtDate(ts) {
  var d = new Date(ts);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}
function fmtDateTime(ts) {
  var d = new Date(ts);
  return fmtDate(ts) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}
function addMonths(ts, m) {
  var d = new Date(ts);
  d.setMonth(d.getMonth() + m);
  return d.getTime();
}
function uid(prefix) {
  return prefix + '_' + now().toString(36) + Math.floor(Math.random() * 1000);
}
var defaultProfile = {
  name: '张丽丽',
  avatarText: '张',
  phone: '138****6820',
  gender: '男',
  age: 54,
  height: 172,
  weight: 78,
  city: '上海 · 徐汇区',
  joinAt: '2026-05-12',
  tags: ['高血压 2 级', '低盐饮食中', '连续打卡 26 天']
};
function buildDefaultMessages() {
  return [{
    id: uid('m'),
    type: 'activity',
    icon: 'fa-solid fa-gift',
    color: '#f2c94c',
    title: '新人专享礼包',
    content: '首次购买健康管理服务包立减 100 元，可与限时折扣叠加使用。',
    time: fmtDateTime(now() - 86400000 * 2),
    read: false,
    link: ''
  }, {
    id: uid('m'),
    type: 'doctor',
    icon: 'fa-solid fa-stethoscope',
    color: '#389a82',
    title: '医师团队提示',
    content: '您上次填写的血压值偏高（148/95 mmHg），建议尽快开始系统化管理。',
    time: fmtDateTime(now() - 86400000),
    read: false,
    link: ''
  }];
}
function load() {
  try {
    var raw = uni.getStorageSync(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}
var cache = load();
var store = new vuex__WEBPACK_IMPORTED_MODULE_22___default.a.Store({
  state: {
    profile: cache && cache.profile || defaultProfile,
    orders: cache && cache.orders || [],
    rights: cache && cache.rights || [],
    messages: cache && cache.messages || buildDefaultMessages(),
    chats: cache && cache.chats || {},
    devices: cache && cache.devices || [],
    currentDayIndex: 0
  },
  getters: {
    packages: function packages() {
      return _common_mock_js__WEBPACK_IMPORTED_MODULE_23__["PACKAGES"];
    },
    unreadCount: function unreadCount(state) {
      return state.messages.filter(function (m) {
        return !m.read;
      }).length;
    },
    activeRight: function activeRight(state) {
      return state.rights.find(function (r) {
        return r.status === 'active';
      }) || null;
    },
    // 已激活权益：已购买 + 首次对话完成问询（chatStarted），首页今日健康指导以此为显示条件
    activatedRight: function activatedRight(state) {
      return state.rights.find(function (r) {
        return r.status === 'active' && r.chatStarted;
      }) || null;
    },
    rightById: function rightById(state) {
      return function (id) {
        return state.rights.find(function (r) {
          return r.id === id;
        }) || null;
      };
    },
    orderByNo: function orderByNo(state) {
      return function (no) {
        return state.orders.find(function (o) {
          return o.orderNo === no;
        }) || null;
      };
    },
    paidOrders: function paidOrders(state) {
      return state.orders.filter(function (o) {
        return o.status === 'paid';
      });
    },
    todayTimeline: function todayTimeline(state) {
      var r = state.rights.find(function (x) {
        return x.chatStarted;
      }) || state.rights[0];
      var key = r ? r.pkgKey : 'hbp';
      var days = _common_mock_js__WEBPACK_IMPORTED_MODULE_23__["TIMELINE"][key] || _common_mock_js__WEBPACK_IMPORTED_MODULE_23__["TIMELINE"].hbp;
      return {
        pkgKey: key,
        preview: !r,
        items: days[state.currentDayIndex] || days[0]
      };
    },
    devices: function devices(state) {
      return state.devices;
    },
    rightEntries: function rightEntries() {
      return _common_mock_js__WEBPACK_IMPORTED_MODULE_23__["RIGHT_ENTRIES"];
    },
    deviceById: function deviceById(state) {
      return function (id) {
        return state.devices.find(function (d) {
          return d.id === id;
        }) || null;
      };
    }
  },
  mutations: {
    SET_DAY: function SET_DAY(state, i) {
      state.currentDayIndex = i;
    },
    UPDATE_PROFILE: function UPDATE_PROFILE(state, patch) {
      state.profile = Object.assign({}, state.profile, patch);
    },
    ADD_ORDER: function ADD_ORDER(state, order) {
      state.orders.unshift(order);
    },
    PAY_ORDER: function PAY_ORDER(state, orderNo) {
      var o = state.orders.find(function (x) {
        return x.orderNo === orderNo;
      });
      if (o) {
        o.status = 'paid';
        o.payAt = fmtDateTime(now());
      }
    },
    ADD_RIGHT: function ADD_RIGHT(state, right) {
      state.rights.unshift(right);
    },
    CANCEL_ORDER: function CANCEL_ORDER(state, orderNo) {
      var o = state.orders.find(function (x) {
        return x.orderNo === orderNo;
      });
      if (o && o.status === 'pending') o.status = 'canceled';
    },
    PATCH_RIGHT: function PATCH_RIGHT(state, payload) {
      var r = state.rights.find(function (x) {
        return x.id === payload.id;
      });
      if (r) Object.assign(r, payload.patch);
    },
    ADD_MESSAGES: function ADD_MESSAGES(state, list) {
      state.messages = list.concat(state.messages);
    },
    READ_MESSAGE: function READ_MESSAGE(state, id) {
      var m = state.messages.find(function (x) {
        return x.id === id;
      });
      if (m) m.read = true;
    },
    READ_ALL: function READ_ALL(state) {
      state.messages.forEach(function (m) {
        m.read = true;
      });
    },
    SAVE_CHAT: function SAVE_CHAT(state, payload) {
      state.chats = Object.assign({}, state.chats, Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_0__["default"])({}, payload.rightId, payload.data));
    },
    ADD_DEVICE: function ADD_DEVICE(state, device) {
      state.devices.unshift(device);
    },
    UPDATE_DEVICE_DATA: function UPDATE_DEVICE_DATA(state, payload) {
      var d = state.devices.find(function (x) {
        return x.id === payload.id;
      });
      if (d) {
        d.data = payload.data;
        d.lastSync = payload.lastSync || fmtDateTime(now());
        d.online = true;
      }
    },
    REMOVE_DEVICE: function REMOVE_DEVICE(state, id) {
      state.devices = state.devices.filter(function (x) {
        return x.id !== id;
      });
    },
    RESET_ALL: function RESET_ALL(state) {
      state.orders = [];
      state.rights = [];
      state.chats = {};
      state.devices = [];
      state.messages = buildDefaultMessages();
      state.profile = defaultProfile;
    }
  },
  actions: {
    persist: function persist(context) {
      var s = context.state;
      try {
        uni.setStorageSync(STORAGE_KEY, JSON.stringify({
          profile: s.profile,
          orders: s.orders,
          rights: s.rights,
          messages: s.messages,
          chats: s.chats,
          devices: s.devices
        }));
      } catch (e) {}
    },
    // 创建待支付订单
    createOrder: function createOrder(context, pkgId) {
      var pkg = _common_mock_js__WEBPACK_IMPORTED_MODULE_23__["PACKAGES"].find(function (p) {
        return p.id === pkgId;
      });
      if (!pkg) return null;
      var order = {
        orderNo: Object(_common_mock_js__WEBPACK_IMPORTED_MODULE_23__["makeOrderNo"])(),
        pkgId: pkg.id,
        pkgKey: pkg.key,
        pkgName: pkg.name,
        duration: pkg.duration,
        price: pkg.price,
        originPrice: pkg.originPrice,
        icon: pkg.icon,
        accent: pkg.accent,
        status: 'pending',
        createAt: fmtDateTime(now()),
        payAt: ''
      };
      context.commit('ADD_ORDER', order);
      context.dispatch('persist');
      return order;
    },
    // 支付成功：置订单已支付 + 生成权益 + 推送消息
    payOrder: function payOrder(context, orderNo) {
      var order = context.state.orders.find(function (o) {
        return o.orderNo === orderNo;
      });
      if (!order) return null;
      context.commit('PAY_ORDER', orderNo);
      var pkg = _common_mock_js__WEBPACK_IMPORTED_MODULE_23__["PACKAGES"].find(function (p) {
        return p.id === order.pkgId;
      });
      var months = parseInt(order.duration, 10) || 3;
      var startTs = now();
      var endTs = addMonths(startTs, months);
      var right = {
        id: uid('r'),
        orderNo: order.orderNo,
        pkgId: order.pkgId,
        pkgKey: order.pkgKey,
        name: order.pkgName,
        duration: order.duration,
        icon: order.icon,
        accent: order.accent,
        accentSoft: pkg ? pkg.accentSoft : '#d4f5ee',
        subtitle: pkg ? pkg.subtitle : '',
        services: pkg ? pkg.services : [],
        price: order.price,
        level: '尊享版',
        points: 2680,
        status: 'active',
        startAt: fmtDate(startTs),
        endAt: fmtDate(endTs),
        startTs: startTs,
        endTs: endTs,
        totalDays: Math.round((endTs - startTs) / 86400000),
        usedDays: 0,
        wecomAdded: false,
        chatStarted: false
      };
      context.commit('ADD_RIGHT', right);
      context.commit('ADD_MESSAGES', [{
        id: uid('m'),
        type: 'order',
        icon: 'fa-solid fa-circle-check',
        color: '#27ae60',
        title: '支付成功',
        content: '您已成功购买「' + right.name + ' · ' + right.duration + '」，实付 ¥' + order.price + '，服务有效期至 ' + right.endAt + '。',
        time: fmtDateTime(now()),
        read: false,
        link: '/pages/rights/detail?id=' + right.id
      }, {
        id: uid('m'),
        type: 'service',
        icon: 'fa-solid fa-hand',
        color: '#389a82',
        title: '专属健康管理师已就位',
        content: '请到「我的权益」点击立即使用，添加企业微信后即可开始首次健康问询。',
        time: fmtDateTime(now()),
        read: false,
        link: '/pages/rights/rights'
      }]);
      context.dispatch('persist');
      return right;
    },
    // 完成加企微
    bindWecom: function bindWecom(context, rightId) {
      context.commit('PATCH_RIGHT', {
        id: rightId,
        patch: {
          wecomAdded: true
        }
      });
      context.dispatch('persist');
    },
    // 首次问询完成：写入方案生成消息 + 时间线消息
    finishAssessment: function finishAssessment(context, payload) {
      var right = context.state.rights.find(function (r) {
        return r.id === payload.rightId;
      });
      if (!right) return;
      context.commit('PATCH_RIGHT', {
        id: payload.rightId,
        patch: {
          chatStarted: true,
          usedDays: 1,
          answers: payload.answers || {}
        }
      });
      var days = _common_mock_js__WEBPACK_IMPORTED_MODULE_23__["TIMELINE"][right.pkgKey] || _common_mock_js__WEBPACK_IMPORTED_MODULE_23__["TIMELINE"].hbp;
      var items = days[0] || [];
      var picked = items.slice(0, 4).map(function (it) {
        return {
          id: uid('m'),
          type: 'timeline',
          icon: it.icon,
          color: right.accent,
          title: it.time + ' · ' + it.title,
          content: it.desc,
          time: fmtDateTime(now()),
          read: false,
          link: '/pages/index/index'
        };
      });
      context.commit('ADD_MESSAGES', [{
        id: uid('m'),
        type: 'report',
        icon: 'fa-solid fa-clipboard-list',
        color: '#f2c94c',
        title: '个性化健康方案已生成',
        content: '基于您的首次问询结果，已生成 ' + right.duration + '专属管理方案，可在首页查看今日健康指导。',
        time: fmtDateTime(now()),
        read: false,
        link: '/pages/index/index'
      }].concat(picked));
      context.dispatch('persist');
    },
    saveChat: function saveChat(context, payload) {
      context.commit('SAVE_CHAT', payload);
      context.dispatch('persist');
    },
    // 扫码添加设备：生成设备记录 + 初始数据快照 + 通知消息
    addDevice: function addDevice(context, payload) {
      var type = Object(_common_mock_js__WEBPACK_IMPORTED_MODULE_23__["deviceType"])(payload.typeKey);
      if (!type) return null;
      var id = uid('d');
      var device = {
        id: id,
        typeKey: type.key,
        name: payload.name || type.name,
        model: type.model,
        sn: payload.sn || 'SN' + Math.floor(Math.random() * 900000 + 100000),
        deviceid: payload.deviceid || '',
        addedAt: fmtDateTime(now()),
        lastSync: fmtDateTime(now()),
        online: true,
        data: Object(_common_mock_js__WEBPACK_IMPORTED_MODULE_23__["makeDeviceSnapshot"])(type, null)
      };
      context.commit('ADD_DEVICE', device);
      context.commit('ADD_MESSAGES', [{
        id: uid('m'),
        type: 'device',
        icon: 'fa-solid fa-plug-circle-plus',
        color: type.color,
        title: '设备添加成功',
        content: '「' + type.name + '」（' + device.sn + '）已与账号绑定，开始同步健康数据。',
        time: fmtDateTime(now()),
        read: false,
        link: '/pages/device/detail?id=' + id
      }]);
      context.dispatch('persist');
      return device;
    },
    // 定时拉取设备最新数据（原型模拟实时）
    updateDeviceData: function updateDeviceData(context, id) {
      var d = context.state.devices.find(function (x) {
        return x.id === id;
      });
      if (!d) return null;
      var type = Object(_common_mock_js__WEBPACK_IMPORTED_MODULE_23__["deviceType"])(d.typeKey);
      var data = Object(_common_mock_js__WEBPACK_IMPORTED_MODULE_23__["makeDeviceSnapshot"])(type, d.data);
      context.commit('UPDATE_DEVICE_DATA', {
        id: id,
        data: data,
        lastSync: fmtDateTime(now())
      });
      context.dispatch('persist');
      return data;
    },
    removeDevice: function removeDevice(context, id) {
      context.commit('REMOVE_DEVICE', id);
      context.dispatch('persist');
    },
    updateProfile: function updateProfile(context, patch) {
      context.commit('UPDATE_PROFILE', patch);
      context.dispatch('persist');
    },
    readMessage: function readMessage(context, id) {
      context.commit('READ_MESSAGE', id);
      context.dispatch('persist');
    },
    readAll: function readAll(context) {
      context.commit('READ_ALL');
      context.dispatch('persist');
    },
    resetAll: function resetAll(context) {
      context.commit('RESET_ALL');
      context.dispatch('persist');
    }
  }
});
/* harmony default export */ __webpack_exports__["default"] = (store);

/***/ }),

/***/ "V2ju":
/*!*****************************************!*\
  !*** ./src/pages.json?{"type":"style"} ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
  "easycom": {
    "autoscan": true,
    "custom": {
      "^hm-(.*)": "@/components/hm-$1/hm-$1.vue"
    }
  },
  "pages": [{
    "path": "pages/index/index",
    "style": {
      "navigationBarTitleText": "安康健康管理",
      "navigationStyle": "custom",
      "enablePullDownRefresh": false
    }
  }, {
    "path": "pages/health/health",
    "style": {
      "navigationBarTitleText": "我的健康",
      "navigationStyle": "custom",
      "enablePullDownRefresh": false
    }
  }, {
    "path": "pages/band/status",
    "style": {
      "navigationBarTitleText": "手环状态",
      "navigationStyle": "custom",
      "enablePullDownRefresh": false
    }
  }, {
    "path": "pages/service/detail",
    "style": {
      "navigationBarTitleText": "服务详情",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/pay/pay",
    "style": {
      "navigationBarTitleText": "订单支付",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/rights/rights",
    "style": {
      "navigationBarTitleText": "我的权益",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/rights/detail",
    "style": {
      "navigationBarTitleText": "权益详情",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/chat/chat",
    "style": {
      "navigationBarTitleText": "健康小助手",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/message/message",
    "style": {
      "navigationBarTitleText": "消息",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/mine/mine",
    "style": {
      "navigationBarTitleText": "我的",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/mine/profile",
    "style": {
      "navigationBarTitleText": "个人资料",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/mine/orders",
    "style": {
      "navigationBarTitleText": "我的订单",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/mine/agreement",
    "style": {
      "navigationBarTitleText": "用户协议",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/mall/mall",
    "style": {
      "navigationBarTitleText": "健康商城",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/device/device",
    "style": {
      "navigationBarTitleText": "我的设备",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/device/scan",
    "style": {
      "navigationBarTitleText": "扫描设备",
      "navigationStyle": "custom"
    }
  }, {
    "path": "pages/device/detail",
    "style": {
      "navigationBarTitleText": "设备详情",
      "navigationStyle": "custom"
    }
  }],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "安康健康管理",
    "navigationBarBackgroundColor": "#FBFAF7",
    "backgroundColor": "#FBFAF7"
  },
  "tabBar": {
    "color": "#94a8aa",
    "selectedColor": "#1a7d82",
    "backgroundColor": "#ffffff",
    "borderStyle": "white",
    "height": "54px",
    "fontSize": "10px",
    "iconWidth": "22px",
    "spacing": "3px",
    "list": [{
      "pagePath": "pages/index/index",
      "text": "首页",
      "iconPath": "static/tab/home.png",
      "selectedIconPath": "static/tab/home-active.png"
    }, {
      "pagePath": "pages/health/health",
      "text": "我的健康",
      "iconPath": "static/tab/health.png",
      "selectedIconPath": "static/tab/health-active.png"
    }, {
      "pagePath": "pages/mall/mall",
      "text": "健康商城",
      "iconPath": "static/tab/mall.png",
      "selectedIconPath": "static/tab/mall-active.png"
    }, {
      "pagePath": "pages/device/device",
      "text": "设备",
      "iconPath": "static/tab/device.png",
      "selectedIconPath": "static/tab/device-active.png"
    }, {
      "pagePath": "pages/mine/mine",
      "text": "我的",
      "iconPath": "static/tab/mine.png",
      "selectedIconPath": "static/tab/mine-active.png"
    }]
  }
});

/***/ }),

/***/ "Vtdi":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _workspace_h5build_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js */ "VTBJ");
/* harmony import */ var _workspace_h5build_node_modules_core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/core-js/modules/es.array.iterator.js */ "4mDm");
/* harmony import */ var _workspace_h5build_node_modules_core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_workspace_h5build_node_modules_core_js_modules_es_array_iterator_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _workspace_h5build_node_modules_core_js_modules_es_promise_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/core-js/modules/es.promise.js */ "5s+n");
/* harmony import */ var _workspace_h5build_node_modules_core_js_modules_es_promise_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_workspace_h5build_node_modules_core_js_modules_es_promise_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _workspace_h5build_node_modules_core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./node_modules/core-js/modules/es.object.assign.js */ "zKZe");
/* harmony import */ var _workspace_h5build_node_modules_core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_workspace_h5build_node_modules_core_js_modules_es_object_assign_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _workspace_h5build_node_modules_core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./node_modules/core-js/modules/es.promise.finally.js */ "p532");
/* harmony import */ var _workspace_h5build_node_modules_core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_workspace_h5build_node_modules_core_js_modules_es_promise_finally_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var uni_pages__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! uni-pages */ "bNx1");
/* harmony import */ var uni_h5__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! uni-h5 */ "HDER");
/* harmony import */ var uni_h5__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(uni_h5__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _dcloudio_uni_stat_dist_uni_stat_public_es_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @dcloudio/uni-stat/dist/uni-stat-public.es.js */ "3olo");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! vue */ "4UNb");
/* harmony import */ var _App__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./App */ "Pf3K");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./store */ "Q2AE");












// H5：构建产物中框架基础样式（uni-tabbar 等）被提取为 static/index.css，
// 但生成的 index.html 未包含 <link> 引用，此处运行时补挂，否则底部导航等框架样式缺失。
// 小程序端无 document，不执行。
if (typeof document !== 'undefined') {
  var base = document.createElement('link');
  base.rel = 'stylesheet';
  base.href = './static/index.css';
  document.head.appendChild(base);

  // H5：加载随产物发布的本地 Font Awesome 6 图标字体，
  // 避免 emoji 在部分系统（如 Windows）渲染为方框。
  // 曾用外网 CDN（BootCDN），但 CDN 不可达时 fa-* 类名会裸奔成可见文字
  // （如页面直接显示 "fa-solid fa-stethoscope"），故改为本地引用，不依赖外网。
  var fa = document.createElement('link');
  fa.rel = 'stylesheet';
  fa.href = './static/fontawesome/css/all.min.css';
  document.head.appendChild(fa);

  // H5：加载本地 jsQR 扫码库（设备页真实相机扫码使用），
  // 随构建产物一同发布，不依赖外网 CDN 可达性。
  var jsqr = document.createElement('script');
  jsqr.src = './static/lib/jsqr.js';
  document.head.appendChild(jsqr);
}
vue__WEBPACK_IMPORTED_MODULE_8__["default"].config.productionTip = false;
vue__WEBPACK_IMPORTED_MODULE_8__["default"].prototype.$store = _store__WEBPACK_IMPORTED_MODULE_10__["default"];
_App__WEBPACK_IMPORTED_MODULE_9__["default"].mpType = 'app';
var app = new vue__WEBPACK_IMPORTED_MODULE_8__["default"](Object(_workspace_h5build_node_modules_babel_runtime_helpers_esm_objectSpread2_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
  store: _store__WEBPACK_IMPORTED_MODULE_10__["default"]
}, _App__WEBPACK_IMPORTED_MODULE_9__["default"]));
app.$mount();

/***/ }),

/***/ "XAuw":
/*!*******************************************************!*\
  !*** ./src/App.vue?vue&type=style&index=0&lang=scss& ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/h5-vue-style-loader??ref--9-oneOf-1-0!../node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!../node_modules/postcss-loader/src??ref--9-oneOf-1-3!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!../node_modules/@dcloudio/vue-cli-plugin-uni/packages/wrap-loader??ref--18!./App.vue?vue&type=style&index=0&lang=scss& */ "GSuk");
/* harmony import */ var _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_dcloudio_vue_cli_plugin_uni_packages_h5_vue_style_loader_index_js_ref_9_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_9_oneOf_1_1_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_loaders_stylePostLoader_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_2_node_modules_postcss_loader_src_index_js_ref_9_oneOf_1_3_node_modules_dcloudio_vue_cli_plugin_uni_packages_sass_loader_dist_cjs_js_ref_9_oneOf_1_4_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_preprocess_loader_index_js_ref_9_oneOf_1_5_node_modules_dcloudio_vue_cli_plugin_uni_packages_vue_loader_lib_index_js_vue_loader_options_node_modules_dcloudio_vue_cli_plugin_uni_packages_webpack_scoped_loader_index_js_node_modules_dcloudio_vue_cli_plugin_uni_packages_wrap_loader_index_js_ref_18_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "YNKN":
/*!****************************!*\
  !*** ./src/common/band.js ***!
  \****************************/
/*! exports provided: BAND_SERVER_DEFAULT_APP, setBandServer, getBandServer, BAND_SERVER, bandApi, lastBandError, getLastBandError, fetchBandRecord, listBandDevices, fetchBandLatest, fetchBandAddress, sendBandMessage, bindBandDevice, unbindBandDevice, fetchBandLatestBatch, subscribeEvents, extractDeviceId, bpLevel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BAND_SERVER_DEFAULT_APP", function() { return BAND_SERVER_DEFAULT_APP; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setBandServer", function() { return setBandServer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getBandServer", function() { return getBandServer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BAND_SERVER", function() { return BAND_SERVER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bandApi", function() { return bandApi; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lastBandError", function() { return lastBandError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getLastBandError", function() { return getLastBandError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchBandRecord", function() { return fetchBandRecord; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listBandDevices", function() { return listBandDevices; });
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
/* harmony import */ var core_js_modules_es_date_to_json_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.date.to-json.js */ "9LPj");
/* harmony import */ var core_js_modules_es_date_to_json_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_date_to_json_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.iterator.constructor.js */ "6fVz");
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.iterator.filter.js */ "kQ2C");
/* harmony import */ var core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_filter_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.iterator.for-each.js */ "fVRX");
/* harmony import */ var core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_for_each_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_json_parse_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.json.parse.js */ "EjbG");
/* harmony import */ var core_js_modules_es_json_parse_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_json_parse_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_json_stringify_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/es.json.stringify.js */ "6cQw");
/* harmony import */ var core_js_modules_es_json_stringify_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_json_stringify_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es.number.constructor.js */ "qePV");
/* harmony import */ var core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_number_constructor_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es.object.keys.js */ "tkto");
/* harmony import */ var core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "07d7");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "rB9j");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var core_js_modules_es_string_match_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! core-js/modules/es.string.match.js */ "Rm1S");
/* harmony import */ var core_js_modules_es_string_match_js__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_match_js__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "UxlC");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! core-js/modules/es.string.split.js */ "EnZy");
/* harmony import */ var core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_split_js__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! core-js/modules/es.string.trim.js */ "SYor");
/* harmony import */ var core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each.js */ "FZtP");
/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_18__);



















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

// 后端接收服务（band-server）的基址。
//   · H5：页面由 band-server 同源托管，留空串即可走相对路径（/api/*），天然适配本地预览/公网穿透/CDN 回源等各种部署形式。
//   · App / 小程序：uni.request 没有"同源"概念，必须配置为绝对 URL。
//     部署时把下面的常量改成 band-server 的公网域名（推荐 HTTPS，否则 Android 9+ 与 iOS 都要额外开明文白名单）。
//     也可以通过 uni.setStorageSync('band_server', 'https://your-domain.com') 在运行时覆盖，方便切换环境。
var BAND_SERVER_DEFAULT_APP = ''; // 例：'https://api.ankang-health.example.com'

function readBandServerFromPlatform() {
  return ''; // H5 永远同源相对路径
}
// APP 打包后首次进入应用，如果没配置 band_server，会报错；此处提供 setter 供"设置页面"动态切换。
function setBandServer(url) {
  var u = (url || '').replace(/\/$/, '');
  try {
    if (u) uni.setStorageSync && uni.setStorageSync('band_server', u);else uni.removeStorageSync && uni.removeStorageSync('band_server');
  } catch (e) {/* ignore */}
  _bandServerCache = u;
}
var _bandServerCache = null;
function getBandServer() {
  if (_bandServerCache != null) return _bandServerCache;
  _bandServerCache = readBandServerFromPlatform();
  return _bandServerCache;
}
var BAND_SERVER = ''; // 保留旧符号但不推荐使用；所有调用统一走 bandApi()

function bandApi(path) {
  var base = getBandServer();
  // 只有非 H5 且未配置 base 时，直接提前给出可读错误（避免后续 uni.request 报空 URL 的模糊错误）

  return base + path;
}

// 最近一次请求错误（调试用）：页面底部 SSE 状态卡 / 强制刷新 toast 可直接展示
var lastBandError = null;
function getLastBandError() {
  return lastBandError;
}
function _setLastError(info) {
  try {
    lastBandError = info || null;
  } catch (e) {
    lastBandError = info && JSON.parse(JSON.stringify(info)) || null;
  }
}
// 统一日志 + 错误上报：生产环境 console.error + 保存 lastBandError；
// 不要 uni.showToast，因为底层封装被轮询/定时器调用时会疯狂弹 toast。
function _logReq(tag, url, resOrErr, extra) {
  try {
    var isErr = resOrErr && resOrErr.__fail || resOrErr && typeof resOrErr.statusCode === 'number' && (resOrErr.statusCode < 200 || resOrErr.statusCode >= 300);
    var code = resOrErr && typeof resOrErr.statusCode === 'number' ? resOrErr.statusCode : resOrErr && resOrErr.__fail ? 'FAIL' : '?';
    var busCode = resOrErr && resOrErr.data && typeof resOrErr.data.code !== 'undefined' ? resOrErr.data.code : null;
    if (isErr || resOrErr && busCode != null && busCode !== 0) {
      var msg = '[band][' + tag + '] 失败 HTTP=' + code + ' 业务=' + busCode + '  URL=' + url + (extra ? '  EXTRA=' + JSON.stringify(extra) : '');
      if (typeof console !== 'undefined' && console.error) console.error(msg, resOrErr || '');
      _setLastError({
        at: Date.now(),
        tag: tag,
        url: url,
        http: code,
        bus: busCode,
        extra: extra || null
      });
    } else {
      if (typeof console !== 'undefined' && console.debug) {
        // 成功只打 debug，不污染 error channel
        console.debug('[band][' + tag + '] OK HTTP=' + code + ' 业务=' + busCode + '  ' + url, extra || '');
      }
    }
  } catch (e) {/* ignore */}
}

// 从后端拉取手环完整设备记录（{ deviceid, latest, model, name, bindAt, ... }）
// 失败 resolve(null)。注意：这个接口与 fetchBandLatest 走同一个路由，但返回完整 record 而不是只取 latest。
// extraQuery：可选，字符串形式 "k=v&k2=v2"，在末尾拼到 URL，用于强刷绕过任何代理/CDN 层缓存
function fetchBandRecord(deviceid, extraQuery) {
  return new Promise(function (resolve) {
    if (!deviceid) {
      if (typeof console !== 'undefined' && console.warn) console.warn('[band][fetchBandRecord] deviceid 为空，直接返回 null');
      resolve(null);
      return;
    }
    var url = bandApi('/api/devices/' + deviceid) + '?_t=' + Date.now();
    if (extraQuery && typeof extraQuery === 'string') {
      url += (url.indexOf('?') >= 0 ? '&' : '?') + extraQuery;
    }
    uni.request({
      url: url,
      method: 'GET',
      timeout: 5000,
      success: function success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0 && res.data.data) {
          _logReq('GET /api/devices/:id', url, res, {
            found: true,
            latestKeys: Object.keys(res.data.data && res.data.data.latest || {})
          });
          resolve(res.data.data);
        } else {
          _logReq('GET /api/devices/:id', url, res, {
            hint: '结构不符合 code=0 或 data 不存在'
          });
          resolve(null);
        }
      },
      fail: function fail(err) {
        _logReq('GET /api/devices/:id', url, Object.assign({
          __fail: true
        }, err || {}), {
          hint: 'uni.request fail：网络失败/超时/CORS'
        });
        resolve(null);
      }
    });
  });
}

// 拉取后端所有设备列表（[{ deviceid, latest, model, name, ... }]），失败返回 []
function listBandDevices() {
  return new Promise(function (resolve) {
    var url = bandApi('/api/devices?_t=') + Date.now();
    uni.request({
      url: url,
      method: 'GET',
      timeout: 5000,
      success: function success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0 && Array.isArray(res.data.data)) {
          _logReq('GET /api/devices', url, res, {
            count: res.data.data.length
          });
          resolve(res.data.data);
        } else {
          _logReq('GET /api/devices', url, res, {
            hint: '结构不符合 code=0 或 data 非数组'
          });
          resolve([]);
        }
      },
      fail: function fail(err) {
        _logReq('GET /api/devices', url, Object.assign({
          __fail: true
        }, err || {}), {
          hint: 'uni.request fail：网络失败/超时/CORS'
        });
        resolve([]);
      }
    });
  });
}

// 从后端拉取手环最新状态（心率 hr / 收缩压 sbp / 舒张压 dbp / 步数 steps / 电量 battery / 时间戳 ts）
// 后端不可达或尚无上报数据时 resolve(null)，由页面显示 "--"，不做模拟兜底
// URL 附加时间戳 + 后端 no-store + 可选 extraQuery，多重保险绕过缓存
function fetchBandLatest(deviceid, extraQuery) {
  return new Promise(function (resolve) {
    fetchBandRecord(deviceid, extraQuery).then(function (rec) {
      var latest = rec && rec.latest;
      if (latest && (latest.hr != null || latest.sbp != null || latest.steps != null || latest.spo2 != null || latest.ecgSamples != null || latest.sleep != null || latest.bodyTemp != null || latest.skinTemp != null || latest.stress != null)) {
        resolve(latest);
      } else {
        // latest 空是正常情况（手环还没上报 hr/sbp），不写 lastBandError（那是"请求层面错误"专用通道）
        if (typeof console !== 'undefined' && console.debug) {
          console.debug('[band][fetchBandLatest] deviceid=' + deviceid + ' 后端 latest 为空（手环尚未上报心率/血压等），返回 null 让页面显示 --');
        }
        resolve(null);
      }
    });
  });
}

// 拉取当前公网上报地址（隧道重启后 lhr.life 域名会变化，后端返回最新一条）
// 后端不可达或未配置隧道时 resolve(null)，页面显示占位符；同样加时间戳防缓存
function fetchBandAddress() {
  return new Promise(function (resolve) {
    var url = bandApi('/api/address') + '?_t=' + Date.now();
    uni.request({
      url: url,
      method: 'GET',
      timeout: 5000,
      success: function success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0 && res.data.data) {
          _logReq('GET /api/address', url, res, {
            public: (res.data.data.public || '').slice(0, 60)
          });
          resolve(res.data.data);
        } else {
          _logReq('GET /api/address', url, res, {
            hint: '结构不符合 code=0'
          });
          resolve(null);
        }
      },
      fail: function fail(err) {
        _logReq('GET /api/address', url, Object.assign({
          __fail: true
        }, err || {}), {
          hint: 'uni.request fail'
        });
        resolve(null);
      }
    });
  });
}

// 发送消息到手环（后端转发 entservice 指令下发，见 server.js /api/band/message）
// title ≤15 字节，description ≤240 字节；成功 resolve(null)，失败 resolve(错误信息)
function sendBandMessage(deviceid, title, description) {
  return new Promise(function (resolve) {
    var url = bandApi('/api/band/message');
    uni.request({
      url: url,
      method: 'POST',
      data: {
        device_id: deviceid,
        title: title,
        description: description
      },
      timeout: 15000,
      success: function success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          _logReq('POST /api/band/message', url, res);
          resolve(null);
        } else {
          _logReq('POST /api/band/message', url, res);
          resolve(res.data && res.data.message || '发送失败(' + (res.statusCode || '') + ')');
        }
      },
      fail: function fail(err) {
        _logReq('POST /api/band/message', url, Object.assign({
          __fail: true
        }, err || {}));
        resolve('无法连接消息服务');
      }
    });
  });
}

// 把手环设备注册到后端（绑定 deviceid 与用户）
function bindBandDevice(deviceid, name) {
  return new Promise(function (resolve) {
    var url = bandApi('/api/devices');
    uni.request({
      url: url,
      method: 'POST',
      data: {
        deviceid: deviceid,
        name: name
      },
      timeout: 5000,
      success: function success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          _logReq('POST /api/devices', url, res);
          resolve(res.data.data);
        } else {
          _logReq('POST /api/devices', url, res);
          resolve(null);
        }
      },
      fail: function fail(err) {
        _logReq('POST /api/devices', url, Object.assign({
          __fail: true
        }, err || {}));
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
    var url = bandApi('/api/devices/' + encodeURIComponent(deviceid));
    uni.request({
      url: url,
      method: 'DELETE',
      timeout: 5000,
      success: function success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          _logReq('DELETE /api/devices/:id', url, res);
          resolve(true);
        } else {
          _logReq('DELETE /api/devices/:id', url, res);
          resolve(false);
        }
      },
      fail: function fail(err) {
        _logReq('DELETE /api/devices/:id', url, Object.assign({
          __fail: true
        }, err || {}));
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
      var url = bandApi('/api/devices/' + id) + '?_t=' + Date.now();
      uni.request({
        url: url,
        method: 'GET',
        timeout: 5000,
        success: function success(res) {
          if (res.statusCode === 200 && res.data && res.data.code === 0 && res.data.data && res.data.data.latest) {
            _logReq('GET /api/devices/:id (batch)', url, res, {
              latestKeys: Object.keys(res.data.data.latest || {})
            });
            out[id] = res.data.data.latest;
          } else {
            _logReq('GET /api/devices/:id (batch)', url, res, {
              hint: '结构不符合或 latest 不存在'
            });
            out[id] = null;
          }
        },
        fail: function fail(err) {
          _logReq('GET /api/devices/:id (batch)', url, Object.assign({
            __fail: true
          }, err || {}));
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

    // 平台条件编译：APP 端和其它端的 request 参数差异很大，
    // 用 let 声明 + ifdef 分支赋值，保证任何打包平台在同一作用域内都只"可见"一次赋值。
    // uni-app CLI 在编译阶段会完全剥离不属于目标平台的条件编译块，因此只剩下一个分支。
    var reqOpts = null;
    if (!reqOpts) {
      reqOpts = {
        url: buildUrl(),
        method: 'GET',
        // H5 端长轮询：超时 60s，服务端保持
        timeout: 60000,
        header: {
          Accept: 'text/event-stream'
        }
      };
    }

    // 兜底：若平台都没命中（极端情况），按 H5 参数处理
    if (!reqOpts) {
      reqOpts = {
        url: buildUrl(),
        method: 'GET',
        timeout: 60000,
        header: {
          Accept: 'text/event-stream'
        }
      };
    }
    var req = uni.request(Object.assign({}, reqOpts, {
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
    }));
    // 防阻塞：APP-PLUS 端用 65s 兜底（timeout=70s），其它端用 55s 兜底（timeout=60s）
    // 使用 let + ifdef 分支赋值，避免作用域重复声明问题
    var guardMs = 55000;
    setTimeout(function () {
      if (done) return;
      done = true;
      try {
        req && req.abort && req.abort();
      } catch (e) {}
      lpTimer = setTimeout(longPollOnce, 300);
    }, guardMs);
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

/***/ }),

/***/ "bNx1":
/*!************************!*\
  !*** ./src/pages.json ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var core_js_modules_es_array_reduce_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.reduce.js */ "E9XD");
/* harmony import */ var core_js_modules_es_array_reduce_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_reduce_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.iterator.constructor.js */ "6fVz");
/* harmony import */ var core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_constructor_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_iterator_reduce_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.iterator.reduce.js */ "lIUY");
/* harmony import */ var core_js_modules_es_iterator_reduce_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_iterator_reduce_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "07d7");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "rB9j");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "UxlC");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vue */ "4UNb");







var locales = {
  keys: function keys() {
    return [];
  }
};
global['________'] = true;
delete global['________'];
global.__uniConfig = {
  "easycom": {
    "autoscan": true,
    "custom": {
      "^hm-(.*)": "@/components/hm-$1/hm-$1.vue",
      "^unicloud-db$": "@dcloudio/uni-cli-shared/components/unicloud-db.vue",
      "^uniad$": "@dcloudio/uni-cli-shared/components/uniad.vue",
      "^ad-rewarded-video$": "@dcloudio/uni-cli-shared/components/ad-rewarded-video.vue",
      "^ad-fullscreen-video$": "@dcloudio/uni-cli-shared/components/ad-fullscreen-video.vue",
      "^ad-interstitial$": "@dcloudio/uni-cli-shared/components/ad-interstitial.vue",
      "^ad-interactive$": "@dcloudio/uni-cli-shared/components/ad-interactive.vue",
      "^page-meta$": "@dcloudio/uni-cli-shared/components/page-meta.vue",
      "^navigation-bar$": "@dcloudio/uni-cli-shared/components/navigation-bar.vue",
      "^uni-match-media$": "@dcloudio/uni-cli-shared/components/uni-match-media.vue"
    }
  },
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "安康健康管理",
    "navigationBarBackgroundColor": "#FBFAF7",
    "backgroundColor": "#FBFAF7"
  },
  "tabBar": {
    "color": "#94a8aa",
    "selectedColor": "#1a7d82",
    "backgroundColor": "#ffffff",
    "borderStyle": "white",
    "height": "54px",
    "fontSize": "10px",
    "iconWidth": "22px",
    "spacing": "3px",
    "list": [{
      "pagePath": "pages/index/index",
      "text": "首页",
      "iconPath": "static/tab/home.png",
      "selectedIconPath": "static/tab/home-active.png",
      "redDot": false,
      "badge": ""
    }, {
      "pagePath": "pages/health/health",
      "text": "我的健康",
      "iconPath": "static/tab/health.png",
      "selectedIconPath": "static/tab/health-active.png",
      "redDot": false,
      "badge": ""
    }, {
      "pagePath": "pages/mall/mall",
      "text": "健康商城",
      "iconPath": "static/tab/mall.png",
      "selectedIconPath": "static/tab/mall-active.png",
      "redDot": false,
      "badge": ""
    }, {
      "pagePath": "pages/device/device",
      "text": "设备",
      "iconPath": "static/tab/device.png",
      "selectedIconPath": "static/tab/device-active.png",
      "redDot": false,
      "badge": ""
    }, {
      "pagePath": "pages/mine/mine",
      "text": "我的",
      "iconPath": "static/tab/mine.png",
      "selectedIconPath": "static/tab/mine-active.png",
      "redDot": false,
      "badge": ""
    }]
  }
};
global.__uniConfig.compilerVersion = '5.24';
global.__uniConfig.darkmode = false;
global.__uniConfig.themeConfig = {};
global.__uniConfig.uniPlatform = 'h5';
global.__uniConfig.appId = '';
global.__uniConfig.appName = '安康健康管理';
global.__uniConfig.appVersion = '1.0.0';
global.__uniConfig.appVersionCode = '100';
global.__uniConfig.router = {
  "mode": "hash",
  "base": "./"
};
global.__uniConfig.publicPath = "/";
global.__uniConfig['async'] = {
  "loading": "AsyncLoading",
  "error": "AsyncError",
  "delay": 200,
  "timeout": 60000
};
global.__uniConfig.debug = false;
global.__uniConfig.networkTimeout = {
  "request": 60000,
  "connectSocket": 60000,
  "uploadFile": 60000,
  "downloadFile": 60000
};
global.__uniConfig.sdkConfigs = {};
global.__uniConfig.qqMapKey = undefined;
global.__uniConfig.googleMapKey = undefined;
global.__uniConfig.aMapKey = undefined;
global.__uniConfig.aMapSecurityJsCode = undefined;
global.__uniConfig.aMapServiceHost = undefined;
global.__uniConfig.locale = "";
global.__uniConfig.fallbackLocale = undefined;
global.__uniConfig.locales = locales.keys().reduce(function (res, key) {
  var locale = key.replace(/\.\/(uni-app.)?(.*).json/, '$2');
  var messages = locales(key);
  Object.assign(res[locale] || (res[locale] = {}), messages.common || messages);
  return res;
}, {});
global.__uniConfig.nvue = {
  "flex-direction": "column"
};
global.__uniConfig.__webpack_chunk_load__ = __webpack_require__.e;
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-index-index', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-index-index */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-chat-chat~pages-index-index"), __webpack_require__.e("pages-index-index")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/index/index.vue */ "91rt"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-health-health', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-health-health */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-health-health")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/health/health.vue */ "vQF3"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-band-status', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-band-status */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-band-status")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/band/status.vue */ "4TEP"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-service-detail', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-service-detail */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-service-detail")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/service/detail.vue */ "qioJ"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-pay-pay', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-pay-pay */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-pay-pay")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/pay/pay.vue */ "dVnC"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-rights-rights', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-rights-rights */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-rights-rights")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/rights/rights.vue */ "eIcC"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-rights-detail', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-rights-detail */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-rights-detail")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/rights/detail.vue */ "8uOI"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-chat-chat', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-chat-chat */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-chat-chat~pages-index-index"), __webpack_require__.e("pages-chat-chat")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/chat/chat.vue */ "XFJV"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-message-message', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-message-message */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-message-message")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/message/message.vue */ "Iq/L"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-mine-mine', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-mine-mine */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-mine-mine")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/mine/mine.vue */ "5VC8"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-mine-profile', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-mine-profile */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-mine-profile")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/mine/profile.vue */ "RxTe"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-mine-orders', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-mine-orders */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-mine-orders")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/mine/orders.vue */ "NC20"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-mine-agreement', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-mine-agreement */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-mine-agreement")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/mine/agreement.vue */ "Nana"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-mall-mall', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-mall-mall */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-mall-mall")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/mall/mall.vue */ "vRJf"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-device-device', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-device-device */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-device-device")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/device/device.vue */ "vjPZ"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-device-scan', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-device-scan */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-device-scan")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/device/scan.vue */ "vG3x"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
vue__WEBPACK_IMPORTED_MODULE_6__["default"].component('pages-device-detail', function (resolve) {
  var component = {
    component: Promise.all(/*! require.ensure | pages-device-detail */[__webpack_require__.e("pages-band-status~pages-chat-chat~pages-device-detail~pages-device-device~pages-device-scan~pages-he~d57aada1"), __webpack_require__.e("pages-device-detail")]).then((function () {
      return resolve(__webpack_require__(/*! ./src/pages/device/detail.vue */ "ngQi"));
    }).bind(null, __webpack_require__)).catch(__webpack_require__.oe),
    delay: __uniConfig['async'].delay,
    timeout: __uniConfig['async'].timeout
  };
  if (__uniConfig['async']['loading']) {
    component.loading = {
      name: 'SystemAsyncLoading',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['loading']);
      }
    };
  }
  if (__uniConfig['async']['error']) {
    component.error = {
      name: 'SystemAsyncError',
      render: function render(createElement) {
        return createElement(__uniConfig['async']['error']);
      }
    };
  }
  return component;
});
global.__uniRoutes = [{
  path: '/',
  alias: '/pages/index/index',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({
          isQuit: true,
          isEntry: true,
          isTabBar: true,
          tabBarIndex: 0
        }, __uniConfig.globalStyle, {
          "navigationBarTitleText": "安康健康管理",
          "navigationStyle": "custom",
          "enablePullDownRefresh": false
        })
      }, [createElement('pages-index-index', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    id: 1,
    name: 'pages-index-index',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/index/index',
    isQuit: true,
    isEntry: true,
    isTabBar: true,
    tabBarIndex: 0,
    windowTop: 0
  }
}, {
  path: '/pages/health/health',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({
          isQuit: true,
          isTabBar: true,
          tabBarIndex: 1
        }, __uniConfig.globalStyle, {
          "navigationBarTitleText": "我的健康",
          "navigationStyle": "custom",
          "enablePullDownRefresh": false
        })
      }, [createElement('pages-health-health', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    id: 2,
    name: 'pages-health-health',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/health/health',
    isQuit: true,
    isTabBar: true,
    tabBarIndex: 1,
    windowTop: 0
  }
}, {
  path: '/pages/band/status',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({}, __uniConfig.globalStyle, {
          "navigationBarTitleText": "手环状态",
          "navigationStyle": "custom",
          "enablePullDownRefresh": false
        })
      }, [createElement('pages-band-status', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'pages-band-status',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/band/status',
    windowTop: 0
  }
}, {
  path: '/pages/service/detail',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({}, __uniConfig.globalStyle, {
          "navigationBarTitleText": "服务详情",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-service-detail', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'pages-service-detail',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/service/detail',
    windowTop: 0
  }
}, {
  path: '/pages/pay/pay',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({}, __uniConfig.globalStyle, {
          "navigationBarTitleText": "订单支付",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-pay-pay', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'pages-pay-pay',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/pay/pay',
    windowTop: 0
  }
}, {
  path: '/pages/rights/rights',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({}, __uniConfig.globalStyle, {
          "navigationBarTitleText": "我的权益",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-rights-rights', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'pages-rights-rights',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/rights/rights',
    windowTop: 0
  }
}, {
  path: '/pages/rights/detail',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({}, __uniConfig.globalStyle, {
          "navigationBarTitleText": "权益详情",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-rights-detail', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'pages-rights-detail',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/rights/detail',
    windowTop: 0
  }
}, {
  path: '/pages/chat/chat',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({}, __uniConfig.globalStyle, {
          "navigationBarTitleText": "健康小助手",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-chat-chat', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'pages-chat-chat',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/chat/chat',
    windowTop: 0
  }
}, {
  path: '/pages/message/message',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({}, __uniConfig.globalStyle, {
          "navigationBarTitleText": "消息",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-message-message', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'pages-message-message',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/message/message',
    windowTop: 0
  }
}, {
  path: '/pages/mine/mine',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({
          isQuit: true,
          isTabBar: true,
          tabBarIndex: 4
        }, __uniConfig.globalStyle, {
          "navigationBarTitleText": "我的",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-mine-mine', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    id: 3,
    name: 'pages-mine-mine',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/mine/mine',
    isQuit: true,
    isTabBar: true,
    tabBarIndex: 4,
    windowTop: 0
  }
}, {
  path: '/pages/mine/profile',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({}, __uniConfig.globalStyle, {
          "navigationBarTitleText": "个人资料",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-mine-profile', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'pages-mine-profile',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/mine/profile',
    windowTop: 0
  }
}, {
  path: '/pages/mine/orders',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({}, __uniConfig.globalStyle, {
          "navigationBarTitleText": "我的订单",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-mine-orders', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'pages-mine-orders',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/mine/orders',
    windowTop: 0
  }
}, {
  path: '/pages/mine/agreement',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({}, __uniConfig.globalStyle, {
          "navigationBarTitleText": "用户协议",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-mine-agreement', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'pages-mine-agreement',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/mine/agreement',
    windowTop: 0
  }
}, {
  path: '/pages/mall/mall',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({
          isQuit: true,
          isTabBar: true,
          tabBarIndex: 2
        }, __uniConfig.globalStyle, {
          "navigationBarTitleText": "健康商城",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-mall-mall', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    id: 4,
    name: 'pages-mall-mall',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/mall/mall',
    isQuit: true,
    isTabBar: true,
    tabBarIndex: 2,
    windowTop: 0
  }
}, {
  path: '/pages/device/device',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({
          isQuit: true,
          isTabBar: true,
          tabBarIndex: 3
        }, __uniConfig.globalStyle, {
          "navigationBarTitleText": "我的设备",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-device-device', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    id: 5,
    name: 'pages-device-device',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/device/device',
    isQuit: true,
    isTabBar: true,
    tabBarIndex: 3,
    windowTop: 0
  }
}, {
  path: '/pages/device/scan',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({}, __uniConfig.globalStyle, {
          "navigationBarTitleText": "扫描设备",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-device-scan', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'pages-device-scan',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/device/scan',
    windowTop: 0
  }
}, {
  path: '/pages/device/detail',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: Object.assign({}, __uniConfig.globalStyle, {
          "navigationBarTitleText": "设备详情",
          "navigationStyle": "custom"
        })
      }, [createElement('pages-device-detail', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'pages-device-detail',
    isNVue: false,
    maxWidth: 0,
    pagePath: 'pages/device/detail',
    windowTop: 0
  }
}, {
  path: '/choose-location',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: {
          navigationStyle: 'custom'
        }
      }, [createElement('system-choose-location', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'choose-location',
    pagePath: '/choose-location'
  }
}, {
  path: '/open-location',
  component: {
    render: function render(createElement) {
      return createElement('Page', {
        props: {
          navigationStyle: 'custom'
        }
      }, [createElement('system-open-location', {
        slot: 'page'
      })]);
    }
  },
  meta: {
    name: 'open-location',
    pagePath: '/open-location'
  }
}];
global.UniApp && new global.UniApp();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "yLpj")))

/***/ }),

/***/ "rfkh":
/*!****************************!*\
  !*** ./src/common/mock.js ***!
  \****************************/
/*! exports provided: PACKAGES, TIMELINE, CAT_META, QUESTIONS, QUESTIONS_DM, KNOWLEDGE, RIGHT_ENTRIES, SHOP_GOODS, makeOrderNo, DEVICE_TYPES, deviceType, makeDeviceSnapshot, HEALTH_MEMBERS, HEALTH_QUICK, HEALTH_SCORE, HEALTH_FOCUS, HEALTH_ACHIEVE, HEALTH_PLAN, HEALTH_PLAN_META, HEALTH_RISK_FORECAST, HEALTH_DISEASE_RISK, HEALTH_RECOMMEND */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PACKAGES", function() { return PACKAGES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TIMELINE", function() { return TIMELINE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAT_META", function() { return CAT_META; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QUESTIONS", function() { return QUESTIONS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QUESTIONS_DM", function() { return QUESTIONS_DM; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "KNOWLEDGE", function() { return KNOWLEDGE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RIGHT_ENTRIES", function() { return RIGHT_ENTRIES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SHOP_GOODS", function() { return SHOP_GOODS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeOrderNo", function() { return makeOrderNo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DEVICE_TYPES", function() { return DEVICE_TYPES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deviceType", function() { return deviceType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "makeDeviceSnapshot", function() { return makeDeviceSnapshot; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HEALTH_MEMBERS", function() { return HEALTH_MEMBERS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HEALTH_QUICK", function() { return HEALTH_QUICK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HEALTH_SCORE", function() { return HEALTH_SCORE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HEALTH_FOCUS", function() { return HEALTH_FOCUS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HEALTH_ACHIEVE", function() { return HEALTH_ACHIEVE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HEALTH_PLAN", function() { return HEALTH_PLAN; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HEALTH_PLAN_META", function() { return HEALTH_PLAN_META; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HEALTH_RISK_FORECAST", function() { return HEALTH_RISK_FORECAST; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HEALTH_DISEASE_RISK", function() { return HEALTH_DISEASE_RISK; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HEALTH_RECOMMEND", function() { return HEALTH_RECOMMEND; });
/* harmony import */ var core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.find.js */ "fbCW");
/* harmony import */ var core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_find_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.object.to-string.js */ "07d7");
/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1__);


var IMG = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=';
function img(prompt) {
  var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'landscape_4_3';
  return IMG + encodeURIComponent(prompt) + '&image_size=' + size;
}
var PACKAGES = [{
  id: 'hbp3m',
  key: 'hbp',
  name: '高血压调理计划',
  duration: '3个月',
  subtitle: '三甲医师团队 + AI 助手 24h 陪伴式控压',
  price: 699,
  originPrice: 1299,
  tagline: '中国高血压防治指南 2024 标准',
  accent: '#389a82',
  accentSoft: '#d4f5ee',
  icon: 'fa-solid fa-stethoscope',
  sold: 2847,
  rating: '4.9',
  heroImg: img('医疗健康服务电商详情页主图，微笑的中年亚洲男性在明亮家中客厅使用上臂式电子血压计测量血压，桌上有新鲜蔬果与温水，青绿色与暖白配色，晨光柔和，专业温暖的医疗关怀氛围，干净留白，高级商业摄影，浅景深'),
  tags: ['24h AI 陪伴', '医师团队审核', '指南级危险分层', '按天时间线'],
  highlights: [{
    icon: 'fa-solid fa-dna',
    title: '指南级危险分层',
    desc: '依据《中国高血压防治指南2024》表8，25题精准评估低危/中危/高危/很高危'
  }, {
    icon: 'fa-solid fa-calendar-days',
    title: '每日时间线方案',
    desc: '监测/用药/营养/运动/心理/睡眠 六维日程，到点提醒不遗漏'
  }, {
    icon: 'fa-solid fa-pills',
    title: '六大类用药答疑',
    desc: '地平、普利、沙坦、利尿剂、洛尔、复方制剂副作用与应对全覆盖'
  }, {
    icon: 'fa-solid fa-arrow-trend-up',
    title: '双周方案迭代',
    desc: '晚间7问采集依从性数据，方案随身体反馈动态调整'
  }],
  services: [{
    name: '健康小助手对话',
    spec: '不限次数',
    unit: '次'
  }, {
    name: '初次分型评估报告',
    spec: '1 份（7段式）',
    unit: '份'
  }, {
    name: '每日健康时间线',
    spec: '90 天',
    unit: '天'
  }, {
    name: '医师团队方案审核',
    spec: '每月 1 次',
    unit: '次'
  }, {
    name: '用药副作用答疑',
    spec: '不限次数',
    unit: '次'
  }, {
    name: '阶段性康复评估',
    spec: '每 14 天 1 次',
    unit: '次'
  }],
  detailSections: [{
    title: '谁适合这个计划',
    img: img('亚洲三甲医院心内科医生团队白大褂形象，正在与患者视频问诊，屏幕显示血压曲线图表，明亮现代诊室，青绿色调，专业可信，商业摄影'),
    points: ['已确诊高血压，正在服药但血压波动大', '血压 130-139/85-89 mmHg，处于正常高值需干预', '服药后出现干咳、脚踝水肿等副作用不知如何处理', '想系统了解低盐饮食、运动处方但缺少可执行方案']
  }, {
    title: '每天为你安排什么',
    img: img('低盐健康餐俯拍，燕麦粥、水煮蛋、凉拌菠菜、清蒸鲈鱼、西兰花、糙米饭摆盘，浅木质桌面，限盐勺特写，清爽自然光，健康饮食摄影，高级质感'),
    points: ['07:00 晨起血压监测 · 静坐5分钟后测量', '07:30 降压药提醒 · 不可自行停药', '08:00 低盐早餐建议 · 全天盐分 <5g', '10:00 太极/八段锦 · 中等强度有氧30分钟', '20:30 晚间7问评估 · 采集依从性与身体感受', '22:00 睡前正念冥想 · 改善睡眠质量']
  }],
  faq: [{
    q: '这个服务能代替医院就诊吗？',
    a: '不能。本服务是健康管理与生活方式干预，不做诊断和处方。药物调整必须由您的主治医师决定，我们会协助您整理数据便于医生判断。'
  }, {
    q: '需要每天花多久时间？',
    a: '核心动作每天约 10 分钟：早晚各测一次血压 + 晚间 7 问打卡。运动和饮食融入日常生活，不额外占用时间。'
  }, {
    q: '3个月后没效果怎么办？',
    a: '服务期内每 14 天做一次阶段评估，若连续两次评估无改善，医师团队会免费重制方案，并延长 1 个月服务期。'
  }]
}, {
  id: 'dm3m',
  key: 'dm',
  name: '高血糖调理计划',
  duration: '3个月',
  subtitle: '控糖曲线可视化 + 营养师定制配餐',
  price: 899,
  originPrice: 1599,
  tagline: '中国2型糖尿病防治指南 2024 标准',
  accent: '#4ab89e',
  accentSoft: '#d8f8fa',
  icon: 'fa-solid fa-droplet',
  sold: 1936,
  rating: '4.8',
  heroImg: img('医疗健康服务电商详情页主图，中年亚洲女性在家中用血糖仪测指尖血糖，旁边有全谷物食品和绿叶蔬菜，蓝绿色与暖白配色，柔和自然光，专业温暖的医疗关怀氛围，干净留白，高级商业摄影'),
  tags: ['血糖曲线分析', '营养师配餐', 'GI/GL 双控', '并发症筛查提醒'],
  highlights: [{
    icon: 'fa-solid fa-arrow-trend-down',
    title: '七点血糖谱解读',
    desc: '空腹/三餐后2h/睡前/夜间，识别黎明现象与餐后高峰'
  }, {
    icon: 'fa-solid fa-leaf',
    title: '低GI 配餐方案',
    desc: '注册营养师按您的口味与三餐习惯定制，主食替换有具体克数'
  }, {
    icon: 'fa-solid fa-person-running',
    title: '餐后运动窗口',
    desc: '餐后30-60分钟黄金降糖窗，给到具体运动类型与强度'
  }, {
    icon: 'fa-solid fa-magnifying-glass',
    title: '并发症筛查日历',
    desc: '眼底、尿微量白蛋白、足部、糖化血红蛋白 到期自动提醒'
  }],
  services: [{
    name: '健康小助手对话',
    spec: '不限次数',
    unit: '次'
  }, {
    name: '控糖基线评估报告',
    spec: '1 份',
    unit: '份'
  }, {
    name: '每日控糖时间线',
    spec: '90 天',
    unit: '天'
  }, {
    name: '营养师定制配餐',
    spec: '每 2 周更新',
    unit: '次'
  }, {
    name: '血糖曲线分析',
    spec: '每周 1 次',
    unit: '次'
  }, {
    name: '并发症筛查提醒',
    spec: '全周期',
    unit: '项'
  }],
  detailSections: [{
    title: '谁适合这个计划',
    img: img('血糖管理概念图，血糖仪、连续血糖监测贴片、记录本上的血糖曲线图表，浅色桌面俯拍，蓝绿色调，简洁专业，医疗产品摄影'),
    points: ['空腹血糖 6.1-7.0 mmol/L 的糖前期人群', '已确诊 2 型糖尿病，糖化血红蛋白未达标', '血糖忽高忽低，不知道是饮食还是用药问题', '想减重同时稳住血糖，需要专业配餐方案']
  }, {
    title: '每天为你安排什么',
    img: img('低升糖指数健康餐俯拍，藜麦、荞麦面、鸡胸肉、牛油果、蓝莓、绿叶菜摆盘，浅色餐具，清爽自然光，控糖饮食摄影，高级质感'),
    points: ['06:50 空腹血糖监测 · 记录并识别黎明现象', '07:30 二甲双胍等口服药提醒', '08:00 低GI 早餐 · 蛋白质先行、主食定量', '10:00 餐后2h 血糖测量 · 对比餐前增幅', '19:30 餐后快走 · 黄金降糖窗 30 分钟', '21:30 睡前血糖 + 低血糖预警自检']
  }],
  faq: [{
    q: '需要买连续血糖仪吗？',
    a: '不强制。指尖血糖仪即可开始，若您已有 CGM 设备，可以在对话中直接上报曲线，我们会做更精细的分析。'
  }, {
    q: '配餐要严格照着吃吗？',
    a: '配餐给的是"可替换清单"而非固定菜谱，会按您的口味偏好和当地食材给 2-3 个等效替换方案，执行门槛低。'
  }, {
    q: '可以和高血压计划一起买吗？',
    a: '可以。糖尿病合并高血压很常见，两个计划的时间线会自动合并去重，用药提醒也会做相互作用提示。'
  }]
}];
var TIMELINE = {
  hbp: {
    0: [{
      time: '07:00',
      cat: 'monitor',
      title: '晨起血压监测',
      desc: '晨起静坐5分钟后测量血压，记录数值',
      tag: '每日监测',
      icon: 'fa-solid fa-stethoscope'
    }, {
      time: '07:30',
      cat: 'medication',
      title: '降压药物服用',
      desc: '按时服用医生开具的降压药，不可自行停药',
      tag: '用药提醒',
      icon: 'fa-solid fa-pills'
    }, {
      time: '08:00',
      cat: 'nutrition',
      title: '营养早餐建议',
      desc: '燕麦粥+水煮蛋+凉拌菠菜，控制盐分<2g',
      tag: '饮食管理',
      icon: 'fa-solid fa-bowl-food'
    }, {
      time: '10:00',
      cat: 'exercise',
      title: '太极拳练习',
      desc: '24式简化太极拳，在舒缓音乐中练习30分钟',
      tag: '运动处方',
      icon: 'fa-solid fa-spa'
    }, {
      time: '12:30',
      cat: 'nutrition',
      title: '低盐午餐',
      desc: '糙米饭+清蒸鲈鱼+西兰花，使用限盐勺',
      tag: '饮食管理',
      icon: 'fa-solid fa-leaf'
    }, {
      time: '15:00',
      cat: 'psychology',
      title: '正念呼吸练习',
      desc: '吸气4秒-屏息4秒-呼气6秒，循环5分钟',
      tag: '心理调适',
      icon: 'fa-solid fa-seedling'
    }, {
      time: '18:00',
      cat: 'exercise',
      title: '快走运动',
      desc: '傍晚凉爽时段快走30分钟，步速适中',
      tag: '运动处方',
      icon: 'fa-solid fa-person-walking'
    }, {
      time: '19:00',
      cat: 'nutrition',
      title: '清淡晚餐',
      desc: '杂粮饭+番茄豆腐汤+炒时蔬，少油少盐',
      tag: '饮食管理',
      icon: 'fa-solid fa-utensils'
    }, {
      time: '20:30',
      cat: 'assessment',
      title: '康复情况评估',
      desc: '记录今日血压值、身体感受和情绪状态',
      tag: '康复评估',
      icon: 'fa-solid fa-clipboard-list'
    }, {
      time: '22:00',
      cat: 'sleep',
      title: '睡前正念冥想',
      desc: '10分钟睡前引导冥想，帮助身心放松入眠',
      tag: '睡眠管理',
      icon: 'fa-solid fa-moon'
    }],
    1: [{
      time: '07:00',
      cat: 'monitor',
      title: '晨起血压监测',
      desc: '晨起静坐5分钟后测量血压，记录数值',
      tag: '每日监测',
      icon: 'fa-solid fa-stethoscope'
    }, {
      time: '07:30',
      cat: 'medication',
      title: '降压药物服用',
      desc: '按时服用降压药，注意药物副作用',
      tag: '用药提醒',
      icon: 'fa-solid fa-pills'
    }, {
      time: '08:00',
      cat: 'nutrition',
      title: '营养早餐',
      desc: '全麦面包+无糖豆浆+水煮蛋，健康开启新一天',
      tag: '饮食管理',
      icon: 'fa-solid fa-bread-slice'
    }, {
      time: '09:30',
      cat: 'exercise',
      title: '八段锦练习',
      desc: '传统养生功法八段锦全套，强身健体',
      tag: '运动处方',
      icon: 'fa-solid fa-spa'
    }, {
      time: '12:30',
      cat: 'nutrition',
      title: '午餐营养搭配',
      desc: '杂粮饭+番茄牛腩+清炒芦笋，营养均衡',
      tag: '饮食管理',
      icon: 'fa-solid fa-bowl-food'
    }, {
      time: '14:30',
      cat: 'psychology',
      title: '渐进式肌肉放松',
      desc: '从头到脚逐段绷紧再放松，释放身心压力',
      tag: '心理调适',
      icon: 'fa-solid fa-seedling'
    }, {
      time: '17:30',
      cat: 'exercise',
      title: '游泳或散步',
      desc: '30分钟中等强度有氧运动，避免血压高峰',
      tag: '运动处方',
      icon: 'fa-solid fa-person-swimming'
    }, {
      time: '19:00',
      cat: 'nutrition',
      title: '低盐晚餐',
      desc: '紫薯+冬瓜汤+白灼菜心，清淡易消化',
      tag: '饮食管理',
      icon: 'fa-solid fa-utensils'
    }, {
      time: '20:00',
      cat: 'monitor',
      title: '晚间血压监测',
      desc: '睡前1小时测量血压，记录并对比早间数值',
      tag: '每日监测',
      icon: 'fa-solid fa-stethoscope'
    }, {
      time: '21:00',
      cat: 'assessment',
      title: '每日康复评估',
      desc: '总结当日身体状况，记录血压和情绪变化',
      tag: '康复评估',
      icon: 'fa-solid fa-clipboard-list'
    }, {
      time: '22:00',
      cat: 'sleep',
      title: '助眠冥想',
      desc: '15分钟深度放松冥想，改善睡眠质量',
      tag: '睡眠管理',
      icon: 'fa-solid fa-moon'
    }],
    2: [{
      time: '07:00',
      cat: 'monitor',
      title: '晨起血压监测',
      desc: '晨起静坐5分钟后测量血压，连续监测对比',
      tag: '每日监测',
      icon: 'fa-solid fa-stethoscope'
    }, {
      time: '07:30',
      cat: 'medication',
      title: '降压药物服用',
      desc: '按时服药，如有不适及时记录',
      tag: '用药提醒',
      icon: 'fa-solid fa-pills'
    }, {
      time: '08:00',
      cat: 'nutrition',
      title: '营养早餐',
      desc: '小米南瓜粥+蒸蛋+凉拌苦瓜，清爽开胃',
      tag: '饮食管理',
      icon: 'fa-solid fa-mug-hot'
    }, {
      time: '10:00',
      cat: 'exercise',
      title: '慢跑或快走',
      desc: '公园慢跑30分钟，感受清晨新鲜空气',
      tag: '运动处方',
      icon: 'fa-solid fa-person-running'
    }, {
      time: '12:30',
      cat: 'nutrition',
      title: '营养午餐',
      desc: '糙米饭+清蒸带鱼+蒜蓉西兰花，低油低盐',
      tag: '饮食管理',
      icon: 'fa-solid fa-utensils'
    }, {
      time: '15:00',
      cat: 'psychology',
      title: '正念冥想练习',
      desc: '引导式正念冥想10分钟，提升觉察力',
      tag: '心理调适',
      icon: 'fa-solid fa-spa'
    }, {
      time: '18:00',
      cat: 'exercise',
      title: '舒缓瑜伽',
      desc: '基础瑜伽30分钟，拉伸筋骨，平静心绪',
      tag: '运动处方',
      icon: 'fa-solid fa-spa'
    }, {
      time: '19:00',
      cat: 'nutrition',
      title: '健康晚餐',
      desc: '藜麦沙拉+鸡胸肉蔬菜卷，营养低脂',
      tag: '饮食管理',
      icon: 'fa-solid fa-leaf'
    }, {
      time: '20:30',
      cat: 'assessment',
      title: '阶段性康复评估',
      desc: '三日总结评估，对比前后变化，调整方案',
      tag: '康复评估',
      icon: 'fa-solid fa-chart-column'
    }, {
      time: '22:00',
      cat: 'sleep',
      title: '睡前放松冥想',
      desc: '引导式入眠冥想，帮助快速入睡',
      tag: '睡眠管理',
      icon: 'fa-solid fa-moon'
    }]
  },
  dm: {
    0: [{
      time: '06:50',
      cat: 'monitor',
      title: '空腹血糖监测',
      desc: '起床后未进食测量，识别是否存在黎明现象',
      tag: '每日监测',
      icon: 'fa-solid fa-droplet'
    }, {
      time: '07:30',
      cat: 'medication',
      title: '口服降糖药提醒',
      desc: '二甲双胍随餐服用可减轻胃肠道反应',
      tag: '用药提醒',
      icon: 'fa-solid fa-pills'
    }, {
      time: '08:00',
      cat: 'nutrition',
      title: '低GI 早餐',
      desc: '蛋白质先行：鸡蛋+无糖豆浆+荞麦馒头半个',
      tag: '饮食管理',
      icon: 'fa-solid fa-bowl-food'
    }, {
      time: '10:00',
      cat: 'monitor',
      title: '餐后2h 血糖',
      desc: '与餐前对比，增幅超过 3.0 mmol/L 需调整主食量',
      tag: '每日监测',
      icon: 'fa-solid fa-arrow-trend-up'
    }, {
      time: '12:30',
      cat: 'nutrition',
      title: '控糖午餐',
      desc: '杂粮饭 100g+清蒸鱼+两份绿叶菜，先菜后饭',
      tag: '饮食管理',
      icon: 'fa-solid fa-leaf'
    }, {
      time: '13:30',
      cat: 'exercise',
      title: '餐后快走',
      desc: '餐后30分钟快走 20 分钟，压平餐后血糖峰',
      tag: '运动处方',
      icon: 'fa-solid fa-person-walking'
    }, {
      time: '16:00',
      cat: 'psychology',
      title: '压力管理练习',
      desc: '皮质醇升高会拉高血糖，做5分钟呼吸放松',
      tag: '心理调适',
      icon: 'fa-solid fa-seedling'
    }, {
      time: '19:00',
      cat: 'nutrition',
      title: '控糖晚餐',
      desc: '主食减半，增加优质蛋白与膳食纤维',
      tag: '饮食管理',
      icon: 'fa-solid fa-utensils'
    }, {
      time: '19:30',
      cat: 'exercise',
      title: '黄金降糖窗运动',
      desc: '餐后30-60分钟中等强度运动30分钟',
      tag: '运动处方',
      icon: 'fa-solid fa-person-running'
    }, {
      time: '21:00',
      cat: 'assessment',
      title: '控糖情况评估',
      desc: '汇总今日血糖谱、饮食与运动完成度',
      tag: '康复评估',
      icon: 'fa-solid fa-clipboard-list'
    }, {
      time: '21:30',
      cat: 'sleep',
      title: '睡前血糖与低血糖自检',
      desc: '睡前血糖<5.6 需加餐，预防夜间低血糖',
      tag: '睡眠管理',
      icon: 'fa-solid fa-moon'
    }],
    1: [{
      time: '06:50',
      cat: 'monitor',
      title: '空腹血糖监测',
      desc: '连续记录第2天，观察空腹血糖趋势',
      tag: '每日监测',
      icon: 'fa-solid fa-droplet'
    }, {
      time: '07:30',
      cat: 'medication',
      title: '降糖药提醒',
      desc: '按医嘱服药，如有低血糖症状及时记录',
      tag: '用药提醒',
      icon: 'fa-solid fa-pills'
    }, {
      time: '08:00',
      cat: 'nutrition',
      title: '低GI 早餐',
      desc: '燕麦（非速溶）+鸡蛋+一小把坚果',
      tag: '饮食管理',
      icon: 'fa-solid fa-bread-slice'
    }, {
      time: '09:30',
      cat: 'exercise',
      title: '抗阻训练',
      desc: '弹力带上肢+靠墙静蹲，提升肌肉葡萄糖摄取',
      tag: '运动处方',
      icon: 'fa-solid fa-dumbbell'
    }, {
      time: '12:30',
      cat: 'nutrition',
      title: '控糖午餐',
      desc: '藜麦饭+鸡胸肉+凉拌木耳，控制精制碳水',
      tag: '饮食管理',
      icon: 'fa-solid fa-bowl-food'
    }, {
      time: '14:30',
      cat: 'monitor',
      title: '餐后2h 血糖',
      desc: '目标 <10.0 mmol/L，理想 <7.8',
      tag: '每日监测',
      icon: 'fa-solid fa-arrow-trend-up'
    }, {
      time: '17:30',
      cat: 'exercise',
      title: '有氧运动',
      desc: '游泳或骑行30分钟，随身携带糖块',
      tag: '运动处方',
      icon: 'fa-solid fa-person-swimming'
    }, {
      time: '19:00',
      cat: 'nutrition',
      title: '控糖晚餐',
      desc: '冬瓜虾仁+杂粮饭80g+白灼菜心',
      tag: '饮食管理',
      icon: 'fa-solid fa-utensils'
    }, {
      time: '21:00',
      cat: 'assessment',
      title: '每日控糖评估',
      desc: '记录血糖波动、饮食偏差与身体感受',
      tag: '康复评估',
      icon: 'fa-solid fa-clipboard-list'
    }, {
      time: '22:00',
      cat: 'sleep',
      title: '助眠放松',
      desc: '睡眠不足会显著升高次日空腹血糖',
      tag: '睡眠管理',
      icon: 'fa-solid fa-moon'
    }],
    2: [{
      time: '06:50',
      cat: 'monitor',
      title: '空腹血糖监测',
      desc: '第3天数据，形成初步血糖谱',
      tag: '每日监测',
      icon: 'fa-solid fa-droplet'
    }, {
      time: '07:30',
      cat: 'medication',
      title: '降糖药提醒',
      desc: '注意用药与进餐时间的配合',
      tag: '用药提醒',
      icon: 'fa-solid fa-pills'
    }, {
      time: '08:00',
      cat: 'nutrition',
      title: '低GI 早餐',
      desc: '全麦吐司+牛油果+煎蛋，优质脂肪延缓吸收',
      tag: '饮食管理',
      icon: 'fa-solid fa-mug-hot'
    }, {
      time: '10:00',
      cat: 'exercise',
      title: '快走或慢跑',
      desc: '中等强度30分钟，心率控制在最大心率60-70%',
      tag: '运动处方',
      icon: 'fa-solid fa-person-running'
    }, {
      time: '12:30',
      cat: 'nutrition',
      title: '控糖午餐',
      desc: '荞麦面+瘦牛肉+菠菜，先喝汤再吃菜后吃面',
      tag: '饮食管理',
      icon: 'fa-solid fa-utensils'
    }, {
      time: '15:00',
      cat: 'psychology',
      title: '正念减压',
      desc: '10分钟正念冥想，稳定情绪与血糖',
      tag: '心理调适',
      icon: 'fa-solid fa-spa'
    }, {
      time: '18:00',
      cat: 'exercise',
      title: '舒缓拉伸',
      desc: '瑜伽拉伸30分钟，改善外周血液循环',
      tag: '运动处方',
      icon: 'fa-solid fa-spa'
    }, {
      time: '19:00',
      cat: 'nutrition',
      title: '控糖晚餐',
      desc: '蒸南瓜（替代主食）+清蒸鲈鱼+芦笋',
      tag: '饮食管理',
      icon: 'fa-solid fa-leaf'
    }, {
      time: '20:30',
      cat: 'assessment',
      title: '三日血糖谱分析',
      desc: '汇总三日七点血糖，识别高峰时段并调整方案',
      tag: '康复评估',
      icon: 'fa-solid fa-chart-column'
    }, {
      time: '22:00',
      cat: 'sleep',
      title: '睡前冥想',
      desc: '引导式入眠冥想，保障 7 小时睡眠',
      tag: '睡眠管理',
      icon: 'fa-solid fa-moon'
    }]
  }
};
var CAT_META = {
  monitor: {
    label: '监测',
    color: '#389a82',
    bg: '#d4f5ee'
  },
  medication: {
    label: '用药',
    color: '#f15533',
    bg: '#fdf4ed'
  },
  nutrition: {
    label: '营养',
    color: '#27ae60',
    bg: '#ddf7ed'
  },
  exercise: {
    label: '运动',
    color: '#4ab89e',
    bg: '#d8f8fa'
  },
  psychology: {
    label: '心理',
    color: '#8dcdd8',
    bg: '#e2f2f6'
  },
  sleep: {
    label: '睡眠',
    color: '#64748b',
    bg: '#f2f7fa'
  },
  assessment: {
    label: '评估',
    color: '#f2c94c',
    bg: '#fdf4ed'
  }
};

// 问卷选项统一结构：{ v: 稳定值码, label: 展示文案 }
// v 用于报告生成的逻辑判定，label 仅用于界面展示与对话气泡。
// 改文案只需改 label，不会影响危险分层逻辑；v 一经确定不要随意变更。
var QUESTIONS = [{
  id: 'bp_grade',
  text: '您好！我是健康小助手。为了按《中国高血压防治指南 2024》为您做危险分层，先了解 5 项必要信息。第一个问题：近 1 个月您在家中测到的最高血压，落在哪一档？',
  options: [{
    v: 'grade1',
    label: '1级：140-159 / 90-99 mmHg'
  }, {
    v: 'grade2',
    label: '2级：160-179 / 100-109 mmHg'
  }, {
    v: 'grade3',
    label: '3级：≥180 / ≥110 mmHg'
  }, {
    v: 'unknown',
    label: '未规律测量，不清楚'
  }]
}, {
  id: 'medication',
  text: '好的。降压药的服用情况直接影响血压达标率，请问您目前属于哪一种？',
  options: [{
    v: 'adherent',
    label: '每天按时按量服用'
  }, {
    v: 'irregular',
    label: '经常漏服或自行减量'
  }, {
    v: 'self_stop',
    label: '血压降下来就停药'
  }, {
    v: 'none',
    label: '尚未开始药物治疗'
  }]
}, {
  id: 'comorbidity',
  text: '了解了。以下这些情况会明显改变您的降压目标值，请问您是否有医生确诊过？',
  options: [{
    v: 'cvd',
    label: '冠心病、心衰或脑卒中病史'
  }, {
    v: 'dm_ckd',
    label: '糖尿病或慢性肾病'
  }, {
    v: 'risk_factor',
    label: '仅血脂异常、高尿酸或吸烟'
  }, {
    v: 'none',
    label: '以上都没有'
  }]
}, {
  id: 'salt_intake',
  text: '限钠是指南推荐的首要生活方式干预。您平时的口味和加工食品摄入更接近哪种？',
  options: [{
    v: 'low',
    label: '清淡，每日食盐基本 <5g'
  }, {
    v: 'medium',
    label: '适中，每日食盐 5-10g'
  }, {
    v: 'high',
    label: '偏重，>10g 或常吃腌制加工食品'
  }, {
    v: 'unaware',
    label: '从未留意过'
  }]
}, {
  id: 'exercise',
  text: '最后一个问题：指南建议每周至少 150 分钟中等强度有氧运动。您目前的运动量大概是？',
  options: [{
    v: 'none',
    label: '基本不运动'
  }, {
    v: 'low',
    label: '每周 1-2 次'
  }, {
    v: 'medium',
    label: '每周 3-4 次，每次约 30 分钟'
  }, {
    v: 'high',
    label: '每周 5 次以上'
  }]
}];
var QUESTIONS_DM = [{
  id: 'dm_med',
  text: '您好！我是安康，您的AI控糖助手。先了解基本情况：您目前是否在使用降糖药物或胰岛素？',
  options: [{
    v: 'oral',
    label: '口服降糖药'
  }, {
    v: 'insulin',
    label: '注射胰岛素'
  }, {
    v: 'both',
    label: '两者都有'
  }, {
    v: 'none',
    label: '暂未用药'
  }]
}, {
  id: 'fpg',
  text: '好的。您最近的空腹血糖大概在什么范围？',
  options: [{
    v: 'normal',
    label: '正常 (<6.1)'
  }, {
    v: 'mid',
    label: '偏高 (6.1-7.0)'
  }, {
    v: 'high',
    label: '较高 (>7.0)'
  }, {
    v: 'unknown',
    label: '不太清楚'
  }]
}, {
  id: 'hba1c',
  text: '了解。您最近一次糖化血红蛋白（HbA1c）是多少？',
  options: [{
    v: 'lt65',
    label: '<6.5%'
  }, {
    v: 'r65_70',
    label: '6.5-7.0%'
  }, {
    v: 'r70_80',
    label: '7.0-8.0%'
  }, {
    v: 'gt80',
    label: '>8% 或未测'
  }]
}, {
  id: 'staple',
  text: '饮食方面：您每餐主食（米饭/面食）的量大概是多少？',
  options: [{
    v: 'small',
    label: '少于一小碗'
  }, {
    v: 'normal',
    label: '一小碗'
  }, {
    v: 'large',
    label: '一大碗以上'
  }, {
    v: 'varies',
    label: '不固定'
  }]
}, {
  id: 'dm_exercise',
  text: '最后一个问题：您餐后有运动的习惯吗？',
  options: [{
    v: 'always',
    label: '餐后必走'
  }, {
    v: 'sometimes',
    label: '偶尔走走'
  }, {
    v: 'rarely',
    label: '基本不动'
  }, {
    v: 'never',
    label: '饭后就躺'
  }]
}];
var KNOWLEDGE = [{
  icon: 'fa-solid fa-book',
  title: '我国成人高血压患病率约 27.5%',
  desc: '有效控压可显著降低心脑血管并发症风险'
}, {
  icon: 'fa-solid fa-bullseye',
  title: '一般人群目标血压 <140/90 mmHg',
  desc: '能耐受者可进一步降至 <130/80 mmHg'
}, {
  icon: 'fa-solid fa-leaf',
  title: 'DASH 饮食原则',
  desc: '低盐（<5g/天）、高钾、低脂、多蔬果全谷物'
}, {
  icon: 'fa-solid fa-person-running',
  title: '每周 3-5 次中等强度有氧运动',
  desc: '每次 30 分钟，快走、慢跑、太极拳、八段锦均可'
}];

// 首页"我的权益"入口（图标统一金色，与权益卡片金色装饰呼应）
// quotaText 为入口下方显示的剩余次数文字；quota 为角标数字（可选）
var RIGHT_ENTRIES = [{
  key: 'ai',
  label: 'AI自测',
  icon: 'fa-solid fa-face-grin-tongue',
  color: '#b8932e',
  bg: '#faf3e0',
  quotaText: '无限制'
}, {
  key: 'consult',
  label: '免费问诊',
  icon: 'fa-solid fa-comments',
  color: '#b8932e',
  bg: '#faf3e0',
  quotaText: '无限制'
}, {
  key: 'expert',
  label: '专家预约',
  icon: 'fa-solid fa-user-doctor',
  color: '#b8932e',
  bg: '#faf3e0',
  quota: 3,
  quotaText: '剩3次'
}, {
  key: 'video',
  label: '视频问诊',
  icon: 'fa-solid fa-video',
  color: '#b8932e',
  bg: '#faf3e0',
  quota: 12,
  quotaText: '剩12次'
}, {
  key: 'accompany',
  label: '陪诊',
  icon: 'fa-solid fa-hand-holding-heart',
  color: '#b8932e',
  bg: '#faf3e0',
  quota: 3,
  quotaText: '剩3次'
}, {
  key: 'psycho',
  label: '心理评估',
  icon: 'fa-solid fa-heart-pulse',
  color: '#b8932e',
  bg: '#faf3e0',
  quotaText: '无限制'
}, {
  key: 'gene',
  label: '基因检测',
  icon: 'fa-solid fa-dna',
  color: '#b8932e',
  bg: '#faf3e0',
  quota: 1,
  quotaText: '剩1次'
}];

// 健康商城商品（积分换购：price 现金价 / points 所需积分 / img 商品图）
var SHOP_GOODS = [{
  id: 'g1',
  name: '上臂式电子血压计',
  desc: '国标认证 · 双人记忆 · 智能语音播报',
  icon: 'fa-solid fa-heart-pulse',
  color: '#389a82',
  bg: '#d4f5ee',
  price: 299,
  points: 1299,
  tag: '热卖',
  img: '/static/img/mall/g1.jpg'
}, {
  id: 'g2',
  name: '智能体脂秤',
  desc: '14 项身体数据 · APP 同步趋势',
  icon: 'fa-solid fa-weight-scale',
  color: '#4ab89e',
  bg: '#d8f8fa',
  price: 199,
  points: 899,
  tag: '新品',
  img: '/static/img/mall/g2.jpg'
}, {
  id: 'g3',
  name: '低盐调味礼盒',
  desc: '控盐勺 + 低钠酱油 + 海盐整月用量',
  icon: 'fa-solid fa-jar',
  color: '#f15533',
  bg: '#fdf4ed',
  price: 89,
  points: 399,
  tag: '',
  img: '/static/img/mall/g3.jpg'
}, {
  id: 'g4',
  name: '助眠香薰精油',
  desc: '薰衣草配方 · 睡前放松助眠',
  icon: 'fa-solid fa-spa',
  color: '#8dcdd8',
  bg: '#e2f2f6',
  price: 69,
  points: 299,
  tag: '',
  img: '/static/img/mall/g4.jpg'
}, {
  id: 'g5',
  name: '血糖试纸（50支）',
  desc: '与主流血糖仪通用 · 单片独立包装',
  icon: 'fa-solid fa-droplet',
  color: '#27ae60',
  bg: '#ddf7ed',
  price: 129,
  points: 599,
  tag: '',
  img: '/static/img/mall/g5.jpg'
}, {
  id: 'g6',
  name: '智能恒温杯',
  desc: '55°C 恒温提示 · USB 充电',
  icon: 'fa-solid fa-mug-hot',
  color: '#f2c94c',
  bg: '#fdf4ed',
  price: 159,
  points: 699,
  tag: '积分特惠',
  img: '/static/img/mall/g6.jpg'
}, {
  id: 'g7',
  name: '弹力带训练套装',
  desc: '3 档阻力 · 居家运动必备',
  icon: 'fa-solid fa-dumbbell',
  color: '#64748b',
  bg: '#f2f7fa',
  price: 39,
  points: 159,
  tag: '',
  img: '/static/img/mall/g7.jpg'
}, {
  id: 'g8',
  name: '一周分装药盒',
  desc: '早中晚三格 · 防潮密封',
  icon: 'fa-solid fa-pills',
  color: '#389a82',
  bg: '#d4f5ee',
  price: 29,
  points: 99,
  tag: '积分特惠',
  img: '/static/img/mall/g8.jpg'
}];
function makeOrderNo() {
  var d = new Date();
  var p = function p(n) {
    return n < 10 ? '0' + n : '' + n;
  };
  return 'AK' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()) + Math.floor(Math.random() * 900 + 100);
}

/* ---------- 智能设备 ---------- */
// 每种设备的可展示实时指标：key/label/unit/icon
var DEVICE_TYPES = [{
  key: 'band',
  name: '智能手环',
  model: '安康手环 S1',
  icon: 'fa-solid fa-hand-holding-heart',
  color: '#389a82',
  accentSoft: '#d4f5ee',
  desc: '全天候心率、步数与睡眠监测',
  fields: [{
    key: 'heartRate',
    label: '心率',
    unit: 'bpm',
    icon: 'fa-solid fa-heart-pulse'
  }, {
    key: 'steps',
    label: '今日步数',
    unit: '步',
    icon: 'fa-solid fa-shoe-prints'
  }, {
    key: 'sleep',
    label: '睡眠时长',
    unit: 'h',
    icon: 'fa-solid fa-moon'
  }, {
    key: 'battery',
    label: '电量',
    unit: '%',
    icon: 'fa-solid fa-battery-three-quarters'
  }]
}, {
  key: 'band-bp',
  name: '智能手环 - 血压款',
  model: '安康手环 BP',
  icon: 'fa-solid fa-heart-circle-check',
  color: '#f15533',
  accentSoft: '#fdf4ed',
  desc: '腕式血压 + 心率 + 步数监测',
  fields: [{
    key: 'sys',
    label: '收缩压',
    unit: 'mmHg',
    icon: 'fa-solid fa-heart-pulse'
  }, {
    key: 'dia',
    label: '舒张压',
    unit: 'mmHg',
    icon: 'fa-solid fa-heart-pulse'
  }, {
    key: 'heartRate',
    label: '心率',
    unit: 'bpm',
    icon: 'fa-solid fa-heart'
  }, {
    key: 'steps',
    label: '今日步数',
    unit: '步',
    icon: 'fa-solid fa-shoe-prints'
  }]
}, {
  key: 'radar',
  name: '睡眠监测仪 - 毫米波雷达款',
  model: '安康雷达 R1',
  icon: 'fa-solid fa-satellite-dish',
  color: '#8dcdd8',
  accentSoft: '#e2f2f6',
  desc: '非接触式呼吸、体动与离床监测',
  fields: [{
    key: 'respRate',
    label: '呼吸频率',
    unit: '次/分',
    icon: 'fa-solid fa-wind'
  }, {
    key: 'bodyMove',
    label: '体动次数',
    unit: '次',
    icon: 'fa-solid fa-person-walking'
  }, {
    key: 'bedOff',
    label: '离床次数',
    unit: '次',
    icon: 'fa-solid fa-bed'
  }, {
    key: 'stay',
    label: '床内时长',
    unit: 'h',
    icon: 'fa-solid fa-moon'
  }]
}, {
  key: 'bed',
  name: '睡眠监测仪 - 床上款',
  model: '安康床垫 B1',
  icon: 'fa-solid fa-bed-pulse',
  color: '#f2c94c',
  accentSoft: '#fdf4ed',
  desc: '床垫式睡眠质量与生命体征监测',
  fields: [{
    key: 'sleepScore',
    label: '睡眠评分',
    unit: '分',
    icon: 'fa-solid fa-star'
  }, {
    key: 'heartRate',
    label: '心率',
    unit: 'bpm',
    icon: 'fa-solid fa-heart'
  }, {
    key: 'turn',
    label: '翻身次数',
    unit: '次',
    icon: 'fa-solid fa-rotate'
  }, {
    key: 'deepSleep',
    label: '深睡时长',
    unit: 'h',
    icon: 'fa-solid fa-moon'
  }]
}];
function deviceType(key) {
  return DEVICE_TYPES.find(function (t) {
    return t.key === key;
  }) || DEVICE_TYPES[0];
}

// 生成设备实时数据快照（原型模拟）
function makeDeviceSnapshot(type, prev) {
  var d = {};
  var p = prev || {};
  var rnd = function rnd(min, max, fix) {
    return +(min + Math.random() * (max - min)).toFixed(fix == null ? 0 : fix);
  };
  switch (type.key) {
    case 'band':
      d.heartRate = rnd(62, 92);
      d.steps = (p.steps || 0) + rnd(0, 18);
      d.sleep = +((p.sleep || 6.4) + rnd(-0.1, 0.1, 2)).toFixed(2);
      d.battery = Math.max(5, Math.min(100, (p.battery == null ? 86 : p.battery) - rnd(0, 1)));
      break;
    case 'band-bp':
      d.sys = rnd(118, 148);
      d.dia = rnd(74, 92);
      d.heartRate = rnd(62, 92);
      d.steps = (p.steps || 0) + rnd(0, 18);
      break;
    case 'radar':
      d.respRate = rnd(14, 20);
      d.bodyMove = (p.bodyMove || 0) + rnd(0, 2);
      d.bedOff = (p.bedOff || 0) + rnd(0, 1);
      d.stay = +((p.stay || 7.2) + rnd(-0.05, 0.05, 2)).toFixed(2);
      break;
    case 'bed':
      d.sleepScore = rnd(72, 96);
      d.heartRate = rnd(58, 76);
      d.turn = (p.turn || 0) + rnd(0, 3);
      d.deepSleep = +((p.deepSleep || 2.1) + rnd(-0.05, 0.05, 2)).toFixed(2);
      break;
  }
  return d;
}

/* ---------- 我的健康页 ---------- */
// 顶部家庭成员切换
var HEALTH_MEMBERS = [{
  key: 'self',
  name: '本人',
  avatarText: '周'
}, {
  key: 'mother',
  name: '母亲',
  avatarText: '母'
}, {
  key: 'father',
  name: '父亲',
  avatarText: '父'
}];

// 快捷入口
var HEALTH_QUICK = [{
  key: 'report',
  label: '上传报告',
  icon: 'fa-solid fa-file-medical',
  color: '#389a82',
  bg: '#d4f5ee'
}, {
  key: 'diet',
  label: '健康饮食',
  icon: 'fa-solid fa-bowl-food',
  color: '#e8945a',
  bg: '#fdf4ed'
}, {
  key: 'record',
  label: '健康记录',
  icon: 'fa-solid fa-notes-medical',
  color: '#4a9fd8',
  bg: '#e2f2f6'
}, {
  key: 'manual',
  label: '手工记录',
  icon: 'fa-solid fa-pen-to-square',
  color: '#8b7ad8',
  bg: '#eeecfb'
}, {
  key: 'checkin',
  label: '每日打卡',
  icon: 'fa-solid fa-calendar-check',
  color: '#27ae60',
  bg: '#ddf7ed'
}, {
  key: 'more',
  label: '更多服务',
  icon: 'fa-solid fa-ellipsis',
  color: '#64748b',
  bg: '#f2f7fa'
}];

// 今日健康评分
var HEALTH_SCORE = {
  score: 88,
  total: 100,
  date: '6月11日 周三',
  deltaText: '较昨日下降 6分',
  deltaDown: true,
  items: [{
    label: '睡眠不足',
    delta: -1,
    icon: 'fa-solid fa-moon'
  }, {
    label: '压力偏高',
    delta: -1,
    icon: 'fa-solid fa-brain'
  }, {
    label: '运动缺少',
    delta: -1,
    icon: 'fa-solid fa-person-running'
  }]
};

// 今日重点建议
var HEALTH_FOCUS = {
  title: '完成 5,000 步目标',
  current: 2340,
  target: 5000,
  unit: '步',
  remainText: '剩余 13 天完成挑战，加油！',
  btnText: '去散步打卡',
  bonusText: '完成今日重点建议',
  bonus: 10
};

// 成就
var HEALTH_ACHIEVE = [{
  key: 'a1',
  label: '步数达标',
  icon: 'fa-solid fa-shoe-prints',
  done: true
}, {
  key: 'a2',
  label: '早睡守护',
  icon: 'fa-solid fa-bed',
  done: true
}, {
  key: 'a3',
  label: '全项达成',
  icon: 'fa-solid fa-medal',
  done: false
}];

// 今日健康计划（时间线）
var HEALTH_PLAN = {
  done: 4,
  total: 8,
  items: [{
    time: '08:00',
    cat: 'med',
    title: '用药提醒',
    desc: '苯磺酸氨氯地平片 5mg，早餐后温水送服',
    done: true
  }, {
    time: '09:30',
    cat: 'diet',
    title: '健康饮食',
    desc: '早餐建议：燕麦粥 + 鸡蛋 1 个 + 凉拌菠菜，控盐 2g 以内',
    done: true
  }, {
    time: '10:30',
    cat: 'tea',
    title: '养生茶推荐',
    desc: '上午代谢活跃期，饮用决明子菊花茶有助于平肝降压',
    done: true,
    goods: [{
      id: 't1',
      name: '决明子菊花茶',
      price: 39.9,
      img: '/static/img/mall/g4.jpg'
    }, {
      id: 't2',
      name: '桑叶枸杞茶',
      price: 29.9,
      img: '/static/img/mall/g6.jpg'
    }]
  }, {
    time: '14:00',
    cat: 'visit',
    title: '复诊提醒',
    desc: '距上次门诊已 28 天，建议本周复查血压与肝功能',
    done: true
  }, {
    time: '16:00',
    cat: 'sport',
    title: '八段锦练习',
    desc: '第三式「调理脾胃须单举」，跟练 12 分钟',
    done: false,
    video: true
  }, {
    time: '18:30',
    cat: 'diet',
    title: '晚餐建议',
    desc: '低钠高纤：杂粮饭 + 清蒸鲈鱼 + 西兰花，晚餐七分饱',
    done: false,
    goods: [{
      id: 'd1',
      name: '低钠杂粮米',
      price: 49,
      img: '/static/img/mall/g3.jpg'
    }, {
      id: 'd2',
      name: '控盐调味组合',
      price: 35,
      img: '/static/img/mall/g8.jpg'
    }]
  }, {
    time: '21:30',
    cat: 'sleep',
    title: '睡眠准备',
    desc: '放下手机，泡脚 15 分钟并做 4-7-8 呼吸放松',
    done: false
  }]
};

// 计划分类元数据
var HEALTH_PLAN_META = {
  med: {
    label: '用药',
    color: '#389a82',
    bg: '#d4f5ee',
    icon: 'fa-solid fa-pills'
  },
  diet: {
    label: '饮食',
    color: '#e8945a',
    bg: '#fdf4ed',
    icon: 'fa-solid fa-bowl-food'
  },
  tea: {
    label: '养生',
    color: '#27ae60',
    bg: '#ddf7ed',
    icon: 'fa-solid fa-mug-hot'
  },
  visit: {
    label: '就医',
    color: '#4a9fd8',
    bg: '#e2f2f6',
    icon: 'fa-solid fa-stethoscope'
  },
  sport: {
    label: '运动',
    color: '#8b7ad8',
    bg: '#eeecfb',
    icon: 'fa-solid fa-person-running'
  },
  sleep: {
    label: '睡眠',
    color: '#5b6b9e',
    bg: '#eaeefb',
    icon: 'fa-solid fa-moon'
  }
};

// 健康风险预测
var HEALTH_RISK_FORECAST = [{
  key: 'fatigue',
  period: '未来 30 天',
  name: '疲劳风险',
  percent: 28,
  level: 'warn',
  plans: ['保证每日 7 小时睡眠，23 点前入睡', '每工作 1 小时起身活动 5 分钟', '补充 B 族维生素与优质蛋白'],
  btnText: '领取专属睡眠管理'
}, {
  key: 'glucose',
  period: '未来 180 天',
  name: '血糖偏高风险',
  percent: 30,
  level: 'warn',
  plans: ['主食替换 1/3 为杂粮，减少精制碳水', '每周 150 分钟中等强度有氧运动', '每月监测一次空腹血糖'],
  btnText: '领取控糖饮食方案'
}];

// 疾病风险评分
var HEALTH_DISEASE_RISK = [{
  key: 'hbp',
  name: '高血压',
  score: 66,
  level: '高风险',
  color: '#eb5757',
  bg: '#fdeeee'
}, {
  key: 'dm2',
  name: '2型糖尿病',
  score: 54,
  level: '中风险',
  color: '#f2994a',
  bg: '#fdf4ed'
}, {
  key: 'chd',
  name: '冠状动脉异常',
  score: 10,
  level: '低风险',
  color: '#27ae60',
  bg: '#ddf7ed'
}];

// 推荐
var HEALTH_RECOMMEND = [{
  id: 'r1',
  name: '糖尿病专家调理服务',
  desc: '三甲内分泌专家 1v1 制定 12 周控糖方案',
  price: 99,
  tag: 'AI专家提供方案',
  btnText: '立即查看',
  img: '/static/img/mall/g1.jpg'
}, {
  id: 'r2',
  name: '大麦荷叶纤纤丸',
  desc: '药食同源配方 · 辅助代谢管理',
  price: 69.9,
  tag: '新品折扣',
  btnText: '立即查看',
  img: '/static/img/mall/g5.jpg'
}, {
  id: 'r3',
  name: '玫瑰四物茶',
  desc: '温和调理气血 · 每日一袋冲泡即饮',
  price: 69.9,
  tag: '甄选好物',
  btnText: '立即查看',
  img: '/static/img/mall/g4.jpg'
}];

/***/ }),

/***/ "yEaF":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ref--9-oneOf-1-1!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-2!./node_modules/postcss-loader/src??ref--9-oneOf-1-3!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/sass-loader/dist/cjs.js??ref--9-oneOf-1-4!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-preprocess-loader??ref--9-oneOf-1-5!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib??vue-loader-options!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/webpack-scoped-loader!./node_modules/@dcloudio/vue-cli-plugin-uni/packages/wrap-loader??ref--18!./src/App.vue?vue&type=style&index=0&lang=scss& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "JPst");
exports = ___CSS_LOADER_API_IMPORT___(false);
// Module
exports.push([module.i, "@charset \"UTF-8\";\n/* 安康健康管理 · 设计令牌\n   来源：/workspace/DESIGN.md\n   方案：rpx + SCSS 变量（1px = 2rpx，基于 750rpx 设计基准） */\n/* ---------- 品牌色 ---------- */\n/* ---------- 头像 ---------- */\n/* ---------- 语义状态色 ---------- */\n/* ---------- 金色（尊享装饰） ---------- */\n/* ---------- 背景 ---------- */\n/* 斜向两色渐变：左上(#ddf7ed) → 右下(#f3f3f3)，末端即底色；\n   配合 App.vue 中 background-attachment: fixed 铺满视口固定，不随页面滚动/变长 */\n/* ---------- 文字 ---------- */\n/* ---------- 描边 / 遮罩 ---------- */\n/* ---------- 字体 ---------- */\n/* 英文/数字优先匹配 DIN Pro（Mac 自带 DIN Alternate 作为备选），中文回退苹方/雅黑 */\n/* 移动端最小舒适字号（可读正文下限）：\n   说明/入口/数据标签等可读文字不得小于 12px(24rpx)；\n   $font-size-2xs(10px) 仅限角标、徽标、装饰性元素 */\n/* ---------- 语义排版 ---------- */\n/* ---------- 间距 ---------- */\n/* ---------- 区块标题 ---------- */\n/* 标题下间距 = 列表间距；上间距 = 下间距 × 2 */\n/* ---------- 尺寸 ---------- */\n/* ---------- 圆角（已减半，更克制干净） ---------- */\n/* ---------- 阴影 ---------- */\n/* ---------- 层级 ---------- */\n/* ---------- 动效 ---------- */\n/* uni-app 全局说明：\n   - 所有页面均为 navigationStyle: custom，使用自定义 hm-navbar\n   - hm-navbar 采用 position: static（文档流内），导航栏随页面内容自然向上滚动消失\n   - 顶部安全区 padding-top: var(--status-bar-height) 由 hm-navbar 内部处理\n   - 不在 uni-page-body 叠加 padding-top，避免与 navbar 内部占位双重下移 */\nuni-page-body {\n  background: #f3f3f3;\n  color: #1a2a3c;\n  font-family: \"DIN Pro\", \"DIN Alternate\", \"PingFang SC\", -apple-system, BlinkMacSystemFont, \"Hiragino Sans GB\", \"Microsoft YaHei\", sans-serif;\n  font-size: %?28?%;\n  line-height: 1.6;\n}\nbody.?%PAGE?%{\n  background: #f3f3f3;\n}\nuni-view,\nuni-text,\nuni-scroll-view,\nuni-button,\nuni-input,\nuni-textarea,\nuni-image {\n  box-sizing: border-box;\n}\n/* uni-app H5 中 <view> 编译为自定义元素 <uni-view>，\n   浏览器默认 display: inline 会导致容器 padding/margin 失效，\n   这里统一恢复为块级，避免页面区块错位、卡片贴边 */\nuni-view {\n  display: block;\n}\n.hm-page {\n  min-height: 100vh;\n  background: #f3f3f3;\n  background-image: linear-gradient(135deg, #ddf7ed, #f3f3f3);\n  background-repeat: no-repeat;\n  /* 背景固定于视口：渐变铺满视口，页面滚动/变长时背景不随之移动 */\n  background-size: 100% 100%;\n  background-attachment: fixed;\n}\n.hm-card {\n  background: #ffffff;\n  border-radius: %?24?%;\n  box-shadow: 0 %?4?% %?24?% rgba(15, 61, 53, 0.06);\n}\n.hm-sec-title {\n  font-size: %?36?%;\n  font-weight: 800;\n  line-height: 1.1;\n  color: #1a2a3c;\n  letter-spacing: %?1?%;\n}\n.hm-sec-sub {\n  font-size: %?24?%;\n  color: #64748b;\n  margin-top: %?16?%;\n}\n.hm-divider {\n  height: %?1?%;\n  background: rgba(15, 61, 53, 0.06);\n}\n.hm-safe-bottom {\n  height: calc(env(safe-area-inset-bottom) + %?24?%);\n}\n.ellipsis {\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.ellipsis-2 {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}", ""]);
// Exports
module.exports = exports;


/***/ })

/******/ });