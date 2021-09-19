# ToyBrowser总结

## 1 概述
浏览器原理即分为HTTP请求、HTTP解析、HTML解析、dom与CSS计算、dom与CSS排版、渲染

## 2 HTTP请求\HTTP解析
要注意request与response格式，以及相关规法

## 3 HTML解析
通过状态机通过解析标签、属性、属性值记录dom元素

## 4 dom与CSS计算
解析styleb标签并记录CSS规则，通过stack的概念存储dom元素与CSS匹配的规则

## 5 dom与CSS排版
通过主轴、交叉轴的方式，判断flex布局的布局方式计算dom元素所处位置

## 6 渲染
在计算玩dom元素位置后，即可渲染在浏览器中
