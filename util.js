export default class Util {
  static async checkStatus(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  static async fetchURL(url) {
    let response = await fetch(url);
    response = await Util.checkStatus(response);
    let res = await response.json();
    return res;
  }

  static timestamp() {
    return window.performance && window.performance.now
      ? window.performance.now()
      : new Date().getTime();
  }

  /**
   * Creates an HTML element based on given tag name
   * @param {string} tagName The tag name of the element to create
   * @returns {HTMLElement} The HTML element created
   */
  static gen(tagName) {
    return document.createElement(tagName);
  }

  /**
   * Gets the HTML element with the specified id
   * @param {string} id ID to search
   * @returns {HTMLElement} The HTML element got
   */
  static id(id) {
    return document.getElementById(id);
  }

  /**
   * Gets the first element within the document that matches the specified selector
   * @param {string} selectors CSS selector
   * @returns {HTMLElement} The HTML element got
   */
  static qs(selectors) {
    return document.querySelector(selectors);
  }

  /**
   * Gets a list of the document's elements that match the specified group of selectors.
   * @param {string} selectors CSS selector
   * @returns {NodeListOf<Element>} The list of the document's elements
   */
  static qsa(selectors) {
    return document.querySelectorAll(selectors);
  }
}
