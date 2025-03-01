import gsap from "gsap";

const SCALE = 100; // 定义常量，提高代码的可读性和可维护性

const transTime = (time) => {
  // 使用Math.floor确保结果为整数，然后通过除以SCALE得到带有两位小数的结果
  // 这种方式在处理大数时可能会有精度损失，但保留了原始功能的要求
  let result = Math.floor(time * SCALE) / SCALE;
  return result;
}
const enterLeave = (time) => {
  if (time < 0 || Number.isNaN(time)) return 1.2;
  return transTime(time * 0.1);
}
/**
 * 处理进入场景的逻辑。
 * 
 * 该函数旨在封装进入场景时的时间处理逻辑。它通过调用`enterLeave`函数来实现，
 * 
 * @param {number} time - 表示进入场景的特定时间点。
 * @returns {any} 返回`enterLeave`函数的执行结果。
 */
const enter = (time) => {
  return enterLeave(time)
}
// 元素展示的时间
const delay = (time) => {
  // 处理time小于0的情况
  if (time < 0 || Number.isNaN(time)) {
    return 10;
  }
  // 处理time >= 0的情况
  return transTime(time * 0.6);
}
const leave = (time) => {
  return enterLeave(time)
}
// 使用TweenMax库的timeline方法创建一个时间线
// 参数：timeline(时间线对象)，el(需要动画的元素)，disTime(显示时间)
export function lyricsTimeline (timeline, el, disTime = 1000) { // 默认值为1000毫秒，可以根据实际情况调整
  // 参数有效性检查
  if (!timeline || !el) {
    console.error('Invalid timeline or element provided.');
    return; // 提前退出函数以避免运行时错误
  }
  if (typeof disTime !== 'number') {
    console.error('Invalid duration time provided.');
    return;
  }

  // 将元素渐入舞台，持续时间为enter(disTime)
  timeline.fromTo(el, {
    autoAlpha: 0,
    scaleY: 1.5,
  }, {
    duration: enter(disTime), // 假设这些函数返回合理的动画持续时间
    autoAlpha: 1,
    scaleY: 1
  })

  // 将元素渐出舞台，持续时间为leave(disTime)，延迟时间为delay(disTime)
  timeline.to(el, {
    scaleY: 1.5,
    delay: delay(disTime), // 增加延迟时间
    duration: leave(disTime), // 动画持续时间由leave函数决定
    autoAlpha: 0,
  })
}

export function picTimeline (timeline, el, duration = 60000) {
  // 参数有效性检查
  if (!timeline || !el) {
    console.error('Invalid timeline or element provided.');
    throw new Error('Invalid timeline or element provided.'); // 抛出错误
  }
  timeline.to(el, {
    rotation: 360,
    duration: duration,
    repeat: -1,
    ease: "linear",
  })
}
/**
 * 使用GSAP库动画化目标元素，使其透明度变为0并按指定比例缩放，最终隐藏元素。
 * 此函数专为实现元素的平滑隐藏效果而设计。
 * 
 * @param {HTMLElement} target - 需要进行动画处理的目标元素。
 * @param {number} toScale - 元素最终的缩放比例，用于控制元素隐藏时的大小变化。
 * @param {Function} onComplete - 动画完成时调用的回调函数，可用于执行隐藏后的其他操作。
 */
export function animateToHidden (target, toScale, onComplete) {
  // 使用GSAP的gsap.to方法创建动画，将目标元素的透明度变为0，缩放比例变为toScale，动画持续0.2秒
  // 动画完成后执行onComplete函数
  gsap.to(target, {
    autoAlpha: 0,
    duration: 0.2,
    scale: toScale,
    onComplete: onComplete
  });
}

export function animateToVisible (target, fromScale) {
  gsap.fromTo(target, {
    scale: fromScale,
    autoAlpha: 0,
  }, {
    scale: 1,
    duration: 0.2,
    autoAlpha: 1,
  });
}

/**
 * 动画隐藏面板函数
 * 使用GSAP库进行动画处理，将目标元素隐藏起来。
 * 
 * @param {HTMLElement} target - 需要进行隐藏动画的元素。
 * @param {number} y - 元素隐藏后的垂直偏移量，用于动画效果。
 * @param {Function} onComplete - 动画完成后的回调函数。
 */
export function animatePanelHide (target, y, onComplete) {
  // 使用GSAP的to方法来创建一个动画，将目标元素向下移动并逐渐透明化
  gsap.to(target, {
    y: y,
    autoAlpha: 0,
    duration: 0.2,
    onComplete: onComplete
  })
}

/**
 * 使用GSAP库动画化面板显示
 * 
 * 该函数利用GSAP的fromTo方法来创建一个从起始位置到结束位置的动画效果，同时伴随透明度的变化，用于动画化显示面板或其他DOM元素。
 * 
 * @param {HTMLElement} target - 需要进行动画化的DOM元素目标。
 * @param {number} startToY - 动画开始时元素的y轴位置。
 * @param {number} endToY - 动画结束时元素的y轴位置。
 */
export function animatePanelShow (target, startToY, endToY) {
  gsap.fromTo(target, {
    y: startToY,
    autoAlpha: 0
  }, {
    y: endToY,
    duration: 0.5,
    autoAlpha: 1
  })
}