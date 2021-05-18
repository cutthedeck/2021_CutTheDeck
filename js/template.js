class CtdHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <img id=title src=imgs/img_header.png>
      </header>
    `
  
    if(navigator.userAgent.indexOf("Safari") != -1)
    { 
        this.innerHTML = `
        <header>
          <div id = "browserMessage">
            Safari is not fully supported.  Please use a different browser to access all features.
          </div>
          <img id=title src=imgs/img_header.png>
        </header>
        `
    } else {
      this.innerHTML = `
      <header>
        <img id=title src=imgs/img_header.png>
      </header>
      `
    }
  }
}

class CtdFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <p>&copy; Copyright 2021 Cut The Deck Dev. Team<br>All rights reserved</p>
      </footer>
    `        
  }
}

$('#navHome').click(function() {
	window.location.href = "index.html";
});

customElements.define('ctd-header', CtdHeader)
customElements.define('ctd-footer', CtdFooter)