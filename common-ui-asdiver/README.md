# common-ui-asdiver

a simple UI Library for student。

## Installing

Using npm:

```
$ npm install common-ui-asdiver
```

## Example

At present, there are only rotation charts

Suppose you need one rotation at a dom just set size and give it to package

```html
<body>
  <div class="total">
    
  </div>
</body>

<style>
/* The recommended size is the same as the reserved image */
  .total{
    width: 600px;
    height: 400px;
    background-color: pink;
  }
</style>
```

use->

```js
const Rotation= require('common-ui-asdiver').Rotation;
/**
 * querySelectorTarget（String） target dom select,source code user querySelector
 * imgArray（Array） this source of img and click event function
 * info（object） custom parameters
 */
const example = new Rotation(".total",
    [{
      src:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F052420110515%2F200524110515-1-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665314220&t=dc9d86b9b54d484143dd424bf5447b01",
      clickFunction:(e)=>{
      console.log(e);
      }
    },{
      src:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwww.2008php.com%2F09_Website_appreciate%2F10-07-11%2F1278861720_g.jpg&refer=http%3A%2F%2Fwww.2008php.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1665452390&t=60a46609e614183e2d972f32f4ad50b0",
      clickFunction:(e)=>{
      console.log(e);
      }
    },{
      src:"https://imgcps.jd.com/ling4/100037199897/5Lqs6YCJ5aW96LSn/5L2g5YC85b6X5oul5pyJ/p-5bd8253082acdd181d02fa1b/ec752cb5/cr/s/q.jpg",
      clickFunction:(e)=>{
      console.log(e);
      }
    }],{
    //about move set up（required）
    move:{
      //speed
      moveTime:"0.5s",
      // is auto move
      autoMoveOpen:true,
      //the direction of auto move ,negative to left, positive number to right
      autoMoveDirection:1,
      //movement interval
      autoMoveTime:2000

    },
    //buttonType（requrie）
    buttonStyle:{
      //whether to display when the mouse is not on the box
      mouseOutDisplay:false,
      //button size
      height:"30px",
      width:"21px",
      //button color
      buttonColor:"yellow"
    },
    //The button list at the bottom (is optional. Without this attribute, it means that it is not used)
    dotStyle:{
      //color when not selected
      unSelectColor:"black",
      //color when selected
      selectColor:"yellow",
      //button transparency
      opacity:0.5,
      //size of button
      size:"30px"
    }
  })
```

than work,let me know if you have any questions.


