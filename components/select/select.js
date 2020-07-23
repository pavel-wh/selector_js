import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp'

// We are only using the caret-down icon
library.add(faCaretDown, faCaretUp)

// Replace any existing <i> tags with <svg> and set up a MutationObserver to continue doing this as the DOM changes.
dom.watch()

const getTemplate = (placeholder = 'Выберите элемент', data = [], selectedId = null) => {

  const items = data.map((item) => {
    if (item.id === selectedId) {
      placeholder = item.value
    }
    return `
      <li class="select__item${ (item.id === selectedId) ? ' select__item_selected' : ''}" data-type="item" data-id="${item.id}">${item.value}</li>
    `
  })

  return `
    <div class="select__backdrop" data-type="backdrop"></div>
    <div class="select__input" data-type="input">
      <span class="select__placeholder" data-type="value">${placeholder}</span>
      <i class="select__icon fas fa-caret-down" data-type="icon"></i>
    </div>
    <div class="select__dropdown">
      <ul class="select__list">
        ${items.join('')}
      </ul>
    </div>
  `
}

export class Select {
	constructor(selector, options) {
    this.$el = document.querySelector(selector)
    this.options = options
    this.selectedId = this.options.selectedId  || null

    this.#render()
    this.#setup()
  }

  #render() {
    const {placeholder, data, selectedId} = this.options
    this.$el.classList.add('select')
    this.$el.innerHTML = getTemplate(placeholder, data, selectedId)
  }

  #setup() {
    this.clickHandler = this.clickHandler.bind(this)
    this.$el.addEventListener('click', this.clickHandler)
    this.$value = this.$el.querySelector('[data-type="value"]')
  }

  clickHandler(event) {
    const {type} = event.target.dataset
    if(type === 'input' || event.target.closest('[data-type="input"]')) {
      this.toggle()
    } else if (type === 'item') {
      const id = event.target.dataset.id
      this.select(id)
    } else if (type === 'backdrop') {
      this.toggle()
    }
  }

  get isOpen() {
    return this.$el.classList.contains('select_opened')
  }

  get current() {
    return this.options.data.find(item => item.id === this.selectedId)
  }

	toggle() {
    this.$el.classList.toggle('select_opened')
    this.$el.querySelector('svg.select__icon').classList.toggle('fa-caret-down')
    this.$el.querySelector('svg.select__icon').classList.toggle('fa-caret-up')
  }

  select(id) {
    this.selectedId = id
    this.$value.textContent = this.current.value

    this.$el.querySelectorAll(`[data-type="item"]`).forEach(element => {
      element.classList.remove('select__item_selected')
    });

    this.$el.querySelector(`[data-id="${id}"]`).classList.add('select__item_selected')

    this.options.onSelect ? this.options.onSelect(this.current) : null

    if(this.$el.classList.contains('select_opened')) {
      this.toggle()
    }
  }

  destroy() {
    this.$el.removeEventListener('click', this.clickHandler)
    this.$el.outerHTML = null
  }
}
