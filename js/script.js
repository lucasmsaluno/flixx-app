const popularMovies = document.querySelector("#popular-movies")
const popularShows = document.querySelector("#popular-shows")
const movieDetails = document.querySelector("#movie-details")
const showDetails = document.querySelector("#show-details")
const sliderArea = document.querySelector(".swiper-wrapper")
const searchTerm = document.querySelector("#search-term")
const searchResults = document.querySelector("#search-results")
const pagination = document.querySelector("#pagination")
const alert = document.querySelector("#alert")
const spinner = document.querySelector(".spinner")

const global = {
    currentPage: window.location.pathname,
    search: {
        term: "",
        type: "",
        page: 1,
        totalPages: 1
    },
    api: {
        apiKey: "78debe25ee355882c6be849b9b39a19b",
        apiUrl: "https://api.themoviedb.org/3/"
    }
}

const formatDateToMDY = (dateString) => {
    const date = new Date(dateString)

    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()

    return `${month}/${day}/${year}`
}

const toggleSpinner = () => {
    spinner.classList.toggle("show")
}

const fetchApiData = async (endpoint) => {
    toggleSpinner()
    const response = await fetch(`${global.api.apiUrl}${endpoint}?api_key=${global.api.apiKey}&language=en-US`)
    const data = await response.json()

    toggleSpinner()
    return data
}

const searchApiData = async () => {
    toggleSpinner()
    const response = await fetch(`${global.api.apiUrl}search/${global.search.type}?api_key=${global.api.apiKey}&language=en-US&query=${encodeURIComponent(global.search.term)}&page=${global.search.page}`)
    const data = await response.json()

    toggleSpinner()
    return data
}

const initSwiper = () => {
    const swiper = new Swiper(".swiper", {
        slidesPerView: 4,
        spaceBetween: 30,
        freeMode: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        breakpoints: {
            300: {
               slidesPerView: 1
            },
            500: {
                slidesPerView: 2
            },
            700: {
                slidesPerView: 3
            },
            1200: {
                slidesPerView: 4
            },
        }
    })
}

const displaySlider = async () => {
    const { results } = await fetchApiData("movie/now_playing")

    results.forEach((movie) => {
        const div = document.createElement("div")
        div.classList.add("swiper-slide")

        div.innerHTML = `
            <a href="movie-details.html?id=${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
                <i class="fas fa-star text-secondary"></i> 
                ${movie.vote_average.toFixed(1)} / 10
            </h4>
        `
        sliderArea.appendChild(div)
        initSwiper()
    })
}

