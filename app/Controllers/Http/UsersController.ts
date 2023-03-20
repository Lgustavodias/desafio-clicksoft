import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'



export default class UsersController {
  public async index({ auth, response }: HttpContextContract) {

    const isAuth = await auth.check()

    if (!isAuth) {
      return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
    }
    if(auth.user?.nivel =='professor'){
    const user = await Database.query().select('id','nome','email','matricula','datanascimento').from('users').where('nivel','aluno')
    return user
    }
    return('Você não tem permissão para visualizar a lista de alunos cadastrados')
  }

  public async store({ response,request }: HttpContextContract) {
  const body = request.only(['nome', 'email', 'password', 'matricula', 'nivel', 'datanascimento'])
  const validacao = await Database.query().select('email','matricula').from('users')
  let emailExists = false
  let matriculaExists = false
  for (const user of validacao) {
    if (user.email === body.email) {
      emailExists = true
    }
    if (user.matricula === body.matricula) {
      matriculaExists = true
    }
  }
  if (emailExists || matriculaExists) {
    return response.status(422).json({ error: 'Email ou matricula já existe no sistema, tente novamente com um email ou matricula valido' })
  }
  const user = await User.create({
  nome: body.nome,
  email: body.email,
  password: body.password,
  matricula: body.matricula,
  nivel: body.nivel,
  datanascimento: body.datanascimento
})
    return user
}


  public async show({ auth, response }: HttpContextContract) {
    // Verifica se o usuário está autenticado
    const isAuth = await auth.check()

    if (!isAuth) {
      return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
    }
    const Userid = auth.user?.id
    const user = await User.findOrFail(Userid)
    return user
}


  public async update({ auth, response, request }: HttpContextContract) {
    // Verifica se o usuário está autenticado
    const isAuth = await auth.check()

    if (!isAuth) {
      return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
    }
    
    const Userid = request.param('id')
    if (Userid == auth.user?.id){
      const body = request.only(['nome', 'password', 'nivel', 'datanascimento'])
      const user = await User.findOrFail(Userid)
      await user.merge(body).save()
      return user
    }
    return ('Você não tem permissão para alterar este usuário')
  }

  public async destroy({ auth, response, request }: HttpContextContract) {

    const isAuth = await auth.check()

    if (!isAuth) {
      return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
    }
    const Userid = request.param('id')
    if (Userid == auth.user?.id){
    const user = await User.findOrFail(Userid)
    await user.delete()
    return 'Usúario Deletado'
    }
    return ('Você não tem permissão para excluir este usuário')
  }
}
/*controle de nivel pronto:
const use = auth.user
if (use?.nivel !== 'professor') {
  return response.unauthorized({ error: 'You do not have permission to edit the database.' })
}*/