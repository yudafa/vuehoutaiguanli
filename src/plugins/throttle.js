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
// export function throttle(fn, delay) {
//   var lastTime
//   var timer
//   return function () {
//     var args = arguments
//     // 记录当前函数触发的时间
//     var nowTime = Date.now()
//     if (nowTime - lastTime < delay) {
//       clearTimeout(timer)
//       timer = setTimeout(function () {
//         // 记录上一次函数触发的时间
//         lastTime = nowTime
//         // 修正this指向问题
//         fn.apply(this, args)
//       }, delay)
//     } else {
//       lastTime = nowTime
//       // fn.apply(this, args)
//       fn.apply(this, args)
//     }
//   }
// }
// 节流:控制执行次数
// export function throttle(fn, delay) {
//   let click = true
//   return function () {
//     if (click) {
//       setTimeout(() => {
//         fn.call(this)
//         click = true
//       }, delay)
//     }
//     click = false
//   }
// }
// 防抖:只执行最后一次
export function debounce(fn, delay) {
  let t = null
  return function () {
    //点击后立即触发，但在delay时间内触发多少次都没用，直到delay时间结束，才可以触发下一次点击
    // let click = fn.call(this)
    if (t !== null) {
      clearTimeout(t)
    }
    t = setTimeout(() => {
      fn.call(this)
    }, delay)
  }
}
