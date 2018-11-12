class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.id = userId++
    User.all.push(this)
  }
}

User.all = [];
let userId = 1;
