customElements.define('my-fallback-component', class FallbackComponent extends HTMLElement {
  async connectedCallback() {
    this.innerHTML = '...'

    if (this.hasAttribute('src') && this.getAttribute('src') !== '') {
      this.url = this.getAttribute('src')
      console.log(`refetch: ${this.url}`);
      const response = await fetch(this.url)

      if (response.ok) {
        const text = await response.text()
        setTimeout(() => { this.innerHTML = text }, 300)
      }
    }
  }
})
