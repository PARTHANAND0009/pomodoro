// pomodoro timer stuff
// written by me lol prob has bugs

var currentMode = 'pomo'
var running = false
var timeLeft = 25 * 60   
var totalTime = 25 * 60
var timerInterval = null
var sessions = 0  


var modes = {
  pomo:  { time: 25 * 60, label: 'focus !!' },
  short: { time: 5  * 60, label: 'short break :)' },
  long:  { time: 15 * 60, label: 'long break :)' }
}


function switchMode(mode) {

  clearInterval(timerInterval)
  running = false
  document.getElementById('startbtn').textContent = 'start'

  currentMode = mode
  timeLeft = modes[mode].time
  totalTime = modes[mode].time
  document.getElementById('mode-txt').textContent = modes[mode].label


  document.querySelectorAll('.tab').forEach(function(t) {
    t.classList.remove('active')
  })

  document.querySelectorAll('.tab').forEach(function(t) {
    if (
      (mode === 'pomo'  && t.textContent === 'pomodoro') ||
      (mode === 'short' && t.textContent === 'short break') ||
      (mode === 'long'  && t.textContent === 'long break')
    ) {
      t.classList.add('active')
    }
  })

  updateTimerDisplay()
}


function startStop() {
  if (running) {

    clearInterval(timerInterval)
    running = false
    document.getElementById('startbtn').textContent = 'resume'
  } else {
    running = true
    document.getElementById('startbtn').textContent = 'pause'

    timerInterval = setInterval(function() {
      timeLeft--
      updateTimerDisplay()

      if (timeLeft <= 0) {
        clearInterval(timerInterval)
        running = false
        document.getElementById('startbtn').textContent = 'start'







        if (currentMode === 'pomo') {
          sessions++
          if (sessions > 4) sessions = 0  

          updateDots()

          if (sessions === 4) {
            toast('done 4 rounds!! take a long break fr')
            sessions = 0
            updateDots()
          } else {
            toast('session done! take a break')
          }
        }
      }
    }, 1000)
  }
}


function resetTimer() {
  clearInterval(timerInterval)
  running = false
  timeLeft = totalTime
  document.getElementById('startbtn').textContent = 'start'
  updateTimerDisplay()
}



function updateTimerDisplay() {
  var mins = Math.floor(timeLeft / 60)
  var secs = timeLeft % 60
  var display = pad(mins) + ':' + pad(secs)
  document.getElementById('timer').textContent = display
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}


function updateDots() {
  for (var i = 1; i <= 4; i++) {
    var dot = document.getElementById('dot' + i)
    if (i <= sessions) {
      dot.classList.add('on')
    } else {
      dot.classList.remove('on')
    }
  }
}


function addTask() {
  var input = document.getElementById('task-input')
  var text = input.value.trim()
  if (!text) return  

  var li = document.createElement('li')
  li.className = 'task-item'


  var cb = document.createElement('input')
  cb.type = 'checkbox'
  cb.addEventListener('change', function() {
    if (cb.checked) {
      li.classList.add('done')
    } else {
      li.classList.remove('done')
    }
  })

  var label = document.createElement('span')
  label.textContent = text


  var del = document.createElement('button')
  del.textContent = '×'
  del.className = 'del-btn'
  del.onclick = function() {
    li.remove()
  }

  li.appendChild(cb)
  li.appendChild(label)
  li.appendChild(del)
  document.getElementById('task-list').appendChild(li)

  input.value = ''

}


document.getElementById('task-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') addTask()
})



function loadVideo() {
  var url = document.getElementById('yt-input').value.trim()
  var id = getVideoId(url)

  if (!id) {
    toast('couldnt find a valid yt link ://')
    return
  }

  var frame = document.getElementById('yt-frame')
  frame.src = 'https://www.youtube.com/embed/' + id + '?rel=0'
  frame.style.display = 'block'
  document.getElementById('no-vid-msg').style.display = 'none'
}

function clearVideo() {
  var frame = document.getElementById('yt-frame')
  frame.src = ''
  frame.style.display = 'none'
  document.getElementById('no-vid-msg').style.display = 'block'
  document.getElementById('yt-input').value = ''
}

function getVideoId(url) {
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url

  try {
    var u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1)  
    }
    return u.searchParams.get('v')  
  } catch(e) {
    return null  
  }
}


document.getElementById('yt-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') loadVideo()
})



var notesBox = document.getElementById('notes-box')


notesBox.value = localStorage.getItem('pomo-notes') || ''

notesBox.addEventListener('input', function() {
  localStorage.setItem('pomo-notes', notesBox.value)
})


var toastEl = document.createElement('div')
toastEl.id = 'toast'
document.body.appendChild(toastEl)

var toastTimer = null

function toast(msg) {
  toastEl.textContent = msg
  toastEl.classList.add('show')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(function() {
    toastEl.classList.remove('show')
  }, 3000)
}