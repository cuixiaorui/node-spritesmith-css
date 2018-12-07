//opts
//    src 需要打包的img路径数组1x  不能没有此字段
//    src2 2x的图片 可以没有此字段
//    output 输出的路径 默认值为 当前目录
//    name 输出的名称   默认值为 sprites
const fs = require("fs");
const path = require("path");
const Spritesmith = require("spritesmith");
let options = {
  output: "./",
  name: "sprites"
};

module.exports = async function(opts) {
  options = Object.assign(options, opts);

  if (!options.src) {
    console.log(`options.src 不能为空`);
    return;
  }

  if (!Array.isArray(options.src)) {
    console.log(`options.src 必须是一个数组`);
    return;
  }

  var css1x = await execute1x();
  var css2x = await execute2x();
  var css = css1x + "\r\n" + css2x;
  saveCss(css);
};

async function execute1x() {
  const imagePath1x = path.join(options.output, options.name) + ".png";
  const info1x = await generateSpritesheetInfo(options.src);
  saveSpritesmithImg(imagePath1x, info1x.image);
  const cssStyle1x = getCssStyle1x(info1x.coordinates);
  return cssStyle1x;
}

async function execute2x() {
  //是否需要导出x2
  let cssStyle2x = "";
  if (options.src2) {
    const imageName = options.name + "@2x";
    const imagePath2x = path.join(options.output, imageName) + ".png";
    const info2x = await generateSpritesheetInfo(options.src2);
    saveSpritesmithImg(imagePath2x, info2x.image);
    cssStyle2x = getCssStyle2x(info2x, imageName);
  }
  return cssStyle2x;
}

/**
 * 生成大图和位置信息
 * @param {String} src
 */
function generateSpritesheetInfo(src) {
  return new Promise((resolve, reject) => {
    Spritesmith.run(
      {
        src,
        algorithm: "binary-tree"
      },
      function handleResult(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve({
            image: result.image,
            coordinates: result.coordinates,
            properties: result.properties
          });
        }
      }
    );
  });
}

/**
 * 保存精灵图
 * @param {*} imgPath
 * @param {*} img
 */
function saveSpritesmithImg(imgPath, imgInfo) {
  fs.writeFileSync(imgPath, imgInfo);
}

/**
 * 保存css
 */
function saveCss(cssInfo) {
  const cssPath = path.join(options.output, `${options.name}.css`);
  fs.writeFileSync(cssPath, cssInfo);
}

/**
 * x2大小的css样式
 * 用以支持高清屏
 */
function getCssStyle2x({ coordinates, properties }, imageName) {
  const x2Width = properties.width * 0.5;
  const x2Height = properties.height * 0.5;
  let cssStyle = createCssStyle(coordinates, ({ name }) => {
    return cssStyleTemplateX2(name, x2Width, x2Height, imageName);
  });
  return `@media (-webkit-min-device-pixel-ratio: 2),
  (min-resolution: 192dpi) {
    ${cssStyle}
  }
  `;
}

function getCssStyle1x(coordinates) {
  return createCssStyle(coordinates, ({ name, value }) => {
    return cssStyleTemplateX1(
      name,
      options.name,
      value.x,
      value.y,
      value.width,
      value.height
    );
  });
}

function createCssStyle(coordinates, templateCallBack) {
  let cssStyle = "";
  for (let key in coordinates) {
    const value = coordinates[key];
    const name = getNameByPath(key);
    const template = templateCallBack({ name, value });
    cssStyle += template;
  }

  return cssStyle;
}

function cssStyleTemplateX1(name, imgName, x, y, width, height) {
  return `.icon-${name} {
    background-image: url(${imgName}.png);
    background-position: -${x}px -${y}px;
    width: ${width}px;
    height: ${height}px;
}\r\n`;
}

function cssStyleTemplateX2(name, width, height, imageName) {
  return `.icon-${name}{
    background-image: url(${imageName}.png);
    background-size: ${width}px ${height}px;
  }\r\n`;
}

/**
 * 基于路径获取文件名称
 * 注意路径必须带后缀
 */
function getNameByPath(path) {
  let matchs = path.match(/\/(\w*)\.\w*/);
  if (matchs && matchs[1]) {
    return matchs[1];
  }
  console.log(`path 格式有问题: ${path}`);
  return "";
}
