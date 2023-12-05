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
export function gsapTimeline (timeline, el, disTime) {
  timeline.to(el, {
    duration: enter(disTime),
    autoAlpha: 1,
  })
  timeline.to(el, {
    delay: delay(disTime),
    duration: leave(disTime),
    autoAlpha: 0,
  })
}
