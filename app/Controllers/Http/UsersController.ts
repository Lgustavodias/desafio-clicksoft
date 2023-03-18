import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({}: HttpContextContract) {
    const user = await User.all()
    return user
  }

  public async store({}: HttpContextContract) {

const user = await User.create({
  nome: 'Gustavo',
  email: 'gustavo@adonisjs.com',
  senha: '12345',
  matricula: '1l25b',
  nivel:'professor',
})

console.log(user.$isPersisted) // true

    return user
  }

  public async show({}: HttpContextContract) {
    return 'Show'
  }

  public async update({}: HttpContextContract) {
    return 'update'
  }

  public async destroy({}: HttpContextContract) {
    return 'destroy'
  }
}
