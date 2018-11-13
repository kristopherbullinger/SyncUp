class Event {
  constructor(attrs) {
    this.title = attrs.title;
    this.description = attrs.description;
    this.address = attrs.address;
    this.date = attrs.date;
    this.tags = attrs.tags;
    this.id = attrs.id
    if (attrs.attendees) {
      this.attendees = attrs.attendees
    } else {
      this.attendees = []
    }
    Event.all.push(this)
  }

  renderEventCard() {
    let buttonText = (this.attendees.includes(sessionUser.user.name)) ? "Attending" : "Attend"
    return `
    <div data-id=${this.id} class="event">
      <h4>${this.title}</h4>
      <ul>
        <li>${this.date}</li>
        <li>${this.tags.join(", ")}</li>
        <li class="attendees">${this.attendees.length} People Attending</li>
      </ul>
      <button class="attend-button">${buttonText}</button>
    </div>`
  }

  renderFullEventListing() {
    let buttonText = (this.attendees.includes(sessionUser.user.name)) ? "Attending" : "Attend"
    return `
    <div data-id=${this.id} class="event">
      <h4>${this.title}</h4>
      <span>${this.description}</span>
      <ul>
        <li>${this.address}</li>
        <li>${this.date}</li>
        <li>${this.tags.join(", ")}</li>
        <li class="attendees">${this.attendees.length} People Attending</li>
      </ul>
      <button class="attend-button">${buttonText}</button>
    </div>
    `
  }

  static toggleModal(id) {
    let targetEvent = Event.all.find(event => event.id == id)
    // debugger
    document.getElementById('modal-content').innerHTML = targetEvent.renderFullEventListing();
    document.getElementById('modal-background').style.display = "block"
  }

}
Event.all = []
