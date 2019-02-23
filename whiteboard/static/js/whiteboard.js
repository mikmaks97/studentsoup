(function() {
  let socket = io()
  let canvas = document.getElementById('whiteboard')
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  let context = canvas.getContext('2d')

  const mouse = {
    x: 0,
    y: 0,

    lastX: 0,
    lastY: 0,

    drawing: false,
    color: 'black'
  }

  function onMouseDown() {
    mouse.drawing = true
  }

  function onMouseUp() {
    if (!mouse.drawing) { return; }
    mouse.drawing = false
    drawLine(mouse.lastX, mouse.lastY, mouse.x, mouse.y, mouse.color, true)
  }

  function onMouseMove() {
    if (!mouse.drawing) { return; }
    drawLine(mouse.lastX, mouse.lastY, mouse.x, mouse.y, mouse.color, true)
  }

  const mouseEvents = {
    'mousedown': onMouseDown,
    'mousemove': onMouseMove,
    'mouseup': onMouseUp,
    'mouseout': onMouseUp,
    'touchstart': onMouseDown,
    'touchmove': onMouseMove,
    'touchend': onMouseUp,
    'touchcancel': onMouseUp
  }

  function mouseEvent(event) {
    let bounds = canvas.getBoundingClientRect()
    mouse.lastX = mouse.x
    mouse.lastY = mouse.y
    mouse.x = (event.pageX || event.touches[0].pageX) - bounds.left - scrollX
    mouse.y = (event.pageY || event.touches[0].pageY) - bounds.top - scrollY

    mouse.x /=  bounds.width
    mouse.y /=  bounds.height
    mouse.x *= canvas.width
    mouse.y *= canvas.height

    mouseEvents[event.type]()
  }

  function keyEvent(event) {
    if (event.key == 'e'){
      mouse.color = 'white'
    } else if (event.key == 'd'){
      mouse.color = 'black'
    }
  }
  canvas.addEventListener('mousedown', mouseEvent)
  canvas.addEventListener('mouseup', mouseEvent)
  canvas.addEventListener('mouseout', mouseEvent)
  canvas.addEventListener('mousemove', mouseEvent)

  //Touch support for mobile devices
  canvas.addEventListener('touchstart', mouseEvent)
  canvas.addEventListener('touchend', mouseEvent)
  canvas.addEventListener('touchcancel', mouseEvent)
  canvas.addEventListener('touchmove', mouseEvent)

  document.addEventListener('keyup', keyEvent)

  socket.on('drawing', onDrawingEvent)
  
  // make the canvas fill its parent
  function onResize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', onResize, false)
  onResize()

  function drawLine(x0, y0, x1, y1, color, emit){
    context.beginPath()
    context.moveTo(x0, y0)
    context.lineTo(x1, y1)
    context.strokeStyle = color
    context.lineWidth = 2
    context.stroke()
    context.closePath()

    if (!emit) { return; }
    let w = canvas.width
    let h = canvas.height

    socket.emit('drawing', {
      x0: x0 / w,
      y0: y0 / h,
      x1: x1 / w,
      y1: y1 / h,
      color: color
    })
  }

  // limit the number of events per second
  function throttle(callback, delay) {
    let previousCall = new Date().getTime()
    return function() {
      let time = new Date().getTime()

      if ((time - previousCall) >= delay) {
        previousCall = time
        callback.apply(null, arguments)
      }
    }
  }

  function onDrawingEvent(data){
    let w = canvas.width
    let h = canvas.height
    drawLine(data.x0 * w, data.y0 * h, data.x1 * w, data.y1 * h, data.color)
  }
})()
