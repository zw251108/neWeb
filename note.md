#备注

bower_components/codemirror/lib/codemirror.js

修改 line: 781

cm.display.heightForcer.style.top = plusGap + "px";

=>

cm.display.heightForcer.style.top = scrollGap(cm) + "px";

为了修正在 CodeMirror 显示代码时可以过度滚动
取消


bower_components/codemirror-emmet/dist/emmet.js

修改 line: 1

(function (root, factory) {if (typeof define === "function" && define.amd) {define(factory);} else {root.emmetPlugin = factory();}}(this, function () {

=>

(function (root, factory) {if (typeof define === "function" && define.amd) {define(['../lib/codemirror'], factory);} else {root.emmetPlugin = factory();}}(this, function (CodeMirror) {

为了可以更方便的以 AMD 的方式加载


node_modules/segment/lib/Segments.js

修改 line: 163

text.replace(/\r/g, '\n').split(/(\n|\s)+/).forEach(function (section) {

=>

text.replace(/\r/g, '\n').split(/(\n)+/).forEach(function (section) {

不再让分词以空格来分词