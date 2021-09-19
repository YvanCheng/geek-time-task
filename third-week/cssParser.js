const css = require('css');

var rules = [];

function match(element, selector) {
    if (!element || !selector) {
        return false;
    }
    //复合选择器 -- 正则拆分selector，后续for循环遍历解析出来的选择器
    if (selector.charAt(0) === "#") {
        const attr = element.attributes.filter(attr => attr.name === "id")[0]
        if (attr && attr.value === selector.replace("#", "")) {
            return true;
        }
    } else if (selector.charAt(0) === ".") {
        const attr = element.attributes.filter(attr => attr.name === "class")[0]
        if (attr && attr.value === selector.replace(".", "")) {
            return true;
        }
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }
}

/**
 * specificity caculate rule
 * [ inline, id, class , tag ]
 * div div #id
 * [0,      1,      0,  2]
 * 
 * div .cls #id
 * [0,      1,      1, 1]
*/
function specificity(selector) {
    let p = [0,0,0,0];
    const selectorParts = selector.split(" ");
    for (const part of selectorParts) {
        if (part.charAt(0) === "#") {
            p[1] += 1;
        } else if (part.charAt(0) === ".") {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0];
    }
    if (sp1[1] - sp2[1]) {
        return sp1[1] - sp2[1];
    }
    if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2];
    }
    return sp1[3] - sp2[3];
}

function computeCSS(parentElements,element) {
    let elements = parentElements; ///< 获取父元素
    if (!element.computeStyle) {
        element.computeStyle = {};
    }
    for (const rule of rules) {
        let selectorParts = rule.selectors[0].split(" ").reverse(); // 复杂选择器仅判断了空格
        if (!match(element, selectorParts[0])) {
            continue;
        }
        let matched = false;
        let j = 1;
        for (let index = 0; index < elements.length; index++) {
            if (match(elements[index], selectorParts[j])) {
                j ++;
            }
        }
        if (j >= selectorParts.length) {
            matched = true;
        }
        if (matched) {
            let sp = specificity(rule.selectors[0]);
            let computeStyle = element.computeStyle;
            for (const declaration of rule.declarations) {
                if (!computeStyle[declaration.property]) {
                    computeStyle[declaration.property] = {};
                }
                if (!computeStyle[declaration.property].specificity) {
                    computeStyle[declaration.property].value = declaration.value;
                    computeStyle[declaration.property].specificity = sp;
                } else if (compare(computeStyle[declaration.property].specificity, sp) < 0) {
                    computeStyle[declaration.property].value = declaration.value;
                    computeStyle[declaration.property].specificity = sp;
                }
            }
            console.log(element.computeStyle);
        }
    }
}

function addCSSRules(content) {
    let ast = css.parse(content);
    rules.push(...ast.stylesheet.rules);
};

exports.addCSSRules = addCSSRules;
exports.computeCSS = computeCSS;