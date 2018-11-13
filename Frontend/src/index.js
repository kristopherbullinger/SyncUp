let sessionUser = {}

document.addEventListener('DOMContentLoaded', () => {

  const endPointEvents = 'http://localhost:3000/api/v1/events';
  const endPointUsers = 'http://localhost:3000/api/v1/users';
  const endPointAttendances = 'http://localhost:3000/api/v1/attendances';
  const eventContainer = document.querySelector('#event-container')
  const logInButton = document.querySelector('#login-button')
  const logInForm = document.querySelector("#login-form")

  fetch(endPointEvents)
  .then(res => res.json())
  .then(json => {
    json.forEach(event => {
      const newEvent = new Event(event);
      eventContainer.innerHTML += newEvent.renderEventCard();
    });
  });

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
    .then(user => {
      sessionUser.user = user
      event.target.reset()
      event.target.style.display = ""
    })
  })


  logInButton.addEventListener('click', event => {
    console.log(event)
  })

  eventContainer.addEventListener("click", event => {
    let id
    if (Array.from(event.target.classList).includes("attend-button")) {
      id = event.target.parentElement.dataset.id
    } else if (event.target.nodeName === "LI"){
      id = event.target.parentElement.parentElement.dataset.id
    } else if (event.target.nodeName === "UL" || event.target.nodeName === "H4") {
      id = event.target.parentElement.dataset.id
    } else if (Array.from(event.target.classList).includes("event")) {
      id = event.target.dataset.id
    }
    Event.toggleModal(id)
  })

    window.onclick = function(event) {
      if (event.target == document.getElementById('modal-background')) {
        document.getElementById('modal-background').style.display = "none";
      } else if (event.target.id === "login-button") {
        User.toggleLoginForm()
      } else if (Array.from(event.target.classList).includes("attend-button")) {
        attrs = {attendance: {user_id: sessionUser.user.id, event_id: parseInt(event.target.parentElement.dataset.id)}}
        fetch(endPointAttendances, {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(attrs)})
        .then(res => res.json())
        .then(attendance => {
          let eventCards = Array.from(document.querySelectorAll(".event")).filter(eventCard => eventCard.dataset.id == attendance.event_id)
          let localEvent = Event.all.find(event => event.id === attendance.event_id)
          localEvent.attendees.push(sessionUser.user.name)
          eventCards.forEach(card => {
            card.querySelector(".attendees").innerText = `${localEvent.attendees.length} People Attending`
          })
          // eventCard.querySelector(".attendees").innerHTML = `${localEvent.attendees.length} People Attending`
        })
      }
    }

}) // end of DOMContentLoaded
