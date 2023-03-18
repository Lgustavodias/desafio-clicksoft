import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'


export default class UsersController {
  public async index({}: HttpContextContract) {
    const user = await User.all()
    return user
  }

  public async store({ request }: HttpContextContract) {

  const body = request.only(['nome', 'email', 'password', 'matricula', 'nivel', 'datanascimento'])
  
  const user = await User.create({
  nome: body.nome,
  email: body.email,
  password: body.password,
  matricula: body.matricula,
  nivel: body.nivel,
  datanascimento: body.datanascimento
})

console.log(user.$isPersisted) // true

    return user
  }

  public async show({ request }: HttpContextContract) {
    const Userid = request.param('id')
    const user = await User.findOrFail(Userid)
    return user
  }

  public async update({ request }: HttpContextContract) {
    const Userid = request.param('id')
    const body = request.only(['nome', 'email', 'password', 'matricula', 'nivel', 'datanascimento'])
    const user = await User.findOrFail(Userid)
    await user.merge(body).save()
    return user
  }

  public async destroy({ request }: HttpContextContract) {
    const Userid = request.param('id')
    const user = await User.findOrFail(Userid)
    await user.delete()
    return 'Usúario Deletado'
  }
}
