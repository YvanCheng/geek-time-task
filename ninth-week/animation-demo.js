import { Timeline, Animation } from './animation.js';
import { ease, easeIn } from './bezier-easing.js';

let tl = new Timeline();
tl.start();
tl.add( new Animation(document.querySelector("#animation-element").style, "transform", 0, 500, 2000, 0 , easeIn, v => `translateX(${v}px)`));

document.querySelector("#animation-element-2").style.transition = 'transform ease-in 2s';
document.querySelector("#animation-element-2").style.transform = 'translateX(500px)';

let isPause = false;
document.querySelector("#pause-resume-btn").addEventListener("click", () => {
    isPause?tl.resume():tl.pause();
    isPause = !isPause;
});