const transTime = (val) => {
  return Math.floor(val * 100) / 100
}
const enterLeave = (val) => {
  if (val <= 1) {
    return transTime(val * 0.2)
  } else if (val <= 2 && val > 1) {
    return transTime(val * 0.1)
  } else if (val > 2 && val <= 3) {
    return transTime(val * 0.1)
  } else {
    if (isNaN(val)) {
      return 0.2
    } else {
      return transTime(val * 0.1)
    }
  }
}

const enter = (time) => {
  return enterLeave(time)
}
const delay = (time) => {
  if (time <= 1) {
    return transTime(time * 0.5)
  } else if (time <= 2 && time > 1) {
    return transTime(time * 0.7)
  } else if (time > 2 && time <= 3) {
    return transTime(time * 0.7)
  } else {
    if (isNaN(time)) {
      return 1
    } else {
      return transTime(time * 0.7)
    }
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
    yPercent: 30
  }, {
    duration: enter(disTime),
    autoAlpha: 1,
    yPercent: 0,
  })
  // 将元素渐出舞台，持续时间为leave(disTime)，延迟时间为delay(disTime)
  timeline.to(el, {
    yPercent: -30,
    delay: delay(disTime),
    duration: leave(disTime),
    autoAlpha: 0,
  })
}
