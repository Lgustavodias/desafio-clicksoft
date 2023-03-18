import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index({}: HttpContextContract) {
    const user = await User.all()
    return user
  }

  public async store({ request }: HttpContextContract) {

  const body = request.only(['nome', 'email', 'senha', 'matricula', 'nivel', 'datanascimento'])
  
  const user = await User.create({
  nome: body.nome,
  email: body.email,
  senha: body.senha,
  matricula: body.matricula,
  nivel: body.nivel,
  datanascimento: body.datanascimento
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
