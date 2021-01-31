import config from '../config';
import EventEmitter from 'eventemitter3';

const EVENTS = {
  APP_READY: 'app_ready',
};

/**
 * App entry point.
 * All configurations are described in src/config.js
 */
export default class Application extends EventEmitter {
  constructor() {
    super();
    this.config = config;
    this.data = {
      count: 0,
      planets: [],
    };

    this.init();
  }

  static get events() {
    return EVENTS;
  }

  /**
   * Initializes the app.
   * Called when the DOM has loaded. You can initiate your custom classes here
   * and manipulate the DOM tree. Task data should be assigned to Application.data.
   * The APP_READY event should be emitted at the end of this method.
   */
  async init() {
    const apiUrl = "https://swapi.booost.bg/api/planets";
    const rootData = await fetch(apiUrl);
    const jsonRootData = await rootData.json();

    this.data.count = jsonRootData.count;
    await this.data.planets.push(...jsonRootData.results);

    let pageCounter = 2;
    while (jsonRootData.count !== this.data.planets.length) {
      const nextPageRawData = await fetch(apiUrl + "/?page=" + pageCounter);
      let jsonData = await nextPageRawData.json();
      this.data.planets.push(...jsonData.results);
      pageCounter += 1;
    }

    this.emit(Application.events.APP_READY);
  }
}

