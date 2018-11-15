class Event {
  constructor(attrs) {
    this.title = attrs.title;
    this.description = attrs.description;
    this.address = attrs.address;
    let date = new Date(attrs.date.split('-')).toString().split(" ").slice(0, 4);
    this.date = `${date[0]}, ${date[1]}. ${date[2]}, ${date[3]}`
    this.tags = attrs.tags;
    this.id = attrs.id
    this.user_id = attrs.user_id
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

      <p>${this.date}</p>
      <p class="attendees">${this.attendees.length} People Attending</p>
      <p>${this.tags.join(", ")}</p>

      <button class="attend-button">${buttonText}</button>
    </div>`
  }

  renderFullEventListing() {
    let buttonText = (this.attendees.includes(sessionUser.user.name)) ? "Attending" : "Attend"
    let deleteButton = (this.user_id == sessionUser.user.id) ? '<button class="delete-button">Delete</button>' : ''
    return `
    <div data-id=${this.id} class="event">
      <h4>${this.title}</h4>
      <strong>Description:</strong>
      <span>${this.description}</span>
      <ul>
        <li><strong>Address: </strong>${this.address}</li>
        <li><strong>Date: </strong>${this.date}</li>
        <li><strong>Tags: </strong>${this.tags.join(", ")}</li>
        <li class="attendees"><strong>People Attending: </strong>${this.attendees.join(", ")}</li>
      </ul>
      <button class="attend-button">${buttonText}</button>
      ${deleteButton}
    </div>
    `
  }

  static toggleModal(id) {
    if (id) {
      let targetEvent = Event.all.find(event => event.id == id)
      // debugger
      document.getElementById('modal-content').innerHTML = targetEvent.renderFullEventListing();
    }
    let modal = document.getElementById('modal-background')
    modal.style.display = (modal.style.display == "block") ? "" : "block"
  }

}
Event.all = []
