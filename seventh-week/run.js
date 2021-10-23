import { Evaluator } from './evaluator.js';
import { parse } from "./Synctaxparser.js";

document.getElementById('run').addEventListener('click', (event) => {
    // const parseTree = parse(document.getElementById("source").value);
    const running = new Evaluator().evaluate(parse(document.getElementById("source").value));
    console.log(running);
});