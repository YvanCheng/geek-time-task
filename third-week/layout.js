function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }
    for (const prop in element.computeStyle) {
        element.style[prop] = element.computeStyle[prop].value;
        let propValue = element.style[prop];
        if (propValue.toString().match(/px$/)) {
            propValue = parseInt(propValue);
        }
        if (propValue.toString().match(/^[0-9\.]+$/)) {
            propValue = parseInt(propValue);
        }
        element.style[prop] = propValue;
    }
    return element.style;
}

function layout(element) {
    if (!element.computeStyle) {
        return;
    }
    const elementStyle = getStyle(element);
    if (elementStyle.display !== 'flex') {
        return;
    }
    const items = element.children.filter((e) => e.type === 'element');
    items.sort((a, b) => {
        return (a.order || 0 ) - (b.order || 0);
    });
    const style = elementStyle;
    if (style['width'] === 'auto' || style['width'] === '' || style['width'] === undefined) {
        style['width'] = null;
    }
    if (style['height'] === 'auto' || style['height'] === '' || style['height'] === undefined) {
        style['height'] = null;
    }
    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row';
    }
    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch';
    }
    if (!style.justifyContent  || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start';
    }
    if (!style.flexWrap  || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap';
    }
    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch';
    }
    let mainSize, mainStart, mainEnd, mainSign, mainBase,
        crossSize, crossStart, crossEnd, crossSign, crossBase;
    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = 1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }
    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'botom';
        mainSign = 1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }
    if (style.flexDirection === 'wrap-reverse') {
        let temp = crossStart;
        crossStart = crossEnd;
        crossEnd = temp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }
    let isAutoMainSize = false; //是否未设置宽高，自适应子元素宽高
    if (!style[mainSize]) {
        elementStyle[mainSize] = 0;
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const itemStyle = getStyle(item);
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
            }
        }
        isAutoMainSize = true;
    }
    let flexLine = [];
    let flexLines = [flexLine];
    
    let mainSpace = elementStyle[mainSize];
    let crossSpace = 0;
    for (let index = 0; index < items.length; index++) {
        const item = items[index];
        const itemStyle = getStyle(item);
        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }
        if (itemStyle.flex) {
            flexLine.push(item);
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
                flexLine.push(item);
            }
        } else {
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                flexLine.push(item);

                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            mainSpace -= itemStyle[mainSize];
        }
    }
    flexLine.mainSpace = mainSpace; // flex剩余空间


    // compute main axis size
    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }
    if (mainSpace < 0) {
        const scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const itemStyle = getStyle[item];
            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }
            itemStyle[mainSize] = itemStyle[mainSize] * scale;
            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach((items)=>{
            let mainSpace = items.mainSpace;
            let flexTotal = 0;
            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                const itemStyle = getStyle[item];
                if (itemStyle && itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }
            
            if (flexTotal > 0) {
                let currentMain = mainBase;
                for (let index = 0; index < items.length; index++) {
                    const item = items[index];
                    const itemStyle = getStyle[item];
                    if (itemStyle && itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace/flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                let step = 0;
                let currentMain = mainBase;
                if (style.justifyContent === 'flex-start') {
                    //
                } else if (style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                } else if (style.justifyContent === 'center') {
                    currentMain = mainSpace / 2 * mainSign + mainBase;
                } else if (style.justifyContent === 'space-between') {
                    step = mainSpace / (items.length - 1) * mainSign;
                } else if (style.justifyContent === 'space-around') {
                    currentMain = step / 2 + mainBase;
                    step = mainSpace / items.length * mainSign;
                }
                for (let index = 0; index < items.length; index++) {
                    const item = items[index];
                    const itemStyle = getStyle[item];
                    if (itemStyle) {
                        itemStyle[mainStart] = currentMain;
                        itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                        currentMain = itemStyle[mainEnd] + step;
                    }
                }
            }
        });
    }
    // compute cross axis sizes
    if (!style[crossSize]) {
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (let index = 0; index < flexLines.length; index++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[index].crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (let index = 0; index < flexLines.length; index++) {
            crossSpace -= flexLines[index].crossSpace;
            
        }
    }
    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }
    let lineSize = style[crossSize] / flexLines.length;
    if (style.alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    } else if (style.alignContent === 'flex-end') {
        crossBase += crossSign * crossSpace;
        step = 0;
    } else if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    } else if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLine.length - 1);
    } else if (style.alignContent === 'flex-around') {
        crossBase += crossSign * step / 2;
        step = crossSpace / flexLines.length;
    } else if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }
    flexLines.forEach((items)=>{
        let lineCrossSize = style.alignContent === 'stretch' ? items.crossSpace + crossSpace / flexLines.length : item/crossSpace;
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const itemStyle = getStyle(item);
            if (itemStyle) {
                const align = itemStyle.alignSelf || style.alignItems;
                if (itemStyle[crossSize] === null) {
                    itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
                }
                if (align === 'flex-start') {
                    itemStyle[crossStart] = crossBase;
                    itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
                } else if (align === 'flex-end') {
                    itemStyle[crossStart] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
                    itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                } else if (align === 'center') {
                    itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                    itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
                } else if (align === 'stretch') {
                    itemStyle[crossStart] = crossBase;
                    const hasCrossSize = itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0);
                    itemStyle[crossEnd] = crossBase + crossSign * ( hasCrossSize ? itemStyle[crossSize] : lineCrossSize );
                    itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
                }
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    });
    console.log(items);
}

module.exports = layout;