class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.id = userId++
    User.all.push(this)
  }

  static toggleLoginForm() {
    let form = document.querySelector("#login-form")
    let button = document.querySelector("#login-button")
    form.style.display = (form.style.display === "") ? "block" : ""
    button.style.display = (form.style.display === "none") ? "block" : "none"
  }

}

User.all = [];
let userId = 1;
