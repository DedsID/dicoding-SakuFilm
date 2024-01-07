const main = () => {
  const APIUrl = "https://api.themoviedb.org/3/";
  const API_KEY = "060a0b6455a06b6a63e7b1808fbea17d";
  const imgURL = "https://image.tmdb.org/t/p/original/";

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjBhMGI2NDU1YTA2YjZhNjNlN2IxODA4ZmJlYTE3ZCIsInN1YiI6IjY1ODY3MjdlMjJlNDgwN2YwZWMwZTczNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tFM2DGOZTlrkmo6jaw_dBRUpCMLNljCjiUHR2ntNvWw",
    },
  };

  const showCards = (m) => {
    return ` <div class='cat_cards_card'>
                  <div class='img-container'>
                      <img src='${imgURL + m.poster_path}' alt='${m.title}' />
                  </div>
                  <span>${m.title} <br/>(${m.release_date.substring(
      0,
      4
    )})</span>
                  <button data-id='${
                    m.id
                  }' class='detail_button'>Detail</button>
               </div> `;
  };

  window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    const scrollPosition = window.scrollY;

    if (scrollPosition > 30) {
      header.classList.add(
        "fixed"
      ); /* Menambahkan class 'fixed' saat scroll melebihi 30px */
    } else {
      header.classList.remove(
        "fixed"
      ); /* Menghapus class 'fixed' jika posisi scroll kembali ke atas */
    }
  });

  // GET POPULAR

  fetch(`${APIUrl}movie/popular?language=en-US&page=1`, options)
    .then((response) => response.json())
    .then((response) => {
      // console.log(response.results);
      let cards = "";
      const movies = response.results.slice(0, 10);
      movies.forEach((m) => {
        cards += showCards(m);
      });

      const catCards = document.querySelector(".cat_cards");
      if (catCards) {
        catCards.innerHTML = cards;
      }
    })

    .catch((err) => console.error(err));

  // GET MOVIE CATEGORY LIST

  const showMovieList = (ml) => {
    return `<div class='cat_m_lists' data-listID='${ml.id}'>${ml.name}</div>`;
  };

  fetch(`${APIUrl}genre/movie/list?language=en`, options)
    .then((response) => response.json())
    .then((response) => {
      let cards = "";
      const movieList = response.genres;
      movieList.forEach((ml) => {
        cards += showMovieList(ml);
      });

      const catMList = document.querySelector(".cat_m_list");
      if (catMList) {
        catMList.innerHTML = cards;
      }
    })
    .catch((err) => console.error(err));

  // SEARCH MOVIE

  const keyword = document.querySelector(".search_input");
  const buttonSearch = document.querySelector(".search_button");

  const performSearch = () => {
    if (keyword.value.length !== 0) {
      fetch(
        `${APIUrl}search/movie?query=${keyword.value}&include_adult=false&language=en-US&page=1`,
        options
      )
        .then((response) => response.json())
        .then((response) => {
          let cards = "";
          const search = response.results;

          if (search.length !== 0) {
            search.forEach((m) => {
              cards += showCards(m);
            });

            const searchTab = ` <div class='grup_cat'>
                                    <div class='cat_title'>Displaying ${search.length} movies related to the search for '${keyword.value}'</div>
                                    <div class='search_card'>
                                      ${cards}
                                    </div>
                                  </div>
                                `;

            const searchList = document.querySelector(".search_tab");
            searchList.innerHTML = searchTab;
            searchList.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            const searchTab = ` <div class='grup_cat'>
                                    <div class='cat_title'>No movies found</div>
                                    <div class='cat_cards'>
                                      No movies found related to the search for '${keyword.value}'.
                                    </div>
                                  </div>
                              `;

            const searchList = document.querySelector(".search_tab");
            searchList.innerHTML = searchTab;
            searchList.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        })

        .catch((err) => console.error(err));
    } else {
      console.log("Input is empty. Please enter a keyword to search.");
    }
  };

  if (buttonSearch) {
    buttonSearch.addEventListener("click", function (m) {
      performSearch();
    });
  }

  if (document.location.pathname === "/") {
    keyword.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        performSearch();
      }
    });

    const search = document.querySelector(".search");

    let lastScrollTop = 0;
    let isScrollingUp = false;

    window.addEventListener(
      "scroll",
      function () {
        let currentScroll =
          window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop) {
          // Scroll ke bawah
          search.classList.add("visible");
          isScrollingUp = false;
        } else {
          // Scroll ke atas
          isScrollingUp = true;
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

        // Jika sedang scrolling ke atas dan sudah di atas halaman, sembunyikan elemen pencarian
        if (isScrollingUp && currentScroll === 0) {
          search.classList.remove("visible");
        }
      },
      false
    );
  }

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("detail_button")) {
      const movieID = e.target.dataset.id;
      const movieTitle = e.target.parentElement.textContent
        .trim()
        .split("\n")[0];

      const detailPageURL = `detail.html?id=${movieID}&title=${encodeURIComponent(
        movieTitle
      )}`;
      window.location.href = detailPageURL;
    } else if (
      // GET MOVIE BY LIST

      e.target.classList.contains("cat_m_lists")
    ) {
      const listID = e.target.dataset.listid;
      const listName = e.target.innerText;
      fetch(`${APIUrl}discover/movie?api_key=${API_KEY}&with_genres=${listID}`)
        .then((response) => response.json())
        .then((response) => {
          let cards = "";
          const search = response.results;

          search.forEach((m) => {
            cards += showCards(m);
          });

          const searchTab = ` <div class='grup_cat'>
                                    <div class='cat_title'>Displaying ${search.length} movies related to the '${listName}' category</div>
                                    <div class='search_card'>
                                      ${cards}
                                    </div>
                                  </div>
                                `;

          const searchList = document.querySelector(".movie_by_list");
          searchList.innerHTML = searchTab;
          searchList.scrollIntoView({ behavior: "smooth", block: "start" });
        })
        .catch((err) => console.error(err));
    }
  });

  // ONLY IN DETAIL PAGE

  if (document.location.pathname === "/detail.html") {
    const params = new URLSearchParams(window.location.search);
    const movieID = params.get("id");

    fetch(
      `${APIUrl}movie/${movieID}?api_key=${API_KEY}&append_to_response=similar`
    )
      .then((response) => response.json())
      .then((movie) => {
        const m = movie;

        // merubah genres kedalam string
        const genres = m.genres;
        const genre = genres.map((g) => g.name);
        const combinedGenres = genre.join(", ");

        // merubah duration kedalam string
        const totalMinutes = m.runtime;

        const hours = Math.floor(totalMinutes / 60); // Mendapatkan jam
        const minutes = totalMinutes % 60; // Mendapatkan sisa menit setelah jam dihitung

        // Mengonversi ke string dengan format yang diinginkan
        const runtime = `${hours.toString()} h ${minutes.toString()} m`;

        const movieDetail = `
                              <div class='detail_container_head'>
                                <div class='detail_image'>
                                  <img src='${imgURL + m.poster_path}' alt='' />
                                </div>
                                <div class='detail_movie'>
                                  <div class='detail_movie_title judul'>
                                    ${m.original_title}
                                    <div class='props'>
                                      <span class='year'>${m.release_date.substring(
                                        0,
                                        4
                                      )}</span> 
                                      ●
                                      <span class='lang'>${m.original_language.toUpperCase()}</span> 
                                      ●
                                      <span class='vote'>${m.vote_average.toFixed(
                                        1
                                      )}%</span>
                                      ●
                                      <span class='genres'>${combinedGenres}</span> 
                                    </div>
                                    <div class='duration'>
                                      ${runtime}
                                    </div>
                                  </div>
                                  <div class='overview'>
                                    ${m.overview}
                                  </div>
                                </div>
                              </div>`;

        const detailPage = document.querySelector(".detail_page");
        detailPage.innerHTML = movieDetail;

        // merubah gambar banner
        const banner = document.querySelector(".banner_movie");
        banner.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgb(43, 42, 76, 1)), url('${
          imgURL + m.backdrop_path
        }')`;

        let simi = "";
        const movies = m.similar.results.slice(0, 10);
        movies.forEach((m) => {
          simi += showCards(m);
        });

        const similar = document.querySelector(".cat_similar");
        similar.innerHTML = simi;
      })
      .catch((err) => console.error(err));

    fetch(`${APIUrl}movie/${movieID}/credits?language=en-US`, options)
      .then((response) => response.json())
      .then((response) => {
        const cast = response.cast;
        const castCard = (m) => {
          return `  <div class='cat_cards_cast'>
                      <div class='cast_pp'>
                        <img src='${imgURL + m.profile_path}' alt='${m.name}' />
                      </div>
                      <div class='cast_text'>
                        <div class='nameartist'>${m.name}</div>
                        <div class='alias'>${m.character}</div>
                      </div>
                    </div>`;
        };
        let cards = "";
        cast.forEach((m) => {
          cards += castCard(m);
        });

        const catCards = document.querySelector(".cat_casts");
        catCards.innerHTML = cards;
      })
      .catch((err) => console.error(err));
  }
};

export default main;
