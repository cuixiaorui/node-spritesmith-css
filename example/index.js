const spritesmith2css = require("../index.js");

const src1x = [
  __dirname + "/res/1x/a.png",
  __dirname + "/res/1x/b.png",
  __dirname + "/res/1x/c.png"
];

const src2x = [
  __dirname + "/res/2x/a.png",
  __dirname + "/res/2x/b.png",
  __dirname + "/res/2x/c.png"
];
/**
 * 输出 css 和 png
 * 默认输出到当前目录
 */
spritesmith2css({
  src: src1x,
  src2: src2x
});
