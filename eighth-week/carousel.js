import { Component } from "./framework.js";

export class Carousel extends Component {
  constructor() {
    super();
    this.attributes = Object.create(null);
  }
  setAttribute(key, value) {
    this.attributes[key] = value;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (const record of this.attributes.src) {
      const child = document.createElement("div");
      child.style.backgroundImage = `url(${record})`;
      this.root.appendChild(child);
    }
    let position = 0;
    this.root.addEventListener('mousedown', (event) => {
        const children = this.root.children;
        const startX = event.clientX;
        const move = (moveEvent) => {
            const offsetX = moveEvent.clientX - startX;
            const targetWidth = moveEvent.target.offsetWidth;
            let current = position - ((offsetX - offsetX % targetWidth) / targetWidth);
            for (const offset of [-1, 0, 1]) {
                let pos = current + offset;
                pos = (pos + children.length) % children.length;
                const child = children[pos];
                child.style.transition = 'none';
                child.style.transform = `translateX(${- pos * targetWidth + offset * targetWidth + offsetX % targetWidth }px)`;
            }
            // for (const child of children) {
            //     child.style.transition = 'none';
            //     child.style.transform = `translateX(${- position * child.offsetWidth + offsetX}px)`;
            // }
        }
        const up = (upEvent) => {
            const offsetX = upEvent.clientX - startX;
            position = position - Math.round(offsetX / upEvent.target.offsetWidth);
            const targetWidth = upEvent.target.offsetWidth;
            for (const offset of [0, - Math.sign(Math.round(offsetX / targetWidth) - offsetX + (targetWidth/2) * Math.sign(offsetX))]) {
                let pos = position + offset;
                pos = (pos + children.length) % children.length;
                const child = children[pos];
                child.style.transition = '';
                child.style.transform = `translateX(${- pos * targetWidth + offset * targetWidth }px)`;
            }

            // for (const child of children) {
            //     child.style.transition = '';
            //     child.style.transform = `translateX(${- position * child.offsetWidth}px)`;
            // }
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
        }

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up)
    });

    // let currentIndex = 0;
    // setInterval(() => {
    //   let nextIndex = (currentIndex + 1) % this.root.children.length;

    //   let current = this.root.children[currentIndex];
    //   let next = this.root.children[nextIndex];
    //   next.style.transition = "none";
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`;
    //   setTimeout(() => {
    //     next.style.transition = "";
    //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
    //     next.style.transform = `translateX(${-nextIndex * 100}%)`;
    //     currentIndex = nextIndex;
    //   }, 16);
    //   // for (const childDiv of this.root.children) {
    //   //     childDiv.style.transform = `translateX(-${100 * current}%)`;
    //   // }
    // }, 2000);
    return this.root;
  }
}
