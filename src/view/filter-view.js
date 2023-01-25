import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, isChecked) {
  return (
    `<div class="trip-filters__filter">
      <input 
        id="filter-${filter}" 
        class="trip-filters__filter-input  visually-hidden" 
        type="radio" 
        name="trip-filter" 
        value="${filter}" 
        ${isChecked ? 'checked' : ''}
      >
      <label 
        class="trip-filters__filter-label" 
        for="filter-${filter}"
      >
        ${filter}
      </label>
    </div>`
  );
}

function createFilterTemplate(filterItems) {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return (
    `<div class="trip-controls__filters">
      <h2 class="visually-hidden">Filter events</h2>
      <form class="trip-filters" action="#" method="get">
        ${filterItemsTemplate}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>
    </div>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;

  constructor({ filters }) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
