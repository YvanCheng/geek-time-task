import { scan } from "./LexParser.js";

const syntax = {
    Program: [["StatementList", "EOF"]],
    StatementList: [
        ["Statement"],
        ["StatementList", "Statement"]
    ],
    Statement: [
        ["ExpressionStatement"],
        ["IfStatement"],
        ["VariableDeclaration"],
        ["FunctionDeclaration"]
    ],
    IfStatement: [
        ["if","(", "Expresion", ")", "Statement"]
    ],
    VariableDeclaration: [
        ["var", "Identifier", ";"],
        ["let", "Identifier", ";"],
        ["const", "Identifier", ";"]
    ],
    FunctionDeclaration: [
        ["function", "Identifier","(",")","{","StatementList","}"]
    ],
    ExpressionStatement: [
        ["Expression", ";"]
    ],
    Expression: [
        ["AdditiveExpression"]
    ],
    AdditiveExpression: [
        ["MultiplicativeExpression"],
        ["AdditiveExpression", "+", "MultiplicativeExpression"],
        ["AdditiveExpression", "-", "MultiplicativeExpression"]
    ],
    MultiplicativeExpression: [
        ["PrimaryExpression"],
        ["MultiplicativeExpression", "*", "PrimaryExpression"],
        ["MultiplicativeExpression", "/", "PrimaryExpression"],
    ],
    PrimaryExpression:[
        ["(", "Expression" ,")"],
        ["Literal"],
        ["Identifier"]
    ],
    Literal: [
        ["NumericLiteral"]
    ]
}

let hash = {}

function closure(state) {
    hash[JSON.stringify(state)] = state;
    let queue = [];
    for (const symbol in state) {
        if (symbol.match(/^\$/)) {
            continue;
        }
        queue.push(symbol);
    }
    while(queue.length) {
        const symbol = queue.shift();
        if (syntax[symbol]) {
            for (const rule of syntax[symbol]) {
                if (!state[rule[0]]) {
                    queue.push(rule[0]);
                }
                let current = state;
                for (const part of rule) {
                    if (!current[part]) {
                        current[part] = {};
                    }
                    current = current[part];
                }
                current.$reduceType = symbol;
                current.$reduceLength = rule.length;
            }
        }
    }
    for (const symbol in state) {
        if (symbol.match(/^\$/)) {
            continue;
        }
        if (hash[JSON.stringify(state[symbol])]) {
            state[symbol] = hash[JSON.stringify(state[symbol])];
        } else {
            closure(state[symbol]);   
        }
    }
}
let end = {
    $isEnd: true
}

let start = {
    "Program": end
}

closure(start);

// console.log(start);

// let source = `
// for (let i = 0; i < 3; i++) {
//     for (let j = 0; j < 3; j++) {
//         const cell = document.createElement("div");
//         cell.classList.add("cell");
//         cell.innerText = pattern[i * 3 + j] === 2 ? "🍵" : 
//             pattern[i * 3 + j] === 1 ? "🐩" : "";
//         cell.addEventListener("click", () => userMove(j, i));
//         board.appendChild(cell);
//     }
//     board.appendChild(document.createElement("br"));
// }
// `

let source = `
let a;
var b;
`

function parse() {
    let stack = [start];
    let symbolStack = [];
    function reduce() {
        let state = stack[stack.length - 1];
        if (state.$reduceType) { 
            let children = [];
            for (let i = 0; i < state.$reduceLength; i++) {
                stack.pop();
                children.push(symbolStack.pop());
            }
            //create a non-terminal symbol and shift it
            return {
                type: state.$reduceType,
                children: children.reverse()
            };
        }  else {
            throw new Error("unexpected token");
        }
    }
    function shift(symbol) {
        let state = stack[stack.length - 1];
        if (symbol.type in state) {
            stack.push(state[symbol.type]);
            symbolStack.push(symbol);
        } else {
            shift(reduce());
            shift(symbol);
        }
    }

    for (const symbol of scan(source)) {
        shift(symbol);
    }
    return reduce();
}

let evaluator = {
    Program(node) {
        console.log(node);
    },
    Program(node){
        return evaluate(node.children[0]);
    },
    StatementList(node){
        if (node.children.length === 1) {   
            return evaluate(node.children[0]);
        } else {
            evaluate(node.children[0]);
            return evaluate(node.children[1]);
        }
    },
    Statement(node){
        return evaluate(node.children[0]);
    },
    VariableDeclaration(node) {
        console.log("Declaration variable", node.children[1].value);
    },
    EOF() {
        return null;
    }
}

function evaluate(node) {
    if (evaluator[node.type]) {
        return evaluator[node.type](node);
    }
}

const tree = parse(source);
evaluate(tree);