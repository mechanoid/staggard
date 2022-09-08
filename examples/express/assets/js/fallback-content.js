customElements.define('my-fallback-component', class FallbackComponent extends HTMLElement {
  async connectedCallback() {
    console.log('connected!!!!');
    this.innerHTML = '...'

    if (this.hasAttribute('src')) {
      this.url = this.getAttribute('src')
      const response = await fetch(this.url)

      if (response.ok) {
        const text = await response.text()
        setTimeout(() => { this.innerHTML = text }, 300)
      }
    }
  }
})
