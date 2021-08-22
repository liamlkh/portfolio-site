export function* changeDarkMode() {
  document.body.classList.add("is-mode-changing")
}

export function* darkModeTransitionFinish() {
  document.body.classList.remove("is-mode-changing")

  if (document.body.classList.contains("is-light")) {
    document.body.classList.remove("is-light")
    document.body.classList.add("is-dark")
  }
  else {
    document.body.classList.remove("is-dark")
    document.body.classList.add("is-light")
  }
} 
