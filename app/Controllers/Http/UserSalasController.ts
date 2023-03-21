import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserSala from 'App/Models/UserSala'
import Database from '@ioc:Adonis/Lucid/Database'
import { NOMEM } from 'sqlite3'

export default class UserSalasController {
    public async index({ auth, response }: HttpContextContract) {
        const isAuth = await auth.check()
        if (!isAuth) {
          return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
        }
        if(auth.user?.nivel =='professor'){
            const usersala = await Database.query().select('user_salas.id','user_salas.id_aluno', 'user_salas.id_professor', 'user_salas.id_sala','users.nome','users.nome')
            .from('user_salas')
            .leftJoin('users', 'user_salas.id_aluno', 'users.id')
        return usersala
        }
        return('Você não tem permissão para visualizar a lista de alunos cadastrados nas salas')
      }


    public async store({ auth, response, request }: HttpContextContract) {
        const isAuth = await auth.check()
        if (!isAuth) {
          return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
        }
      const body = request.only(['id','id_aluno', 'id_sala'])
      const criadordesala = await Database.query().select('id_professor').from('salas').where('id', body.id_sala).first()
      const validacaoaluno = await Database.query().select('nivel').from('users').where('id', body.id_aluno).first()
      const validacaoalunosala = await Database.query().select('id_aluno','id_sala').from('user_salas')
      let id_alunoExists = false
      let id_salaExists = false
      for (const sala of validacaoalunosala) {
        if (sala.id_aluno == body.id_aluno) {
        id_alunoExists = true
        if (sala.id_sala == body.id_sala) {
          id_salaExists = true
          }
        }
    }
    const numerodealunossala = await Database.query().select('capacidade_sala').from('salas').where('id', body.id_sala).first()
    const numberOfUsers = await Database.from('user_salas').count('* as total').where('id_sala', body.id_sala)
    const total = numberOfUsers[0].total // obter o número real de registros
    if (numerodealunossala.capacidade_sala <= total) { // comparar com capacidade_sala
    return ('Limite de numeros de alunos cadastrados em sala ')
    }

      if (auth.user?.nivel === 'professor' && auth.user?.id === criadordesala?.id_professor) {
        if (id_alunoExists && id_salaExists) {
          return response.status(422).json({ error: 'aluno ja cadastrado em sala' })
          }
        if(validacaoaluno.nivel ==='aluno'){
        const usersala = await UserSala.create({
          id : body.id,
          id_sala: body.id_sala,
          id_aluno: body.id_aluno,
          id_professor: auth.user?.id,
          nome_professor: auth.user?.nome
        })
        return usersala
      }
      return ('Aluno não existe')
    }
      return('Você não tem permissão para alocar alunos nesta')
    }


  public async destroy({ auth, response, request }: HttpContextContract) {
    const isAuth = await auth.check()
    if (!isAuth) {
        return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
    }
    const salaId = request.param('id')
    const sala = await UserSala.findOrFail(salaId)
    if (sala.id_professor !== auth.user?.id) {
        return response.forbidden({ error: 'Você não tem permissão para excluir este cadastro' })
    }
    await sala.delete()
    return 'cadastro em sala deletado'
}

public async show({ auth, response }: HttpContextContract) {
  try {
    // Verifica se o usuário está autenticado
    const isAuth = await auth.check()
    if (!isAuth) {
      return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
    }
    const nivel = auth.user?.nivel
    if(nivel !=='aluno'){
      return('Você não é um aluno')
    }
    const userId = auth.user?.id
    const userSalas = await Database.from('user_salas').select('user_salas.nome_professor','salas.numeracao_sala','users.nome','users.nome').where('id_aluno', userId)
    .leftJoin('users', 'user_salas.id_aluno', 'users.id')
    .leftJoin('salas', 'user_salas.id_sala', 'salas.id')
    return userSalas
  } catch (error) {
    console.log(error)
    return response.internalServerError({ error: 'Ocorreu um erro ao tentar recuperar as informações do usuário.' })
  }
}

}