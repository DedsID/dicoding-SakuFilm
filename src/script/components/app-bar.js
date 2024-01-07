class AppBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `  <div class="header">
                          <div class="header2">
                            <div class="logo">SakuFilm</div>
                            <ul class="navbar">
                                <a href="/"><li>Home</li></a>
                                <a href="/#populars_tab"><li>Popular</li></a>
                                <a href="/#list_tab"><li>Movie List</li></a>
                                <a href="/"><li>TV List</li></a>
                            </ul>
                            <a href="/#search"><div class="searchlogo">search</div></a>
                          </div>
                        </div>  `;
  }
}

customElements.define("app-bar", AppBar);
