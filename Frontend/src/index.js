let sessionUser = {}
document.addEventListener('DOMContentLoaded', () => {

  const endPointEvents = 'http://localhost:3000/api/v1/events';
  const endPointUsers = 'http://localhost:3000/api/v1/users';
  const endPointAttendances = 'http://localhost:3000/api/v1/attendances';
  const eventContainer = document.querySelector('#event-container')
  const logInButton = document.querySelector('#login-button')
  const logInForm = document.querySelector("#login-form")
  const createEventButton = document.querySelector("#create-event-button")
  const createEventFormModalBackground = document.querySelector("#new-event-modal-background")
  const createEventForm = document.querySelector("#new-event-form")
  const fullEventModalContent = document.querySelector("#modal-content")
  const fullEventModalBackground = document.querySelector("#modal-background")
  const searchInputField = document.querySelector("#search")
  const searchLink = document.querySelector("#search-link")
  const myEvents = document.querySelector("#my-events")

  function fetchEvents() {
    fetch(endPointEvents)
    .then(res => res.json())
    .then(json => {
      json.forEach(event => {
        const newEvent = new Event(event);
        eventContainer.innerHTML += newEvent.renderEventCard();
      });
    });
  }

  function attendEvent(attrs) {
    fetch(endPointAttendances, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(attrs)})
    .then(res => res.json())
    .then(attendance => {
      let eventCards = Array.from(document.querySelectorAll(".event")).filter(eventCard => eventCard.dataset.id == attendance.event_id)
      let localEvent = Event.all.find(event => event.id === attendance.event_id)
      localEvent.attendees.push(sessionUser.user.name)
      eventCards.forEach(card =>  {
        card.querySelector(".attendees").innerText = `${localEvent.attendees.length} People Attending`
        card.querySelector('.attend-button').innerText = "Attending"
      })
      document.getElementById('modal-content').innerHTML = localEvent.renderFullEventListing();
    })
  } // fix modal attend text

  function unattendEvent(attrs) {
    fetch(endPointAttendances, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(attrs)})
      .then(res => {
        let notAttending = Event.all.find(event => event.id == attrs.attendance.event_id)
        notAttending.attendees.splice(notAttending.attendees.indexOf(sessionUser.user.name), 1);
        let eventCards = Array.from(document.querySelectorAll(".event")).filter(eventCard => eventCard.dataset.id == notAttending.id)
        eventCards.forEach(card =>  {
          card.querySelector(".attendees").innerText = `${notAttending.attendees.length} People Attending`
          card.querySelector('.attend-button').innerText = "Attend"
        })
        document.getElementById('modal-content').innerHTML = notAttending.renderFullEventListing();
      })
  }

  function deleteEvent(deleteEventId) {
    let eventCards = document.querySelectorAll(`[data-id='${deleteEventId}']`)
    fetch(`${endPointEvents}/${deleteEventId}`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"}
    }).then(res => {
      Event.all = Event.all.filter(events => events.id != deleteEventId)
      eventCards.forEach(events => events.remove())
      Event.toggleModal();
    })
  }

  function loginAttempt(attrs){
    fetch(endPointUsers, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(attrs)})
    .then(res => res.json())
    .then(user => {
      if (user.errors) {
        user.errors.forEach(error => window.alert(error))
        location.reload()
      } else {
        sessionUser.user = user
        fetchEvents();
        logInForm.reset()
        fadeOutElement(logInForm, logInForm.parentElement)
      }
    })
  }

  function createEvent(atts) {
    fetch(endPointEvents, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(attrs)})
    .then(res => res.json())
    .then(newEvent => {
      newLocalEvent = new Event(newEvent)
      eventContainer.innerHTML += newLocalEvent.renderEventCard()
      createEventFormModalBackground.style.display = "none"
    })
  }

  function filterEvents(input) {
    input = input.toLowerCase().split(" ")
    let foundEvents = Event.all.filter(eventObj => {
      let eventString = JSON.stringify(eventObj).toLowerCase()
      return input.every(word => eventString.includes(word))
    })
    let foundEventsStrings = foundEvents.map(eventObj => JSON.stringify(eventObj))
    eventContainer.innerHTML = ""
    foundEvents.forEach(eventObj => eventContainer.innerHTML += eventObj.renderEventCard())
    console.log(foundEventsStrings)
  }

  function toggleSearchbar() {
    if (searchInputField.style.display === "none") {
      searchInputField.style.display = "block"
      searchLink.style.display = "none"
    } else {
      searchInputField.style.display = "none"
      searchLink.style.display = "block"
    }
  }

  function fadeOutElement(modalContent, modalBackground) {
    modalContent.style.opacity = "1"
    let myNewInterval = setInterval( () => {
      dimmer(modalContent, modalBackground)
      if (modalContent.style.opacity <= 0) {
        modalContent.style.opacity = "1"
        clearInterval(myNewInterval)
      }
    }, 2)
    function dimmer(modalContent, modalBackground) {
  	  modalContent.style.opacity -= 0.01
      if (modalContent.style.opacity <= 0) {modalBackground.style.display = "none"}
    }
  }

  myEvents.addEventListener("click", e => filterEvents(sessionUser.user.name))

  searchLink.addEventListener("click", toggleSearchbar)

  searchInputField.addEventListener('input', event => filterEvents(searchInputField.value))

  createEventButton.addEventListener("click", event => {
    createEventFormModalBackground.style.display = "block"
  })

  createEventForm.addEventListener("submit", event => {
    event.preventDefault()
    let title = event.target.querySelector("#event-title").value
    let description = event.target.querySelector("#description").value
    let address = event.target.querySelector("#address").value
    let date = event.target.querySelector("#date").value
    let tags = event.target.querySelector("#tags").value.split(" ")
    attrs = {event: {"title": title, "description": description, "address": address, "date": date, "tags": tags, "user_id": sessionUser.user.id}}
    createEvent(attrs);
  }) // end create event

  logInForm.addEventListener("submit", (event) => {
    event.preventDefault()
    let username = event.target.querySelector("#username").value
    let email = event.target.querySelector("#email").value
    let attrs = {user: {"name": username, "email": email}}
    loginAttempt(attrs);
  }) // end of addEventListener

  eventContainer.addEventListener("click", event => {
    let id
    if (Array.from(event.target.classList).includes("attend-button")) {
      id = event.target.parentElement.dataset.id
    } else if (event.target.nodeName === "P" || event.target.nodeName === "H4") {
      id = event.target.parentElement.dataset.id
      Event.toggleModal(id)
    } else if (Array.from(event.target.classList).includes("event")) {
      id = event.target.dataset.id
      Event.toggleModal(id)
    }
  })

  window.onclick = function(event) {
      if (event.target == fullEventModalBackground) {
        fadeOutElement(fullEventModalContent, fullEventModalBackground)
      } else if (event.target == createEventFormModalBackground) {
          fadeOutElement(createEventForm, createEventFormModalBackground)
      } else if (Array.from(event.target.classList).includes("attend-button")) {
        let eventTargetId = event.target.parentElement.dataset.id
        let attrs = {attendance: {user_id: sessionUser.user.id, event_id: parseInt(eventTargetId)}}
        if (!Event.all.find(e => e.id == eventTargetId).attendees.includes(sessionUser.user.name)) {
          attendEvent(attrs);
        } else {
          unattendEvent(attrs);
        }
      }
      else if (Array.from(event.target.classList).includes("delete-button")) {
        let deleteEventId = event.target.parentElement.dataset.id
        deleteEvent(deleteEventId);
      }
    } //end of window.onclick



}) // end of DOMContentLoaded
