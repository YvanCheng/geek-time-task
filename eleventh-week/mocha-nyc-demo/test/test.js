var assert = require('assert');

import { parseHTML } from "../parser.js";
// var add = require('../add.js').add;
// var mul = require('../add.js').mul;

describe('parse html', function() {

    it("<a>abc</a>", function () {
      let tree = parseHTML('<a>abc</a>');
      assert.equal(tree.children[0].tagName, "a");
      assert.equal(tree.children[0].children.length, 0);
    });
    it("<a href='https://baidu.com'>abc</a>", function () {
      let tree = parseHTML("<a href='https://baidu.com'>abc</a>");
      assert.equal(tree.children[0].length, 1);
      assert.equal(tree.children[0].children.length, 0);
    });
    it("<a href id>abc</a>", function () {
      let tree = parseHTML("<a href id>abc</a>");
      assert.equal(tree.children.length, 1);
      assert.equal(tree.children[0].children.length, 0);
    });
    it('<a id=abc>abc</a>', function () {
      let tree = parseHTML('<a id=abc>abc</a>');
      assert.equal(tree.children.length, 1);
      assert.equal(tree.children[0].children.length, 0);
    });
    it('<a id=abc/>', function () {
      let tree = parseHTML('<a id=abc/>');
      assert.equal(tree.children.length, 1);
      assert.equal(tree.children[0].children.length, 0);
    });
    it('<a /> sadsa', function () {
      let tree = parseHTML('<a /> sadsa');
      assert.equal(tree.children.length, 1);
      assert.equal(tree.children[0].children.length, 0);
    });
    it('<a />', function () {
      let tree = parseHTML('<a />');
      assert.equal(tree.children.length, 1);
      assert.equal(tree.children[0].children.length, 0);
    });
    it('<>', function () {
      let tree = parseHTML('<>');
      assert.equal(tree.children.length, 1);
      assert.equal(tree.children[0].children.type, "text");
    });
});