import { Carousel } from "./Carousel.js";
import { geekCreateElement } from "./framework.js";
import { GeekButton } from "./GeekButton.js";
// import { List } from "./List.js";


// class CustomDiv extends Component {
//     constructor() {
//         super();
//     }
//     render() {
//         return document.createElement('div');
//     }
// }
// document.body.appendChild(a);

const images = [
  {
    src: "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    url: "https://baidu.com",
    title: "图1"
  },
  {
    src: "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    url: "https://baidu.com",
    title: "图2"
  },
  {
    src: "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    url: "https://baidu.com",
    title: "图3"
  },
  {
    src: "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
    url: "https://baidu.com",
    title: "图4"
  },
];

const a = (
  <Carousel
    src={images}
    onChange={(event) => console.log(event.detail.position)}
    onClick={(event) => window.open(event.detail.data.url)}
  />
);

let b = <GeekButton>
    content
</GeekButton>;

// let c = <List data={images}>
//     {
//         (record) => {
//             <div>
//                 <img src={record.src} />
//                 <a href={record.url}>{record.title}</a>
//             </div>
//         }
//     }
// </List>;
a.mountTo(document.body);
b.mountTo(document.body);
// c.mountTo(document.body);
