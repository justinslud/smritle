const targetWords = [
    "mollie",
    "callie",
    "buddy",
    "grenada",
    "smriti",
    "justin",
    "vegan",
    "netflix",
    "mezeh",
    "sushi",
    "wwoof",
    "goggins",
    "wootton",
    "banana",
    "avocado",
    "amazon",
    "miami",
    "beard",
    "psych",
    "squat",
    "tennis",
    "belford",
    "angel",
    "honey",
    "biscuit",
    "target",
    "bonsai",
    "greys",
    "selfie",
    "cuddle",
    "yoyogi",
    "",

    // shorter words

    "fern",
    "bear",
    "guh",
    "bike",
    "safe",

    // longer words
    "bachelor",
    "goodnight",
    "twinsies",
    "sunshine",
    "mainfest",
    "spikeball",
    "lululemon",
    "terpthon",
    "glenstone",
    "maryland",
    "charlotte",
    "snapchat",
    "smoothie",
    "sociology"
]
const dictionary = [
    "aahed",
    "aalii",
    "aargh",
    "aarti",
    "abaca",
    "abaci"
]

const FLIP_ANIMATION_DURATION = 500
const DANCE_ANIMATION_DURATION = 500
const keyboard = document.querySelector("[data-keyboard]")
const alertContainer = document.querySelector("[data-alert-container]")
const guessGrid = document.querySelector("[data-guess-grid]")
const offsetFromDate = new Date(2022, 0, 1)
const msOffset = Date.now() - offsetFromDate
const dayOffset = msOffset / 1000 / 60 / 60 / 24
// const targetWord = targetWords[3+Math.floor(dayOffset) % targetWords.length]
const targetWord = "abaci"
const WORD_LENGTH = targetWord.length
// const guessGrid = document.createElement('div')
// guessGrid.style.setProperty("--column", WORD_LENGTH)


// for (let i=0; i<WORD_LENGTH*6-30; i++) {
//   guessGrid.innerHTML += '<div class="tile"></div>'
// }

// guessGrid.setAttribute("data-guess-grid", "")
// guessGrid.classList.add("guess-grid")
// document.body.append(guessGrid)


startInteraction()

/* displayStats() */

// function displayStats() {
  // localStorage.getItem("streak"),
  // localStorage.getItem("maxStreak"),
  // localStorage.getItem("score"),
  // localStorage.getItem("topScore"),
// }

function startInteraction() {
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick)
  document.removeEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key)
    return
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess()
    return
  }

  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey()
    return
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key)
    return
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles()
  if (activeTiles.length >= WORD_LENGTH) return
  const nextTile = guessGrid.querySelector(":not([data-letter])")
  nextTile.dataset.letter = key.toLowerCase()
  nextTile.textContent = key
  nextTile.dataset.state = "active"
}

function deleteKey() {
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()]
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters")
    shakeTiles(activeTiles)
    return
  }

  const guess = activeTiles.reduce((word, tile) => {
    return word + tile.dataset.letter
  }, "")

  if (!dictionary.includes(guess)) {
    showAlert("Not in word list")
    shakeTiles(activeTiles)
    return
  }

  stopInteraction()
  activeTiles.forEach((...params) => flipTile(...params, guess))
}

function flipTile(tile, index, array, guess) {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    "transitionend",
    () => {
      // tile.classList.remove("flip")
      // if (targetWord[index] === letter) {
      //   tile.dataset.state = "correct"
      //   key.classList.add("correct")
      // } else if (targetWord.includes(letter)) {
      //   tile.dataset.state = "wrong-location"
      //   key.classList.add("wrong-location")
      // } else {
      //   tile.dataset.state = "wrong"
      //   key.classList.add("wrong")
      // }
    
      tile.classList.remove("flip")
      if (targetWord[index] === letter) {
        tile.dataset.state = "correct"
        tile.innerHTML += '&#128076;'
        key.classList.add("correct")
      } else if (targetWord[index] < letter) {
        tile.dataset.state = "earlier"
        tile.innerHTML += '&#9757;&#65039;'
        key.classList.add("earlier")
      } else {
        tile.dataset.state = "later"
        tile.innerHTML += '&#128071;'
        key.classList.add("later")
      }        
  
      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction()
            checkWinLose(guess, array)
          },
          { once: true }
        )
      }
    },
    { once: true }
  )
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]')
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div")
  alert.textContent = message
  alert.classList.add("alert")
  alertContainer.prepend(alert)
  if (duration == null) return

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () => {
      alert.remove()
    })
  }, duration)
}

function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake")
      },
      { once: true }
    )
  })
}

function checkWinLose(guess, tiles) {
  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")

  if (guess === targetWord) {
    showAlert("You Win", 5000)
    danceTiles(tiles)
    /* todo: show scores */
    localStorage.setItem("score", 6 - (remainingTiles.length / WORD_LENGTH))
    localStorage.setItem("streak", localStorage.getItem("streak") || 0 + 1)
    // localStorage.setItem("maxStreak", ) update max if more
    // localStorage.setItem("topScore", ) update if less
    stopInteraction()
    return
  }

  // const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    localStorage.setItem("streak", 0)
    localStorage.setItem("score", "-")
    showAlert(targetWord.toUpperCase(), null)
    stopInteraction()
  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance")
        },
        { once: true }
      )
    }, (index * DANCE_ANIMATION_DURATION) / 5)
  })
}

// from https://github.com/ozboware/wordled/blob/main/assets/js/game.js

/* popup */

const popupLink = document.querySelector(".trigger_popup_fricc")
const popupContent = document.querySelector(".hover_bkgr_fricc")
const popupClose = document.querySelector(".popupCloseButton")

popupLink.addEventListener(
  "click",
  () => {
    popupContent.style.display = "block"
  }
)

popupContent.addEventListener(
  "click",
  () => {
    popupContent.style.display = "none"
  }
)

popupClose.addEventListener(
  "click",
  () => {
    popupContent.style.display = "none"
  }
)