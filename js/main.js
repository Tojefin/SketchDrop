const canvas = document.querySelector('.canvas');
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

let curX = 0;
let curY = 0;
let pointX = 0;
let pointY = 0;
let pressed = false;
let history = [];

const colorPicker = document.querySelector('.toolbar__colorpick');

const sizePicker = document.querySelector('.toolbar__sizepick');

const clearBtn = document.querySelector('#clear');
const copyBtn = document.querySelector('#copy');

clearBtn.addEventListener('click', () => {
  clear()
  notifySend('Cleared', 'notify--success', 3000, true)
});

clear();

function clear() {
  ctx.fillStyle = 'rgb(256,256,256)';
  ctx.fillRect(0,0,width,height);
}

copyBtn.addEventListener('click', () => {
  copy()
})

function copy() {
  canvas.toBlob(function(blob) {
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]);
  });
  notifySend('Success copy', 'notify--success', 3000, true)
}

document.addEventListener('mousemove', e => {
  curX = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
  curY = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
});

document.addEventListener('keydown', () => {
  if (event.ctrlKey && event.key === 'z') {
    let image = new Image();
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    };
    let url = history.pop() ?? null
    image.src = url
  }
})

canvas.addEventListener('mousedown', () => {
  pressed = true
  history.push(canvas.toDataURL())
  if (history.length >= 100) {
    history.shift()
  }
});

canvas.addEventListener('mouseup', () => {
  pressed = false
});

function degToRad(degrees) {
  return degrees * Math.PI / 180;
};

function draw() {
  if (!pressed) {
    pointX = curX
    pointY = curY
  }
  if(pressed) {
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineCap = 'round';
    ctx.lineWidth = sizePicker.value
    ctx.lineTo(curX , curY);
    ctx.strokeStyle = colorPicker.value;
    ctx.stroke();
    pointX = curX
    pointY = curY
  }
  requestAnimationFrame(draw);
}
draw();
//https://github.com/Tojefin/JS-tools

function notifySend(content, className, duration, closeOnClick) {
  let container = document.querySelector('body')
  let element = document.createElement('div');
  element.classList = className+' '+className+'--in'
  element.innerHTML = content
  if (closeOnClick) {
    element.addEventListener('click', () => {
      element.classList = className+' '+className+'--out'
      setTimeout(() => {container.removeChild(element)}, 100);
    })
  }
  container.append(element)
  setTimeout(() => {element.classList.remove(className+'--in')}, 100);
  setTimeout(() => {element.classList = className+' '+className+'--out'}, duration-100 ?? 2900);
  setTimeout(() => {container.removeChild(element)}, duration ?? 3000);
}