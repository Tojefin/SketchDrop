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
