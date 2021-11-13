const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");
const PAUSE_START = Symbol("pause-start");
const PAUSE_TIME = Symbol("pause-time");

export class Timeline {
    constructor() {
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this.state = 'Inited';
    }
    start() {
        if (this.state !== 'Inited') {
            return;
        }
        this.state = "Started";
        let startTime = Date.now();
        this[PAUSE_TIME] = 0;
        this[TICK] = () => {
            let now = Date.now();
            for (const animation of this[ANIMATIONS]) {
                let time;
                if (this[START_TIME].get(animation) < startTime) {
                    time = now - startTime - this[PAUSE_TIME] - animation.delay;
                } else {
                    time = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay;
                }
                if (animation.duration < time) {
                    this[ANIMATIONS].delete(animation);
                    time = animation.duration; 
                }
                if (time > 0) {
                    animation.receive(time);
                }
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }
    pause() {
        if (this.state !== 'Started') {
            return;
        }
        this.state = "Paused";
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
    resume() {
        if (this.state !== 'Paused') {
            return;
        }
        this.state = "Started";
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
    }
    reset() { 
        this.state = "Inited";
        this.pause();
        this[PAUSE_TIME] = 0;
        this[ANIMATIONS] = new Set();
        this[START_TIME] = new Map();
        this[TICK_HANDLER] = null;
        this[PAUSE_START] = 0;
    }
    add(animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation);
        this[START_TIME].set(animation, startTime);
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        timingFunction = timingFunction || ( v => v);
        template = template || (v => v);
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.timingFunction = timingFunction;
        this.delay = delay;
        this.template = template;
    }
    receive(time) {
        const range = this.endValue - this.startValue;
        let process = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + range * process);
    }
}