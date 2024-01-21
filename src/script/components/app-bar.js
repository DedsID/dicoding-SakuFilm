class AppBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `  <div class="header">
                        
                        </div> 
                        <div class="text_header">
                          <div class="header2">
                            <div class="logo"><i class="fa-solid fa-ellipsis-vertical"></i> SakuFilm <i class="fa-solid fa-ellipsis-vertical"></i></div>
                            <ul class="navbar">
                                <a href="/" class="a_nav"><li>Home</li></a>
                                <a href="/#populars_tab" class="a_nav"><li>Popular</li></a>
                                <a href="/#list_tab" class="a_nav"><li>Movie List</li></a>
                                <a href="/#tvbylist_tab" class="a_nav"><li>TV List</li></a>
                            </ul>
                            <div class="nav_res">
                              <div class="searchlogo"><i class="fa-solid fa-magnifying-glass"></i></div>
                              <div class="hamburger-menu" id="hamburger-menu">
                                <div class="bar"></div>
                                <div class="bar"></div>
                                <div class="bar"></div>
                              </div>
                            </div>
                          </div>
                        </div> `;
  }
}

customElements.define('app-bar', AppBar);
