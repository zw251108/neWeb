#备注

bower_components/codemirror/lib/codemirror.js

修改 line: 781

cm.display.heightForcer.style.top = plusGap + "px";

=>

cm.display.heightForcer.style.top = scrollGap(cm) + "px";

为了修正在 CodeMirror 显示代码时可以过度滚动