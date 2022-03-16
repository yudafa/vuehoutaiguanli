/* eslint-disable no-redeclare */
// export function  throttle(fn, interval) {// 节流
//   let last = 0
//   return function () {
//     let content = this // 这是啥
//     let args = arguments // 这是啥
//     let now = +new Date()
//     if (now - last > interval) {
//       last = now
//       fn.apply(content, args)
//     }
//   }
// }
export function throttle(fn, delay) {
  var lastTime
  var timer
  var delay = delay || 200
  return function () {
    var args = arguments
    // 记录当前函数触发的时间
    var nowTime = Date.now()
    if (lastTime && nowTime - lastTime < delay) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        // 记录上一次函数触发的时间
        lastTime = nowTime
        // 修正this指向问题
        fn.apply(this, args)
      }, delay)
    } else {
      lastTime = nowTime
      fn.apply(this, args)
    }
  }
}
