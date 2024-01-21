class hero extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `  <div class="hero">
                            <div class="hero_field">
                                <span class="hero_title">Unlimited movies, TV shows, and more</span>
                                <span class="hero_subtitle">
                                Find the latest and greatest movies and shows all available on
                                SakuFilm
                                </span>
                                <button class="hero_button glare-button">Get Started</button>
                            </div>
                        </div> `;
  }
}

customElements.define('section-hero', hero);
