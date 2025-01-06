const autocompleteInput = document.getElementById("autocomplete")
const autocompleteList = document.getElementById("autocomplete-list")
const repoList = document.getElementById("repo-list")
let timeout

function debounce(func, delay) {
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), delay)
  }
}

async function fetchRepos(query) {
  if (!query) {
    autocompleteList.style.display = "none"
    return
  }
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
    query
  )}&per_page=5`
  try {
    const response = await fetch(url)
    const data = await response.json()
    displayAutocomplete(data.items || [])
  } catch (error) {
    console.error("Error", error)
  }
}

function displayAutocomplete(repos) {
  autocompleteList.innerHTML = ""
  if (repos.length === 0) {
    autocompleteList.style.display = "none"
    return
  }
  repos.forEach((repo) => {
    const item = document.createElement("div")
    item.className = "autocomplete-item"
    item.textContent = repo.name
    item.addEventListener("click", () => addRepo(repo))
    autocompleteList.appendChild(item)
  })
  autocompleteList.style.display = "block"
}

function addRepo(repo) {
  const item = document.createElement("div")
  item.className = "repo-item"
  item.innerHTML = `
    <div class="repo-info">
      <div>Name: ${repo.name}</div>
      <div>Owner: ${repo.owner.login}</div>
      <div>Stars: ${repo.stargazers_count}</div>
    </div>
    <img src="./src/img/cross.svg" alt="Remove repo" class="remove-icon">
  `
  item
    .querySelector(".remove-icon")
    .addEventListener("click", () => item.remove())
  repoList.appendChild(item)
  autocompleteInput.value = ""
  autocompleteList.style.display = "none"
}

autocompleteInput.addEventListener(
  "input",
  debounce(() => {
    fetchRepos(autocompleteInput.value.trim())
  }, 300)
)

document.addEventListener("click", (e) => {
  if (!document.querySelector(".main__container").contains(e.target)) {
    autocompleteList.style.display = "none"
  }
})
