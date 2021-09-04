function match(string) {
    for(const c of string) {
        if (c === "a") {
            return true;
        }
    }
    return false
}

match("I am groot");