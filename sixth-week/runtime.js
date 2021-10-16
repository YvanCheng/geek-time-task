export class ExecutionContext {
    constructor(realm, lexicalEnvironment, variableEnviroment) {
        variableEnviroment = variableEnviroment || lexicalEnvironment;
        this.lexicalEnvironment = lexicalEnvironment;
        this.variableEnviroment = variableEnviroment;
        this.realm = realm;
    }
}

export class EnvironmentRecord {
    constructor() {

    }
}

export class Reference {
    constructor(object, property) {
        this.object = object;
        this.property = property;
    }
    set(value) {
        this.object.set(this.property, value);
    }
    get() {
        return this.object.get(this.property);
    }
}

export class Realm {
    constructor() {
        this.global = new Map(),
        this.Object = new Map(),
        this.Object.call = function() {

        },
        this.Object_prototype = new Map()
    }
}