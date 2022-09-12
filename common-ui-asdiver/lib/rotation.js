module.exports =   class Rotation {


  /**
   * 构造函数
   * @param {string} querySelectorTarget 目的dom的选择 源码调用querySelector
   * @param {Array} imgArray 图片数组
   * @param {Object} info 轮播图的其他自定义参数
   */
  constructor(querySelectorTarget, imgArray, info){
    if(!info){
      info = {
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
        }}
    }else{
      if(!info.move || !info.buttonStyle){
        throw new Error("require not find","info in Rotation is no complete")
      }
    }

    //DocumentFragment对象 一次性渲染
    this.template = document.createDocumentFragment()
    //寄宿的dom节点
    this.targetDom = document.querySelector(querySelectorTarget)
    //三部分从info获取
    this.imgArray = imgArray;
    this.move = info.move;
    this.buttonStyle = info.buttonStyle;
    this.dotStyle = info.dotStyle

    //调用构建函数
    this.getContext = this.getContext()
    this.movedotOnce = this.movedotOnce()
    this.setMask()
    this.setMove()
    this.setButton()
    this.setDot()
    //虚拟dom树一次性渲染
    this.targetDom.appendChild(this.template)
  };

  /**
   * 实例方法 获取对应节点的上下文 寄宿dom初始设置
   * @returns {Object}
   */
  getContext=function(){
    let returnObj = null
    //闭包以避免多次调用浪费资源
    return ()=>{
      if(returnObj){
        return returnObj
      }

      //溢出隐藏
      this.targetDom.style.overflow = "hidden";
      this.targetDom.style.position = "absolute";
      //获取寄宿的dom的最终渲染样式
      const context =  window.getComputedStyle(this.targetDom);
      const {width, height} = context
      returnObj = {width, height}
      return returnObj
    }
    
  }
  //是否处于过渡变化中
  moving = false
  //移动下标
  leftIndex = 0
  //存放自动移动
  interval = 0
  //提供 底部列表盒子的对象
  dotStyle = null

  /**
   * 对遮罩和图片的处理
   */
  setMask(){
    const imgArray =  this.imgArray;
    const context = this.getContext();

    //外层遮罩
    const mask = document.createElement("div")
    mask.style.width = (imgArray.length+2)*parseInt(context.width) + "px" 
    mask.style.height = context.height;
    mask.style.display = "flex"
    mask.style.alignItems = "stretch"
    mask.style.position = "relative"
    mask.style.top = "0px"
    mask.style.left = -parseInt(context.width)  + "px"
    this.leftIndex = -parseInt(context.width)

    //图片dom
    const realImg =  Array.from(imgArray)
    //头加入
    realImg.unshift(imgArray[imgArray.length-1])
    //尾加入
    realImg.push(imgArray[0])
    //批量加入
    realImg.forEach((item)=>{
      const img = document.createElement("img")
      //源
      img.setAttribute("src",item.src)
      //点击事件加入
      img.addEventListener("click", item.clickFunction)
      //样式
      img.style.width = this.getContext().width
      //加入
      mask.appendChild(img)
    })

    this.template.appendChild(mask)
  }

  /**
   * 过渡/动态 相关设置
   */
  setMove(){
    const mask = this.template.firstChild
    mask.style.transition = `left ${this.move.moveTime} ease-in-out`;
    
    mask.addEventListener("transitionstart", ()=>{
      this.moving = true
    })

    mask.addEventListener("transitionend", ()=>{
      //处理无限滚动
      let mode = 0;
      //左边界
      if(this.leftIndex === 0){
        //修正下表
        this.leftIndex = -(this.imgArray.length)*parseInt(this.getContext().width)
        mask.style.transition = ""
        mode = this.leftIndex
      }else if(this.leftIndex === -(this.imgArray.length+1)*parseInt(this.getContext().width)){
        //右边界
        this.leftIndex = -parseInt(this.getContext().width)
        mask.style.transition = ""
        mode = this.leftIndex    
      }

      if(mode){
        mask.style.left = mode +"px"
        setTimeout(()=>{
            //style还回去 直接还transition会导致动画依旧有
            mask.style.transition = `left ${this.move.moveTime} ease-in-out`;
            this.moving = false
        },0)
      }else{
        this.moving = false
      }

      //驱动底部小点移动
      if(this.dotStyle){
        this.movedotOnce()
      }
    })

    //设置自动移动 鼠标进入取消 鼠标离开开启
    if(this.move.autoMoveOpen){
      //初始开启一次
      this.interval = setInterval(()=>{
        this.moveOnce(this.move.autoMoveDirection)
      }, this.move.autoMoveTime)
      //开启
      this.targetDom.addEventListener("mouseout",()=>{
        //已存在视为无效
        if(this.interval){
          return
        }
        this.interval = setInterval(()=>{
          this.moveOnce(this.move.autoMoveDirection)
        }, this.move.autoMoveTime)
      })
      //取消
      this.targetDom.addEventListener("mouseover",()=>{
        clearInterval(this.interval)
        //恢复初始
        this.interval = 0
      })
    }
  
  }

   /**
   * 设置按钮
   */ 
  setButton(){
    //创建两个按钮
    const left =  document.createElement("div")
    left.style.height = this.buttonStyle.height
    left.style.width = this.buttonStyle.width
    left.style.backgroundColor = this.buttonStyle.buttonColor
    left.style.position = "absolute"
    left.style.opacity = "0.8"
    left.style.top = "50%"
    left.style.transform = "translateY(-50%)";
    left.style.cursor = "pointer"

    const right =  left.cloneNode()

    left.style.left = "0px"
    right.style.right = "0px"

    left.style.borderTopRightRadius = "60%"
    left.style.borderBottomRightRadius = "60%"

    right.style.borderTopLeftRadius = "60%"
    right.style.borderBottomLeftRadius = "60%"
    //添加事件
    left.addEventListener("click", ()=>{
      this.moveOnce(-1)
    })
    right.addEventListener("click", ()=>{
      this.moveOnce(1)
    })

    if(!this.buttonStyle.mouseOutDisplay){
      //不显示
      this.targetDom.addEventListener("mouseout",()=>{
        left.style.display = "none"
        right.style.display = "none"
      })
      //显示
      this.targetDom.addEventListener("mouseover",()=>{
        left.style.display = ""
        right.style.display = ""
      })
    }
    this.template.appendChild(left)
    this.template.appendChild(right)
  }

  /**
   * 底部小点设置
   */
  setDot(){
    if(!this.dotStyle){
      return
    }
    const outer =  document.createElement("div")
    outer.style.height = this.dotStyle.size
    outer.style.position = "absolute"
    outer.style.fontSize = "0px"
    outer.style.left = "50%"
    outer.style.bottom = "0px"
    outer.style.transform = "translateX(-50%)"

    //小点
    const dot =  document.createElement("div")
    dot.style.height = this.dotStyle.size
    dot.style.width = this.dotStyle.size
    dot.style.display = "inline-block";
    dot.style.borderRadius = "50%"
    dot.style.transform = "scale(60%)"
    dot.style.backgroundColor = this.dotStyle.unSelectColor
    dot.style.opacity = this.dotStyle.opacity
    
    outer.appendChild(dot)
    for(let i = 2;i <= this.imgArray.length;i++){
      outer.appendChild(dot.cloneNode())
    }
    dot.style.backgroundColor = this.dotStyle.selectColor
    
    this.dotOuter = outer
    this.template.appendChild(outer)
  }
  
  /**
   * 获取当前显示图片的下标 0 开始
   */
  getImgIndex(){
    return (-this.leftIndex/parseInt(this.getContext().width))-1 
  }

  /**
   * 调用此方法以实现移动 direction小于0向左 大于0向右
   */
  moveOnce(direction){
    const mask = this.targetDom.firstElementChild
    //四种情况下无效 过渡中 未初始化完 无动画（settimeout未执行） 浏览器是否可见 不可见将导致bug
    if(this.moving || !this.leftIndex || !mask.style.transition || document.visibilityState != "visible"){
      return
    }
    //视图向左，遮罩向右
    if(direction< 0){
      this.leftIndex += parseInt(this.getContext().width)
      mask.style.left = parseInt(this.leftIndex)  + "px"
    }else{
      //视图向右，遮罩向左
      this.leftIndex -= parseInt(this.getContext().width)
      mask.style.left = parseInt(this.leftIndex)  + "px"
    }
  }

  /**
   * 实例方法 闭包获取上一个被选中的节点
   */
  movedotOnce = function(){
    let beforeIndex = 0
    return ()=>{
      //更改颜色
      const newIndex =  this.getImgIndex()
      const imgArray =  this.dotOuter.childNodes
      imgArray[beforeIndex].style.backgroundColor = this.dotStyle.unSelectColor
      imgArray[newIndex].style.backgroundColor = this.dotStyle.selectColor
      beforeIndex = newIndex
    }
  }
}