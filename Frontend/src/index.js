document.addEventListener('DOMContentLoaded', () => {

  const endPoint = 'http://localhost:3000/api/v1/events';
  const eventContainer = document.querySelector('#event-container')
  const logIn = document.querySelector('#log-in')

  fetch(endPoint)
  .then(res => res.json())
  .then(json => {
    json.forEach(event => {
      const newEvent = new Event(event);
      eventContainer.innerHTML += newEvent.renderEventCard();
    });
  });

  logIn.addEventListener('click', event => {
    console.log(event)
  })

  eventContainer.addEventListener("click", event => {
    let id
    if (Array.from(event.target.classList).includes("attend-button")) {
      debugger
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
        }
      }
  //   debugger
  //   if (Array.from(event.target.classList.includes("event"))) {
  //     document.querySelector(".modal-background").style.display = "block"
  //   }
  // })

}) // end of DOMContentLoaded



//if event.target.classList.includes("event") {
// do render modal thingy
// } else if (event.target.classList.null?) {
//   newDiv = event.target.parentElement
//   function findEventDiv(div) {
//     if div.classList.includes("event") {
//       return div
//     } else {
//       return findEventDiv(div.parentElement)
//     }
//   }
// }
