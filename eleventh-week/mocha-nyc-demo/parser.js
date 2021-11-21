// 文件末尾判定
const EOF = Symbol("EOF");
const REGULAR_TAG_NAME = /^[a-zA-Z]$/;
const REGULAR_END = /^[\t\n\f ]$/;

const TOKEN_TYPE_TEXT = "text";
const TOKEN_TYPE_START_TAG = "startTag";
const TOKEN_TYPE_END_TAG = "endTag";
const TOKEN_TYPE_EOF = "EOF";

let stack;
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null; 

/**
 * 无状态
 * 为查找标签开始的状态
*/
function data(c) {
    if (c === "<") {
        return startTag;
    } else if (c === EOF) {
        outputToken({
            type: TOKEN_TYPE_EOF
        })
        return;
    } 
    outputToken({
        type: TOKEN_TYPE_TEXT,
        content: c
    });
    return data;
}

/**
 * 标签开始状态
 * 为查找进入结束标签的状态
*/
function startTag(c) {
    if (c === "/") {
        return endTag;
    } else if (c.match(REGULAR_TAG_NAME)) {
        currentToken = {
            type: TOKEN_TYPE_START_TAG,
            tagName: ""
        }
        return tagName(c);
    }
    return data;
}

/**
 * 标签名状态
 * <html prop 空格进入参数状态
 * /> /进入自关闭状态
*/
function tagName(c) {
    if (c.match(REGULAR_END)) {
        return beforeAttributeName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c.match(REGULAR_TAG_NAME)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c === ">") {
        outputToken(currentToken);
        return data;
    }
    return tagName;
}
/*********************************** Attribute Start *******************************************/
/**
 * 开始添加属性状态
 * <html property
*/
function beforeAttributeName(c) {
    if (c.match(REGULAR_END)) {
        return beforeAttributeName; 
    } else if (c === "/" || c === ">" || c === EOF) {
        return afterAttributeName(c); ///< reconsume
    } else if (c === "=") {
        throw new Error("attibute name without =");
    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}

/**
 * 属性状态
 * class="geek-task-content"
*/
function attributeName(c){
    if (c.match(REGULAR_END) || c === "/" || c === ">" || c === EOF) {
        return afterAttributeName(c); ///< reconsume
    } else if (c === "=") {
        return beforeAttributeValue;
    } else if (c === "\u0000") {

    } else if (c === "\"" || c === "'" || c === "<") {

    } else {
        currentAttribute.name += c;
        return attributeName
    }
}

function beforeAttributeValue(c) {
    if (c.match(REGULAR_END) || c === "/" || c === ">" || c === EOF) {
        return beforeAttributeValue;
    } else if (c === "\"") {
        return doubleQuotedAttributeValue;
    } else if (c === "\'") {
        return singleQuotedAttributeValue;
    } else if (c === ">") {

    } else {
        return unQuotedAttributeValue(c); ///< reconsume
    }
}

function doubleQuotedAttributeValue(c) {
    if (c === "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue
    } else if (c === "\u0000") {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c === "'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue
    } else if (c === "\u0000") {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function unQuotedAttributeValue(c) {
    if (c.match(REGULAR_END)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName
    } else if (c === "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        outputToken(currentToken);
        return data;
    } else if (c === "\u0000") {

    } else if (c === "\"" || c === "'" || c === "<" || c === "=" || c === "`") {

    } else if (c === EOF) {

    } else {
        currentAttribute.value += c;
        return unQuotedAttributeValue;
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(REGULAR_END)) {
        return beforeAttributeName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        outputToken(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        // currentAttribute.value += c;
        // return doubleQuotedAttributeValue;
        throw new Error("unexpected character \"" + c + "\"");
    }
}

function afterAttributeName(c) {
    if (c.match(REGULAR_END)) {
        return afterAttributeName;
    } else if (c === "/") {
        return selfClosingStartTag;
    } else if (c === "=") {
        return beforeAttributeValue;
    } else if (c === ">") {
        currentToken[currentAttribute.name] = "";
        outputToken(currentToken);
        return data;
    } else if (c === EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c);
    }
}

/*********************************** Attribute End *******************************************/

/**
 * 自关闭状态
*/
function selfClosingStartTag(c) {
    if (c === ">") {
        currentToken.isSelfClosing = true;
        outputToken(currentToken);
        return data;
    } else if (c === "EOF") {

    } else {

    }
}

/**
 * 标签结束状态
*/
function endTag(c) {
    if (c.match(REGULAR_TAG_NAME)) {
        currentToken = {
            type: TOKEN_TYPE_END_TAG,
            tagName: ""
        }
        return tagName(c);
    } else if (c === ">") {

    } else if (c === EOF){ 

    } else {

    }
}

function outputToken(token) {
    let top = stack[stack.length - 1];
    if (token.type === TOKEN_TYPE_START_TAG) {
        let element = {
            type: "element",
            children: [],
            attributes: []
        }
        element.tagName = token.tagName;
        for (const p in token) {
            if (p !== "type" && p !== "tagName") {
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
            }
        }

        top.children.push(element);
        // element.parent = top; 循环引用会导致console打印报错
        if (!token.isSelfClosing) {
            stack.push(element);
        }
        currentTextNode = null;
    } else if (token.type === TOKEN_TYPE_END_TAG) {
        if (top.tagName !== token.tagName) {
            throw new Error("without corrent end tag name");
        } else {
            if (top.tagName === "style") {
                cssParser.addCSSRules(top.children[0].content);
            }
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type === TOKEN_TYPE_TEXT) {
        if (currentTextNode === null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

export function parseHTML(html) {
    stack = [{ type: "document", children:[] }];
    currentToken = null;
    currentAttribute = null;
    currentTextNode = null
    let state = data;
    for (const c of html) {
        state = state(c);
    }
    state = state(EOF);
    return stack[0];
}