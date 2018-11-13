let sessionUser = {}

document.addEventListener('DOMContentLoaded', () => {

  const endPointEvents = 'http://localhost:3000/api/v1/events';
  const endPointUsers = 'http://localhost:3000/api/v1/users';
  const endPointAttendances = 'http://localhost:3000/api/v1/attendances';
  const eventContainer = document.querySelector('#event-container')
  const logInButton = document.querySelector('#login-button')
  const logInForm = document.querySelector("#login-form")

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

  // modal for Login Form appears
  // modal display none after login


  logInForm.addEventListener("submit", (event) => {
    event.preventDefault()
    username = event.target.querySelector("#username").value
    email = event.target.querySelector("#email").value
    attrs = {user: {"name": username, "email": email}}
    fetch(endPointUsers, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(attrs)})
    .then(res => res.json())
      // if (res.ok) {
      //   res.json()
      // } else {
      //   debugger
      //   location.reload()
      // }
    .then(user => {
      if (user.errors) {
        user.errors.forEach(error => window.alert(error))
        location.reload()
      } else {
        sessionUser.user = user
        fetchEvents();
        event.target.reset()
        event.target.style.display = ""
        event.target.parentElement.style.display = "none"
      }
    })
  }) // end of addEventListener

  eventContainer.addEventListener("click", event => {
    let id
    if (Array.from(event.target.classList).includes("attend-button")) {
      id = event.target.parentElement.dataset.id
    } else if (event.target.nodeName === "LI"){
      id = event.target.parentElement.parentElement.dataset.id
      Event.toggleModal(id)
    } else if (event.target.nodeName === "UL" || event.target.nodeName === "H4") {
      id = event.target.parentElement.dataset.id
      Event.toggleModal(id)
    } else if (Array.from(event.target.classList).includes("event")) {
      id = event.target.dataset.id
      Event.toggleModal(id)
    }

  })

    window.onclick = function(event) {
      if (event.target == document.getElementById('modal-background')) {
        document.getElementById('modal-background').style.display = "none";
      } else if (Array.from(event.target.classList).includes("attend-button")) {
        event.stopPropagation()

        attrs = {attendance: {user_id: sessionUser.user.id, event_id: parseInt(event.target.parentElement.dataset.id)}}
        if (!Event.all.find(e => e.id == event.target.parentElement.dataset.id).attendees.includes(sessionUser.user.name)) {
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
          })
        } else {
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
            })
        }
          // eventCard.querySelector(".attendees").innerHTML = `${localEvent.attendees.length} People Attending`
      }
    }


}) // end of DOMContentLoaded
