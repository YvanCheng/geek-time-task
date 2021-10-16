import { ExecutionContext, Reference, Realm } from "./runtime.js";

export class Evaluator {
    constructor() {
        this.realm = new Realm();
        this.globalObject = {};
        this.ecs = [new ExecutionContext(this.realm, this.globalObject)]
    }
    evaluate(node) {
        if (this[node.type]) {
            return this[node.type](node);
        }
    }
    Program(node){
        return this.evaluate(node.children[0]);
    }
    StatementList(node){
        if (node.children.length === 1) {   
            return this.evaluate(node.children[0]);
        } else {
            this.evaluate(node.children[0]);
            return this.evaluate(node.children[1]);
        }
    }
    Statement(node){
        return this.evaluate(node.children[0]);
    }
    VariableDeclaration(node) {
        console.log("Declaration variable", node.children[1]);
    }
    ExpressionStatement(node) {
        return this.evaluate(node.children[0]);
    }
    Expression(node) {
        return this.evaluate(node.children[0]);
    }
    AdditiveExpression(node) {
        if (node.children.length === 1){
            return this.evaluate(node.children[0]);
        } else {
            //TODO
        }
    }
    MultiplicativeExpression(node) {
        if (node.children.length === 1){
            return this.evaluate(node.children[0]);
        } else {
            //TODO
        }
    }
    PrimaryExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        } else {
            //TODO
        }
    }
    Literal(node) {
        return this.evaluate(node.children[0]);
    }
    NumericLiteral(node) {
        const str = node.value;
        let l = str.length;
        let value = 0;
        let n = 10;
        if (str.match(/^0b/)) {
            n = 2;
            l -= 2;
        } else if (str.match(/^0o/)) {
            n = 8;
            l -= 2;
        } else if (str.match(/^0x/)) {
            n = 16;
            l -= 2;
        }
        while(l--) {
            let c = str.charCodeAt(str.length - l - 1);
            if (c >= 'a'.charCodeAt(0)) {
                c = c - 'a'.charCodeAt(0) + 10;
            } else if (c >= 'A'.charCodeAt(0)) {
                c = c - 'A'.charCodeAt(0) + 10;
            } else if (c >= '0'.charCodeAt(0)) {
                c = c - '0'.charCodeAt(0) + 10;
            }
            value = value * n + c
        }
        console.log(value);
        return Number(node.value);
    }
    StringLiteral(node) {
        // let i = 1;
        let result = [];
        for (let index = 1; index < node.value.length - 1; index++) {
            if (node.value[index] === '\\') {
                ++ index;
                const c = node.value[index];
                const map = {
                    "\"": "\"",
                    "\'": "\'",
                    "\\": "\\",
                    "0": String.fromCharCode(0x0000),
                    "b": String.fromCharCode(0x0008),
                    "f": String.fromCharCode(0x000C),
                    "n": String.fromCharCode(0x000A),
                    "r": String.fromCharCode(0x000D),
                    "t": String.fromCharCode(0x0009),
                    "v": String.fromCharCode(0x000B),
                }
                if (c in map) {
                    result.push(map[c]);
                } else {
                    result.push(c);
                }
            } else {
                result.push(node.value[index]);
            }
        }
        return result.join('');
    }
    ObjectLiteral(node) {
        if (node.children.length === 2) {
            return {};
        }
        if (node.children.length === 3) {
            let object = new Map();
            this.PropertyList(node.children[1], object);
            //object.prototype =
            return object;
        }
    }
    PropertyList(node, object) {
        if (node.children.length === 1) {
            this.Property(node.children[0], object);
        } else {
            this.PropertyList(node.children[0], object);
            this.Property(node.children[2], object);
        }
    }
    Property(node, object) {
        let name;
        if (node.children[0].type === "Identifier") {
            name = node.children[0].name;
        } else if (node.children[0].type === "StringLiteral") {
            name = node.children[0].name;
        }
        object.set(name, {
            value: this.evaluate(node.children[2]),
            writable: true,
            enumerable: true,
            configable: true
        });
    }
    AssignmentExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }
        let left = this.evaluate(node.children[0]);
        const right = this.evaluate(node.children[2]);
        left.set(right);
    }
    LogicalORExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }
        const result = this.evaluate(node.children[0]);
        if (result) {
            return result;
        } else {
            return this.evaluate(node.children[2]);
        }
    }
    LogicalANDExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }
        const result = this.evaluate(node.children[0]);
        if (!result) {
            return result;
        } else {
            return this.evaluate(node.children[2]);
        }
    }
    LeftHandSideExpression(node) {
        return this.evaluate(node.children[0]);
    }
    NewExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }
        if (node.children.length === 2) {
            const cls = this.evaluate(node.children[1]);
            if (cls) {
                return cls.construct();
            }
        }
    }
    CallExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }
        if (node.children.length === 2) {
            let func = this.evaluate(node.children[0]);
            const args = this.evaluate(node.children[1]);
            if (func instanceof Reference) {
                func = func.get();
            }
            return func.call(args);
        }
    }
    MemberExpression(node) {
        if (node.children.length === 1) {
            return this.evaluate(node.children[0]);
        }
        if (node.children.length === 3) {
            debugger;
            const obj = this.evaluate(node.children[0]).get();
            const prop = obj.get(node.children[2].name);
            if ("value" in prop) {
                return prop.value;
            }
            if ("get" in prop) {
                return prop.get.call(obj);
            }
        }
    }
    Identifier(node) {
        const runningEC = this.ecs[this.ecs.length - 1];
        return new Reference(runningEC.lexicalEnvironment, node.name);
    }
    Arguments(node) {
        if (node.children.length === 2) {
            return [];
        } else {
            return this.evaluate(node.children[1]);
        }
    }
    ArgumentList(node) {
        if (node.children.length === 2) {
            let result = this.evaluate(node.children[0]);
            if (result instanceof Reference) {
                result = result.get();
            }
            return [result];
        } else {
            let result = this.evaluate(node.children[2]);
            if (result instanceof Reference) {
                result = result.get();
            }
            return this.evaluate(node.children[0]).concat(result);
        }
    }
}