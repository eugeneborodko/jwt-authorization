class UserDto {
  email
  id
  isEmailActivated

  constructor(model) {
    this.email = model.email
    this.id = model.id
    this.isEmailActivated = model.isEmailActivated
  }
}

module.exports = UserDto