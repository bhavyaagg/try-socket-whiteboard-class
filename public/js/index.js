/**
 * Created by bhavyaagg on 01/04/18.
 */

$(document).ready(() => {
  const socket = io();
  socket.on('drawNew', drawNew);
  
  const canvas = document.getElementById('whiteboard');
  const context = canvas.getContext('2d');
  let drawing = false;
  let current = {};
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  function drawLine(x1, y1, x2, y2, emit = false) {
    
    context.beginPath();
    context.lineWidth = 2;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
    
    if (!emit) {
      return;
    }
    let emitToServer = {
      x1, y1, x2, y2
    }
    
    socket.emit('draw', emitToServer);
    
  }
  
  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('mouseout', onMouseUp);
  canvas.addEventListener('mousemove', onMouseMove);
  
  function onMouseDown(e) {
    drawing = true;
    current.x = e.clientX;
    current.y = e.clientY;
  }
  
  function onMouseUp(e) {
    if (!drawing) {
      return;
    }
    drawLine(current.x, current.y, e.clientX, e.clientY, true);
    drawing = false;
  }
  
  function onMouseMove(e) {
    if (!drawing) {
      return;
    }
    drawLine(current.x, current.y, e.clientX, e.clientY, true);
    current.x = e.clientX;
    current.y = e.clientY;
  }
  
  function drawNew(data) {
    drawLine(data.x1, data.y1, data.x2, data.y2);
  }
  
})