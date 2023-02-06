import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { DATE_FORMAT } from '../const.js';
// import { formatDate } from '../utils/day.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import dayjs from 'dayjs';
import { mockOffers } from '../mock/offers.js';
import { mockDestinations } from '../mock/destinations.js';

function getPicturesListTemplate(eventDestination) {
  let template = '';
  if (eventDestination) {
    template = eventDestination.pictures.map(
      (elem) => `<img class="event__photo" src=${elem.src} alt="${elem.description}">`
    ).join('');
  }
  return template;
}

function createEventTypeItemEditTemplate(offers) {
  const elementEditTypes = offers.map((elem) => `
    <div class="event__type-item">
      <input
        id="event-type-${elem.type}-${elem.id}"
        class="event__type-input
        visually-hidden"
        type="radio"
        name="event-type"
        value="${elem.type}"
      >
        <label
          class="event__type-label event__type-label--${elem.type}"
          for="event-type-${elem.type}-${elem.id}"
        >
          ${elem.type}
        </label>
    </div>`
  ).join('');

  return elementEditTypes;
}

function createSectionOffersEditTemplate(offerTypes, offer, type) {
  let template = '';
  if (offerTypes) {
    template = offerTypes.offers.map((elem) => (
      `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox
          visually-hidden"
          id="event-offer-${type}-${elem.id}"
          type="checkbox"
          name=${elem.title}
          data-offer-id="${elem.id}" ${offer.includes(elem.id) ? 'checked' : ''}
        >
          <label class="event__offer-label" for="event-offer-${type}-${elem.id}">
            <span class="event__offer-title">${elem.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${elem.price}</span>
          </label>
      </div>`
    )).join('');
  }
  return template;
}

const chooseDestination = mockDestinations.map((element) => `<option value="${element.name}">`).join('');
function createEventEditTemplate(tripEvent) {
  const { offers, type, dateFrom, dateTo, destination, basePrice, id } = tripEvent;

  const parceDateStart = dayjs(dateFrom);
  const parceDateEnd = dayjs(dateTo);
  const eventDestination = mockDestinations.find((item) => destination === item.id);
  const eventTypeOffer = mockOffers.find((offer) => offer.type === type);

  return (`
<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypeItemEditTemplate(mockOffers)}
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-${id}">
        ${type}
        </label>
        <input
          class="event__input event__input--destination"
          id="event-destination-${id}"
          type="text"
          name="event-destination"
          value='${eventDestination ? eventDestination.name : ''}'
          list="destination-list-${id}"
        >
        <datalist id="destination-list-${id}">
          ${chooseDestination}
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-${id}">From</label>
        <input class="event__input  event__input--time event-start-time" data-start-time id="event-start-time-${id}" type="text" name="event-start-time" value='${parceDateStart.format(DATE_FORMAT.FormTime)}'>
        &mdash;
        <label class="visually-hidden" for="event-end-time-${id}">To</label>
        <input class="event__input  event__input--time event-end-time" data-end-time id="event-end-time-${id}" type="text" name="event-end-time" value='${parceDateEnd.format(DATE_FORMAT.FormTime)}'>
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-${id}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice !== null ? basePrice : ''}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${createSectionOffersEditTemplate(eventTypeOffer, offers, type)}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${eventDestination ? eventDestination.description : ''}</p>
        <div class="event__photos-container">
          <div class="event__photos-tape">
          ${getPicturesListTemplate(eventDestination)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`
  );
}

export default class EventEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleFormClose = null;
  #offers = null;
  #destination = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #handleDeleteClick = null;

  constructor(tripEvent) {
    const { event, onFormSubmit, onFormClose, offers, destination, onDeleteClick } = tripEvent;
    super();
    this._setState(EventEditView.parseEventToState(event));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onFormClose;
    this.#offers = offers;
    this.#destination = mockDestinations.find((item) => destination === item.id);
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createEventEditTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formCloseHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__available-offers')
      .addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#eventTypeChangeHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    this.#setDatepicker();
  }

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    let offers = this._state.offers;
    const offerId = parseInt(evt.target.dataset.offerId, 10);
    if (evt.target.checked) {
      offers.push(offerId);
      offers.sort();
    } else {
      offers = this._state.offers.filter((elem) => elem !== offerId);
    }
    this.updateElement({
      offers
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    const regex = /[0-9]/;
    let inputPrice;
    if (regex.test(evt.target.value)) {
      inputPrice = evt.target.value;
    }
    if (evt.target.value === '') { evt.target.value = '0'; }
    evt.target.value = isNaN(inputPrice) ? this._state.basePrice : inputPrice;
    this._state.basePrice = evt.target.value;
  };

  #eventTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const offers = this._state.type === evt.target.value ? this._state.offers : [];
    this.updateElement({
      type: evt.target.value,
      offers,
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const eventDestination = mockDestinations.find((item) => evt.target.value === item.name);
    const destId = eventDestination === undefined ? -1 : eventDestination.id;
    this.updateElement({
      destination: destId,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EventEditView.parseStateToEvent(this._state), this.#offers, this.#destination);
  };

  #formCloseHandler = () => {
    this.#handleFormClose();
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepicker() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('.event-start-time'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
    this.#datepickerTo = flatpickr(
      this.element.querySelector('.event-end-time'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  }

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EventEditView.parseStateToEvent(this._state));
  };


  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  reset(event) {
    this.updateElement(
      EventEditView.parseEventToState(event),
    );
  }

  static parseEventToState(event) {
    return {
      ...event
    };
  }

  static parseStateToEvent(state) {
    return {
      ...state
    };
  }
}
