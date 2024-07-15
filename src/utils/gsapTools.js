import gsap from "gsap";

const SCALE = 100; // 定义常量，提高代码的可读性和可维护性

const transTime = (val) => {
  // 使用Math.floor确保结果为整数，然后通过除以SCALE得到带有两位小数的结果
  // 这种方式在处理大数时可能会有精度损失，但保留了原始功能的要求
  let result = Math.floor(val * SCALE) / SCALE;
  return result;
}
const enterLeave = (val) => {
  if (val < 0) return 1.2;
  return transTime(val * 0.1);
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
  // 参数类型校验：确保time是一个数字
  if (typeof time !== 'number') {
    throw new TypeError('Expected a number for argument "time"');
  }

  // 处理time小于0的情况
  if (time < 0) {
    return 3;
  }

  // 处理time大于等于3的情况
  // if (time >= 3) {
  //   return transTime(time * 0.7);
  // }

  // 处理0 <= time < 3的情况

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
    // disTime == 3; 
    // 对disTime进行基本验证
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
export function animateToHidden (target, toScale, onComplete) {
  gsap.to(target, {
    opacity: 0,
    duration: 0.2,
    scale: toScale,
    onComplete: onComplete
  });
}

export function animateToVisible (target, fromScale) {
  gsap.fromTo(target, {
    scale: fromScale,
    opacity: 0,
  }, {
    scale: 1,
    duration: 0.2,
    opacity: 1,
  });
}
