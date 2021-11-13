import { Component, STATE, ATTRIBUTE} from "./framework.js";
import { enableGesture } from "./gesture.js";
import { Timeline, Animation } from "./animation.js";
import { ease } from "./bezier-easing.js";

export { STATE, ATTRIBUTE } from "./framework.js";

export class Carousel extends Component {
  constructor() {
    super();
  }
  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (const record of this[ATTRIBUTE].src) {
      const child = document.createElement("div");
      child.style.backgroundImage = `url(${record.src})`;
      this.root.appendChild(child);
    }
    enableGesture(this.root);
    let timeline = new Timeline;
    timeline.start();

    const children = this.root.children;
    this[STATE].position = 0;

    let t= 0;
    let ax = 0;

    let handler = null;

    this.root.addEventListener("start", event => {
      timeline.pause();
      clearInterval(handler);
      let progress = (Date.now() - t ) / 500;
      ax = ease(progress) * 500 - 500;
    });

    this.root.addEventListener("tap", event => {
      this.triggerEvent("click", { 
        data: this[ATTRIBUTE].src[this[STATE].position],
        position: this[STATE].position 
      });
    });

    this.root.addEventListener("pan", event => {
      let offsetX = event.clientX - event.startX - ax;
      const targetWidth = 500;
      let current = this[STATE].position - ((offsetX - offsetX % targetWidth) / targetWidth);
      for (const offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos % children.length + children.length) % children.length;
          const child = children[pos];
          child.style.transition = 'none';
          child.style.transform = `translateX(${- pos * targetWidth + offset * targetWidth + offsetX % targetWidth }px)`;
      }
    });

    this.root.addEventListener("end", event => {

      timeline.reset();
      timeline.start();
      handler = setInterval(nextPicture, 2000);

      let offsetX = event.clientX - event.startX - ax;
      const targetWidth = 500;
      let current = this[STATE].position - ((offsetX - offsetX % targetWidth) / targetWidth);

      let direction = Math.round((offsetX % 500)/500);

      if (event.isFlick) {
        if (event.velocity < 0) {
          direction = Math.ceil((offsetX % 500)/500);
        } else {
          direction = Math.floor((offsetX % 500)/500);
        }
      }

      for (const offset of [-1, 0, 1]) {
          let pos = current + offset;
          pos = (pos % children.length + children.length) % children.length;
          const child = children[pos];
          child.style.transition = 'none';
          child.style.transform = `translateX(${- pos * targetWidth + offset * targetWidth + offsetX % targetWidth }px)`;
          timeline.add(new Animation(child.style, "transform", - pos * 500 + offset * 500 + offsetX % 500, - pos * 500 + offset * 500 + direction * 500, 500, 0, ease, v => `translateX(${v}px)`));
      }
      this[STATE].position = this[STATE].position - ((offsetX - offsetX % 500) / 500) - direction;
      this[STATE].position = (this[STATE].position % children.length + children.length) % children.length;
      this.triggerEvent("change", { position: this[STATE].position });
    });

    let nextPicture = () => {
      let nextPosition = (this[STATE].position + 1) % this.root.children.length;
      t = Date.now();
      let current = this.root.children[this[STATE].position];
      let next = this.root.children[nextPosition];

      timeline.add(new Animation(current.style, "transform", - this[STATE].position * 500, -500 - this[STATE].position * 500, 500, 0, ease, v => `translateX(${v}px)`));
      timeline.add(new Animation(next.style, "transform", 500 - nextPosition * 500, - nextPosition * 500, 500, 0, ease, v => `translateX(${v}px)`));

      this[STATE].position = nextPosition;
      this.triggerEvent("change", { position: this[STATE].position });
    }

    handler = setInterval(nextPicture, 2000);
    return this.root;
  }
}
