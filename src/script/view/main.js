const main = () => {
  const APIUrl = 'https://api.themoviedb.org/3/';
  const API_KEY = '060a0b6455a06b6a63e7b1808fbea17d';
  const imgURL = 'https://image.tmdb.org/t/p/original/';

  const menu = document.querySelector('#hamburger-menu');
  const body = document.querySelector('body');
  const navbar = document.querySelector('.navbar');
  const header = document.querySelector('.header');

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNjBhMGI2NDU1YTA2YjZhNjNlN2IxODA4ZmJlYTE3ZCIsInN1YiI6IjY1ODY3MjdlMjJlNDgwN2YwZWMwZTczNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.tFM2DGOZTlrkmo6jaw_dBRUpCMLNljCjiUHR2ntNvWw',
    },
  };

  const showCards = (m) => {
    const releaseYear = m.release_date.substring(0, 4);
    return `  <div class='cat_cards_card' data-id='${m.id}' data-loc='m'>
                <div class='img-container'>
                    <img src='${imgURL + m.poster_path}' alt='${m.title}' />
                </div>
                <span>${m.title} 
                  <br/>(${releaseYear})
                </span>
                <button class='detail_button'>
                Detail
                </button>
              </div> `;
  };

  const showTVCards = (m) => {
    const releaseYear = m.first_air_date.substring(0, 4);
    return `  <div class='cat_cards_card' data-id='${m.id}' data-loc='tv'>
                <div class='img-container'>
                    <img src='${imgURL + m.poster_path}' alt='${m.name}' />
                </div>
                <span>${m.name} 
                <br/>(${releaseYear})
                </span>
                <button class='detail_button'>
                Detail
                </button>
              </div> `;
  };

  window.addEventListener('scroll', () => {
    const textHeader = document.querySelector('.text_header');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 30) {
      header.classList.add('fixed', 'fixed_color');
      textHeader.classList.add('text_fixed');
    } else {
      header.classList.remove('fixed', 'fixed_color');
      textHeader.classList.remove('text_fixed');
    }
  });

  window.addEventListener('click', (a) => {
    if (a.target.classList.contains('a_nav') || a.target.tagName === 'LI') {
      // li nya harus besar
      navbar.classList.remove('show');
      body.classList.remove('menu-open');
      body.style.overflow = 'auto';
    }
  });

  // Scroll ke search

  const searchNav = document.querySelector('.searchlogo');

  searchNav.addEventListener('click', () => {
    if (document.location.pathname !== '/') {
      window.location.href = '/#numpang_search';
    } else {
      const search = document.querySelector('.search');
      const offsetY = search.offsetTop - 130;
      window.scrollTo({
        top: offsetY,
        behavior: 'smooth',
      });
    }
  });

  // Hamburger menu

  menu.addEventListener('click', () => {
    navbar.classList.toggle('show');
    body.classList.toggle('menu-open');
    const isMenuOpen = body.classList.contains('menu-open');
    body.style.overflow = isMenuOpen ? 'hidden' : 'auto';

    const scrollPosition = window.scrollY;
    if (scrollPosition < 30) {
      header.classList.toggle('fixed_color');
    }

    const icon = document.querySelector('.searchlogo i');
    icon.classList.toggle('hidden');
  });

  // GET POPULAR

  fetch(`${APIUrl}movie/popular?language=en-US&page=1`, options)
    .then((response) => response.json())
    .then((response) => {
      let cards = '';
      const movies = response.results.slice(0, 10);
      movies.forEach((m) => {
        cards += showCards(m);
      });

      const catCards = document.querySelector('.cat_cards');
      if (catCards) {
        catCards.innerHTML = cards;
      }
    })

    .catch((err) => console.error(err));

  // GET MOVIE CATEGORY LIST

  const showMovieList = (ml) => `<div class='cat_m_lists' data-listID='${ml.id}'>${ml.name}</div>`;

  fetch(`${APIUrl}genre/movie/list?language=en`, options)
    .then((response) => response.json())
    .then((response) => {
      let cards = '';
      const movieList = response.genres;
      movieList.forEach((ml) => {
        cards += showMovieList(ml);
      });

      const catMList = document.querySelector('.cat_m_list');
      if (catMList) {
        catMList.innerHTML = cards;
      }
    })
    .catch((err) => console.error(err));

  // GET TV CATEGORY LIST

  fetch(`${APIUrl}genre/tv/list?language=en`, options)
    .then((response) => response.json())
    .then((response) => {
      let cards = '';
      const movieList = response.genres;
      movieList.forEach((ml) => {
        cards += showMovieList(ml);
      });

      const catMList = document.querySelector('.cat_tv_list');
      if (catMList) {
        catMList.innerHTML = cards;
      }
    })
    .catch((err) => console.error(err));

  // SEARCH MOVIE

  const keyword = document.querySelector('.search_input');
  const buttonSearch = document.querySelector('.search_button');

  const performSearch = () => {
    if (keyword.value.length !== 0) {
      fetch(`${APIUrl}search/movie?query=${keyword.value}&include_adult=false&language=en-US&page=1`, options)
        .then((response) => response.json())
        .then((response) => {
          let cards = '';
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

            const searchList = document.querySelector('.search_tab');
            searchList.innerHTML = searchTab;
            searchList.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            const searchTab = ` <div class='grup_cat'>
                                    <div class='cat_title'>No movies found</div>
                                    <div class='cat_cards'>
                                      No movies found related to the search for '${keyword.value}'.
                                    </div>
                                  </div>
                              `;

            const searchList = document.querySelector('.search_tab');
            searchList.innerHTML = searchTab;
            searchList.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        })

        .catch((err) => console.error(err));
    } else {
      console.log('Input is empty. Please enter a keyword to search.');
    }
  };

  if (buttonSearch) {
    buttonSearch.addEventListener('click', () => {
      performSearch();
    });
  }

  if (document.location.pathname === '/') {
    keyword.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        performSearch();
      }
    });

    const search = document.querySelector('.search');

    let lastScrollTop = 0;
    let isScrollingUp = false;

    window.addEventListener(
      'scroll',
      () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop) {
          // Scroll ke bawah
          search.classList.add('visible');
          isScrollingUp = false;
        } else {
          // Scroll ke atas
          isScrollingUp = true;
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;

        // Jika sedang scrolling ke atas dan sudah di atas halaman, sembunyikan elemen pencarian
        if (isScrollingUp && currentScroll === 0) {
          search.classList.remove('visible');
        }
      },
      false,
    );

    const getStarted = document.querySelector('.hero_button');
    getStarted.addEventListener('click', () => {
      window.location.href = '/#populars_tab';
    });
  }

  document.addEventListener('click', (e) => {
    if (e.target.offsetParent.classList.contains('cat_cards_card')) {
      const movieID = e.target.offsetParent.dataset.id;
      const category = e.target.offsetParent.dataset.loc;
      const movieTitle = e.target.offsetParent.textContent.trim().split('\n')[0];

      const detailPageURL = `detail.html?id=${movieID}&cat=${category}&title=${encodeURIComponent(movieTitle)}`;
      window.location.href = detailPageURL;
    } else if (
    // GET MOVIE BY LIST

      e.target.parentElement.classList.contains('cat_m_list')
    ) {
      const listID = e.target.dataset.listid;
      const listName = e.target.innerText;
      fetch(`${APIUrl}discover/movie?api_key=${API_KEY}&with_genres=${listID}`)
        .then((response) => response.json())
        .then((response) => {
          let cards = '';
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

          const searchList = document.querySelector('.movie_by_list');
          searchList.innerHTML = searchTab;
          searchList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch((err) => console.error(err));
    } else if (
    // GET TV BY LIST

      e.target.parentElement.classList.contains('cat_tv_list')
    ) {
      const listID = e.target.dataset.listid;
      const listName = e.target.innerText;
      fetch(`${APIUrl}discover/tv?api_key=${API_KEY}&with_genres=${listID}`)
        .then((response) => response.json())
        .then((response) => {
          let cards = '';
          const search = response.results;

          search.forEach((m) => {
            cards += showTVCards(m);
          });

          const searchTab = ` <div class='grup_cat'>
                                <div class='cat_title'>Displaying ${search.length} TV related to the '${listName}' category</div>
                                <div class='search_card'>
                                  ${cards}
                                </div>
                              </div>
                            `;

          const searchList = document.querySelector('.tv_by_list');
          searchList.innerHTML = searchTab;
          searchList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        })
        .catch((err) => console.error(err));
    }
  });

  // ONLY IN DETAIL PAGE

  if (document.location.pathname === '/detail.html') {
    const params = new URLSearchParams(window.location.search);
    const movieID = params.get('id');
    const category = params.get('cat');

      const fetchDataAndRenderDetails = (category, movieID) => {
        const fetchAndRender = (url, options, showFunction) => {
          fetch(url, options)
            .then((response) => response.json())
            .then((movie) => {
              const m = movie

              const { genres } = m
              let card = ''

              genres.forEach((g) => {
                const genreCard = () =>
                  `<div class='genres' data-listID='${g.id}' >${g.name}</div> `
                card += genreCard(g)
              })

              document.addEventListener('click', (e) => {
                if (e.target.classList.contains('genres')) {
                  const listID = e.target.dataset.listid
                  const listName = e.target.innerText

                  fetch(
                    `${APIUrl}discover/${
                      category === 'm' ? 'movie' : 'tv'
                    }?api_key=${API_KEY}&with_genres=${listID}`
                  )
                    .then((response) => response.json())
                    .then((response) => {
                      let cards = ''
                      const search = response.results

                      search.forEach((mv) => {
                        cards +=
                          category === 'm' ? showCards(mv) : showTVCards(mv)
                      })

                      const searchTab = ` <div class='grup_cat'>
                                            <div class='cat_title'>Displaying ${
                                              search.length
                                            } ${
                                              category === 'm' ? 'movies' : 'TV shows'
                                            } related to the '${listName}' category</div>
                                            <div class='search_card'>
                                              ${cards}
                                            </div>
                                          </div>`

                      localStorage.setItem(
                        'searchResults',
                        JSON.stringify(searchTab)
                      )

                      // Redirect to index.html
                      window.location.href = '/index.html' // Change this if your file name is different
                    })
                    .catch((err) => console.error(err))
                }
              })

              // merubah duration kedalam string
              const totalMinutes = m.runtime

              const hours = Math.floor(totalMinutes / 60) // Mendapatkan jam
              const minutes = totalMinutes % 60 // Mendapatkan sisa menit setelah jam dihitung

              // Mengonversi ke string dengan format yang diinginkan
              const runtime = `${hours.toString()} h ${minutes.toString()} m`

              const movieDetail = `
                                    <div class='detail_container_head'>
                                      <div class='detail_image'>
                                        <img src='${imgURL + m.poster_path}' alt='' />
                                      </div>
                                      <div class='detail_movie'>
                                        <div class='detail_movie_title judul'>
                                          ${m.title || m.name}
                                          <div class='props'>
                                            <span class='year'>${
                                              m.release_date
                                                ? m.release_date.substring(0, 4)
                                                : m.first_air_date.substring(0, 4)
                                            }
                                            </span> 
                                            ●
                                            <span class='lang'>${m.original_language.toUpperCase()}</span> 
                                            ●
                                            <span class='vote'><i class="fa-solid fa-star fa-2xs" style="color:yellow"></i> ${m.vote_average.toFixed(
                                              1
                                            )}</span>
                                            ●
                                            <span class='duration'>${
                                              category === 'm'
                                                ? runtime
                                                : `${m.number_of_episodes} Episode`
                                            }</span>
                                          </div>
                                          <div class='genrest'>${card}</div> 
                                        </div>
                                        <div class='overview'>
                                          ${m.overview}
                                        </div>
                                      </div>
                                    </div>`

              const detailPage = document.querySelector('.detail_page')
              detailPage.innerHTML = movieDetail

              const banner = document.querySelector('.banner_movie')
              banner.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgb(43, 42, 76, 1)), url('${
                imgURL + m.backdrop_path
              }')`

              let simi = ''
              const movies = m.similar.results.slice(0, 10)
              movies.forEach((mv) => {
                simi += category === 'm' ? showCards(mv) : showTVCards(mv)
              })

              const similar = document.querySelector(
                category === 'm' ? '.cat_similar' : '.cat_tv_similar'
              )
              similar.innerHTML = simi
            })
            .catch((err) => console.error(err))

          // CAST
          fetch(
            `${APIUrl}${
              category === 'm' ? 'movie' : 'tv'
            }/${movieID}/credits?language=en-US`,
            options
          )
            .then((response) => response.json())
            .then((response) => {
              const { cast } = response
              const castCard = (m) => `  <div class='cat_cards_cast'>
                  <div class='cast_pp'>
                    <img src='${imgURL + m.profile_path}' alt='${m.name}' />
                  </div>
                  <div class='cast_text'>
                    <div class='nameartist'>${m.name}</div>
                    <div class='alias'>${m.character}</div>
                  </div>
                </div>`
              let cards = ''
              cast.forEach((m) => {
                cards += castCard(m)
              })

              const catCards = document.querySelector('.cat_casts')
              catCards.innerHTML = cards
            })
            .catch((err) => console.error(err))
        }

        const url = `${APIUrl}${
          category === 'm' ? 'movie' : 'tv'
        }/${movieID}?api_key=${API_KEY}&append_to_response=similar`

        fetchAndRender(url, options, category === 'm' ? showCards : showTVCards)
      }

      // Contoh penggunaan
      if (category === 'm') {
        fetchDataAndRenderDetails('m', movieID)
      } else if (category === 'tv') {
        fetchDataAndRenderDetails('tv', movieID)
      }

  }
};

export default main;
