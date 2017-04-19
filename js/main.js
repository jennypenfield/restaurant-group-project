var containerNode = document.querySelector('.tables')

containerNode.addEventListener('click', function (inputEvent) {
  if (inputEvent.target.className !== 'box') return
  var currentBackground = inputEvent.target.style.background
  inputEvent.target.style.background = currentBackground === 'tomato' ? '#e6ffff' : 'tomato'
  if (currentBackground === 'tomato') {
    inputEvent.target.style.background = '#e6ffff'
  } else {
    inputEvent.target.style.background = 'tomato'
  }
  if (inputEvent.target.style.background === 'tomato') {
    inputEvent.target.style.boxShadow = '2px 2px 2px teal'
  } else {
    inputEvent.target.style.boxShadow = ''
  }
})

document.querySelector('#submit').style.cursor = 'pointer'
