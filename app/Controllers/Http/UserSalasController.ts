import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserSala from 'App/Models/UserSala'
import Database from '@ioc:Adonis/Lucid/Database'

export default class UserSalasController {
    public async index({ auth, response }: HttpContextContract) {
        const isAuth = await auth.check()
        if (!isAuth) {
          return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
        }
        if(auth.user?.nivel =='professor'){
        const usersala = await Database.query().select('id_aluno','id_sala','id_professor').from('user_salas')
        return usersala
        }
        return('Você não tem permissão para visualizar a lista de alunos cadastrados nas salas')
      }

    public async store({ auth, response, request }: HttpContextContract) {
        const isAuth = await auth.check()
        if (!isAuth) {
          return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
        }
        const body = request.only(['id_aluno', 'id_sala'])
        const usersala = await UserSala.create({
          id_sala: body.id_sala,
          id_aluno: body.id_aluno,
          id_professor: auth.user?.id
        })
        return usersala
      }
    }