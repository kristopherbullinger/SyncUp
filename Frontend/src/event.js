class Event {
  constructor(attrs) {
    this.title = attrs.title;
    this.description = attrs.description;
    this.address = attrs.address;
    this.date = attrs.date;
    this.tags = attrs.tags;
    this.id = attrs.id
    Event.all.push(this)
  }

  renderEventCard() {
    return `
    <div data-id=${this.id} class="event">
      <h4>${this.title}</h4>
      <ul>
        <li>${this.date}</li>
        <li>${this.tags.join(", ")}</li>
      </ul>
      <button class="attend-button">Attend</button>
    </div>`
  }

  renderFullEventListing() {
    return `
    <div data-id=${this.id} class="event">
      <h4>${this.title}</h4>
      <span>${this.description}</span>
      <ul>
        <li>${this.address}</li>
        <li>${this.date}</li>
        <li>${this.tags.join(", ")}</li>
      </ul>
      <button class="attend-button">Attend</button>
    </div>`
  }

}
Event.all = []
