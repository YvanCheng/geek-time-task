export function geekCreateElement(type, attributes, ...children) {
    let element;
    if (typeof type === 'string') {
        element = new ElementWrapper(type);
    } else {
        element = new type;
    }
    
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
    for (const child of children) {
        if (typeof child === 'string') {
            child = new TextWrapper(child);
        }
        element.appendChild(child);
    }
    return element;
}

export class Component {
    constructor(type) {
        // this.root = this.render();
    }
    setAttribute(key, value) {
        this.root.setAttribute(key, value);
    }
    appendChild(child) {
        this.root.appendChild(child);
    }
    mountTo(parent) {
        parent.appendChild(this.root);
    }
}

class ElementWrapper extends Component{
    constructor(type) {
        this.root = document.createElement(type);
    }
}

class TextWrapper extends Component {
    constructor(content) {
        this.root = document.createTextNode(content);
    }
}