const displayPopularMovies = async () => {
    const { results } = await fetchApiData("movie/popular")

    results.forEach(movie => {
        const div = document.createElement("div")
        div.classList.add("card")
        div.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            ${movie.poster_path
                ? `<img
                        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                        class="card-img-top"
                        alt="${movie.title}"
                        />`
                : `<img
                        src="../images/no-image.jpg"
                        class="card-img-top"
                        alt="${movie.title}"
                        />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${formatDateToMDY(movie.release_date)}</small>
            </p>
          </div>
        `
        popularMovies.appendChild(div)
    })
}

const displayPopularShows = async () => {
    const { results } = await fetchApiData("tv/popular")

    results.forEach(show => {
        const div = document.createElement("div")
        div.classList.add("card")
        div.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            ${show.poster_path
                ? `<img
                        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                        class="card-img-top"
                        alt="${show.name}"
                        />`
                : `<img
                        src="../images/no-image.jpg"
                        class="card-img-top"
                        alt="${show.name}"
                        />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Air Date: ${formatDateToMDY(show.first_air_date)}</small>
            </p>
          </div>
        `
        popularShows.appendChild(div)
    })
}

const displayBackgroundImage = (type, backgroundPath) => {
    const overlayDiv = document.createElement("div")
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`
    overlayDiv.style.backgroundSize = "cover"
    overlayDiv.style.backgroundPosition = "center"
    overlayDiv.style.backgroundRepeat = "no-repeat"
    overlayDiv.style.width = "100vw"
    overlayDiv.style.height = "100vh"
    overlayDiv.style.position = "absolute"
    overlayDiv.style.inset = "0 0 0 0"
    overlayDiv.style.zIndex = "-1"
    overlayDiv.style.opacity = "0.1"

    type == "movie" 
        ? movieDetails.appendChild(overlayDiv)
        : showDetails.appendChild(overlayDiv)
}

const displayMovieDetails = async () => {
    const movieId = window.location.search.split("=")[1]
    const movie = await fetchApiData(`movie/${movieId}`)

    displayBackgroundImage("movie", movie.backdrop_path)

    const div = document.createElement("div")

    div.innerHTML = `
        <div class="details-top">
          <div>
            ${movie.poster_path
                ? `<img
                        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                        class="card-img-top"
                        alt="${movie.title}"
                        />`
                : `<img
                        src="../images/no-image.jpg"
                        class="card-img-top"
                        alt="${movie.title}"
                        />`
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${formatDateToMDY(movie.release_date)}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${movie.budget}</li>
            <li><span class="text-secondary">Revenue:</span> $${movie.revenue}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
            ${movie.production_companies.map((genre) => `<span>${genre.name}</span>`).join(" | ")}
          </div>
        </div>
    `

    movieDetails.appendChild(div)
}

const displayShowDetails = async () => {
  const showId = window.location.search.split("=")[1];
  const show = await fetchApiData(`tv/${showId}`);

  displayBackgroundImage("tv", show.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `
    <div class="details-top">
      <div>
        ${show.poster_path
          ? `<img
                  src="https://image.tmdb.org/t/p/w500${show.poster_path}"
                  class="card-img-top"
                  alt="${show.name}"
                  />`
          : `<img
                  src="../images/no-image.jpg"
                  class="card-img-top"
                  alt="${show.name}"
                  />`
        }
      </div>
      <div>
        <h2>${show.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${show.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">First Air Date: ${formatDateToMDY(show.first_air_date)}</p>
        <p>
          ${show.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
        </ul>
        ${show.homepage
          ? `<a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>`
          : ""
        }
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number of Seasons:</span> ${show.number_of_seasons}</li>
        <li><span class="text-secondary">Number of Episodes:</span> ${show.number_of_episodes}</li>
        <li><span class="text-secondary">Status:</span> ${show.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
        ${show.production_companies.map((company) => `<span>${company.name}</span>`).join(" | ")}
      </div>
    </div>
  `;

  showDetails.appendChild(div);
};

const showAlert = (message, className = "error") => {
    const alertEl = document.createElement("div")
    alertEl.classList.add("alert", className)
    alertEl.appendChild(document.createTextNode(message))
    alert.appendChild(alertEl)

    setTimeout(() => {
        alertEl.remove()
    }, 3000)
}

const displayPagination = () => {
    const div = document.createElement("div")
    div.classList.add("pagination")
    div.innerHTML = `
        <button class="btn btn-primary" id="prev">Prev</button>
        <button class="btn btn-primary" id="next">Next</button>
        <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
    `
    pagination.appendChild(div)

    if (global.search.page === 1) {
        document.querySelector("#prev").disable = true
    }

    if (global.search.page === global.search.totalPages) {
        document.querySelector("#next").disable = true
    }

    document.querySelector("#next").addEventListener('click', async () => {
        global.search.page++
        const { results, total_pages } = await searchApiData()
        displaySearchResults(results)
    })

    document.querySelector("#prev").addEventListener('click', async () => {
        global.search.page--
        const { results, total_pages } = await searchApiData()
        displaySearchResults(results)
    })
}

const displaySearchResults = (results) => {
    searchResults.innerHTML = ""
    document.querySelector("#search-results-heading").innerHTML = ""
    document.querySelector("#pagination").innerHTML = ""

    results.forEach(result => {
        const div = document.createElement("div")
        div.classList.add("card")
        div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
            ${result.poster_path
                ? `<img
                        src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
                        class="card-img-top"
                        alt="${global.search.type === "movie" ? result.title : result.name}"
                        />`
                : `<img
                        src="../images/no-image.jpg"
                        class="card-img-top"
                        alt="${global.search.type === "movie" ? result.title : result.name}"
                        />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${global.search.type === "movie" ? result.title : result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${formatDateToMDY(global.search.type === "movie" ? result.release_date : result.first_air_date)}</small>
            </p>
          </div>
        `
        searchResults.appendChild(div)
    })

    displayPagination()
}

const search = async () => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)

    global.search.type = urlParams.get("type")
    global.search.term = urlParams.get("search-term")

    if (global.search.term === "" && global.search.term === null) {
        showAlert("Please enter a search term !")
        return
    }

    const { results, total_pages, page, total_results } = await searchApiData()
    
    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if (results.length === 0) {
        showAlert("No results founded", "success")
        return
    }

    displaySearchResults(results)
    searchTerm.value = ""
    console.log(global.search.totalPages)
}

const highlightActiveLink = () => {
    const links = document.querySelectorAll(".nav-link")

    links.forEach(link => {
        if (link.getAttribute("href") === global.currentPage) {
            link.classList.add("active")
        }
    })
}

const router = () => {
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            displaySlider()
            displayPopularMovies()
            break

        case "/shows.html":
            console.log("shows")
            displayPopularShows()
            break

        case "/movie-details.html":
            displayMovieDetails()
            break

        case "/tv-details.html":
            displayShowDetails()
            break

        case "/search.html":
            search()
            break
    }
}

const init = () => {
    router()
    highlightActiveLink()
}

init()