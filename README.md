# node-sprite-css
基于小图生成对应的 CSS Sprites ，并且支持高清屏的样式处理。
> 因为只是针对特定的问题点，所以没有提供额外的扩展性。

## 安装
```
    npm install spritesmith-css
```
## 使用
```js
    const spritesmith2css = require("spritesmith-css");
    //src 为 1x 的 icon 地址列表
    //src2 为 2x 的 icon 地址列表（用于支持 sprites，你必须使用两倍大小的 icon）
    spritesmith2css({
        src: src1x,
        src2: src2x
    });
```

## Options
### src
- type: Array
- required: true

需要合并的图片的地址列表

### src2
- type: Array
- required: false

需要合并的两倍图的地址列表，用于支持高清屏（必须使用两倍大小的图片）

### output
- type: String
- default: './'
- required: false

输出的 CssSprites(合并后的大图和 css) 路径，默认为当前目录

### name
- type: String
- default: 'sprites'
- required: false

输出的名称

## License
MIT
