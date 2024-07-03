const transTime = (val) => {
  return Math.floor(val * 100) / 100
}
// 进入或离开时的动画时间
const enterLeave = (val) => {
  // Math.sign(val) 判断val的正负 -1为负数，1为正数，0为0
  if (Math.sign(val) == -1) {
    return 0.5
  } else {
    return transTime(val * 0.2)
  }
}
const enter = (time) => {
  return enterLeave(time)
}
// 元素展示的时间
const delay = (time) => {
  // Math.sign(val) 判断val的正负 -1为负数，1为正数，0为0
  if (Math.sign(time) == -1) {
    return 3
  } else {
    return transTime(time * 0.4)
  }
}
const leave = (time) => {
  return enterLeave(time)
}
// 使用TweenMax库的timeline方法创建一个时间线
// 参数：timeline（时间线对象），el（需要动画的元素），disTime（离开时间）
export function gsapTimeline (timeline, el, disTime) {
  // 将元素渐入舞台，持续时间为enter(disTime)
  timeline.fromTo(el, {
    autoAlpha: 0,
    scale: 1.1,
  }, {
    duration: enter(disTime),
    autoAlpha: 1,
    scale: 1
  })
  // 将元素渐出舞台，持续时间为leave(disTime)，延迟时间为delay(disTime)
  timeline.to(el, {
    delay: delay(disTime),
    duration: leave(disTime),
    autoAlpha: 0,
  })
}
