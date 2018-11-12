document.addEventListener('DOMContentLoaded', () => {

  const endPoint = 'http://localhost:3000/api/v1/events';
  const eventContainer = document.querySelector('#event-container')

  fetch(endPoint)
  .then(res => res.json())
  .then(json => {
    json.forEach(event => {
      const newEvent = new Event(event);
      eventContainer.innerHTML += newEvent.renderEventCard();
    });
  });

  eventContainer.addEventListener("click", event => {
    let id
    if (Array.from(event.target.classList).includes("attend-button")) {
    } else if (event.target.nodeName === "LI"){
      id = event.target.parentElement.parentElement.dataset.id
    } else if (event.target.nodeName === "UL" || event.target.nodeName === "H4") {
      id = event.target.parentElement.dataset.id
    } else if (Array.from(event.target.classList).includes("event")) {
      id = event.target.dataset.id
    }
    toggleModal(id)
  })
  //   debugger
  //   if (Array.from(event.target.classList.includes("event"))) {
  //     document.querySelector(".modal-background").style.display = "block"
  //   }
  // })

})



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
