function match(string) {
    let state = start;
    for (const c of string) {
        state = state(c);
    }
    return state === end;
}

function start(c) {
    if (c === "a") {
        return fundA;
    } else {
        return start;
    }
}

function end(c) {
    return end;
}

function fundA(c) {
    if (c === "b") {
        return fundB;
    } else {
        return start(c);
    }
}

function fundB(c) {
    if (c === "c") {
        return fundC;
    } else {
        return start(c);
    }
}

function fundC(c) {
    if (c === "d") {
        return fundD;
    } else {
        return start(c);
    }
}
function fundD(c) {
    if (c === "e") {
        return fundE;
    } else {
        return start(c);
    }
}

function fundE(c) {
    if (c === "f") {
        return end(c);
    } else {
        return start(c);
    }
}

console.log(match("ababcdef"));