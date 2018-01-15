/* 获得屏幕像素缩放比例 */
module.exports.getPixelRatio = function (context) {
  const backingStore = context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio || 1

  return (window.devicePixelRatio || 1) / backingStore
}

// 函数：绘制圆角矩形
module.exports.drawRoundedRect = function (rect, r, ctx) {
  const point = function (x, y) {
    return { x: x, y: y }
  }
  const ptA = point(rect.x + r, rect.y)
  const ptB = point(rect.x + rect.w, rect.y)
  const ptC = point(rect.x + rect.w, rect.y + rect.h)
  const ptD = point(rect.x, rect.y + rect.h)
  const ptE = point(rect.x, rect.y)

  ctx.beginPath()

  ctx.moveTo(ptA.x, ptA.y)
  ctx.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, r)
  ctx.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, r)
  ctx.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, r)
  ctx.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, r)

  // ctx.stroke();  //边框绘制 根据笔触样式(strokeStyle)
  ctx.fill()
}

// 获得点击位置
module.exports.getMousePos = function (canvas, evt, ratio) {
  const rect = canvas.getBoundingClientRect()
  return {
    x: (Math.round(evt.clientX) - rect.left) * ratio,
    y: (Math.round(evt.clientY) - rect.top) * ratio
  }
}
