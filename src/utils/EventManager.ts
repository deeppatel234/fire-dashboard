class EventManager {
  constructor() {
    this.list = new Map();
  }

  on(event, callback) {
    if (!this.list.has(event)) {
      this.list.set(event, []);
    }
    this.list.get(event).push(callback);
    return this;
  }

  off(event, callback) {
    let currentEvents = this.list.get(event);
    /**
     * NOTE: if specific callback to delete is not provided, then entire event
     * with all the callback functions will be deleted
     */
    if (callback) {
      currentEvents = currentEvents.filter((existingCallbackFunction) => {
        return existingCallbackFunction !== callback;
      });
      if (currentEvents.length) {
        this.list.set(event, currentEvents);
      } else {
        this.list.delete(event);
      }
    } else {
      this.list.delete(event);
    }
    return this;
  }

  emit(event, ...args) {
    if (this.list.has(event)) {
      this.list.get(event).forEach((callback) => callback(...args));
    }
  }
}

export default new EventManager();
