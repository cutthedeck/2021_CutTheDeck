class CtdHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <img id=title src=imgs/img_header.png>
      </header>         `        
  }
}

class CtdFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <p>&copy; Copyright 2021 Cut The Deck Dev. Team<br>All rights reserved</p>
      </footer>    `        
  }
}

customElements.define('ctd-header', CtdHeader)
customElements.define('ctd-footer', CtdFooter)