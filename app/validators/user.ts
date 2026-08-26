import vine from '@vinejs/vine'

const username = () => vine.string().minLength(3).maxLength(50)
const password = () => vine.string().minLength(4)

export const loginValidator = vine.create({
  username: username(),
  password: password(),
})
