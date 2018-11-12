class Event {
  constructor(title, description, address, date, tags) {
    this.title = title;
    this.description = description;
    this.address = address;
    this.date = date;
    this.tags = tags;
    this.id = eventId++
    Event.all.push(this)
  }

  renderEvent() {
    return `
    <div data-id=${this.id}>
      <h4>${this.name}</h4>
      <span>${this.description}</span>
      <ul>
        <li>${this.address}</li>
        <li>${this.date}</li>
        <li>${this.tags}</li>
      </ul>
      <button>Attend</button>
    </div>`
  }

}

Event.all = []
let eventId = 1;
