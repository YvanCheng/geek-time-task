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
    if (c === "a") {
        return fundA2;
    } else {
        return start(c);
    }
}

function fundA2(c) {
    if (c === "b") {
        return fundB2;
    } else {
        return start(c);
    }
}

function fundB2(c) {
    if (c === "a") {
        return fundA3;
    } else {
        return start(c);
    }
}

function fundA3(c) {
    if (c === "b") {
        return fundB3;
    } else {
        return start(c);
    }
}

function fundB3(c) {
    if (c === "x") {
        return end;
    } else {
        return start(c);
    }
}


console.log(match("abababx"));
