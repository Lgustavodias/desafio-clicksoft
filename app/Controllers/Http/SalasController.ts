import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Sala from 'App/Models/Sala'

export default class SalasController {
    public async index({ auth, response }: HttpContextContract) {
  
        const isAuth = await auth.check()
    
        if (!isAuth) {
          return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
        }
        if(auth.user?.nivel =='professor'){
        const salas = await Database.query().select('salas.id', 'salas.numeracao_sala', 'salas.capacidade_sala', 'salas.id_professor','users.nome')
        .from('salas')
        .leftJoin('users', 'salas.id_professor', 'users.id')
        return salas
        }
        return('Você não tem permissão para visualizar a lista de salas cadastradas')
}

public async store({ auth, response,request }: HttpContextContract) {
    const isAuth = await auth.check()

    if (!isAuth) {
      return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
    }
    if(auth.user?.nivel =='professor'){
    const body = request.only(['numeracao_sala','capacidade_sala'])
    const validacao = await Database.query().select('numeracao_sala').from('salas')
    let numeracao_salaExists = false
    for (const sala of validacao) {
      if (sala.numeracao_sala == body.numeracao_sala) {
        numeracao_salaExists = true
      }
    }
    if (numeracao_salaExists) {
      return response.status(422).json({ error: 'sala já existe, tente novamento com uma nova identificação' })
    }
    const sala = await Sala.create({
    numeracao_sala: body.numeracao_sala,
    capacidade_sala: body.capacidade_sala,
    id_professor: auth.user?.id
  })
      return sala
  }
  return ({error: 'Somente professores podem cadastrar as salas'})
}

public async destroy({ auth, response, request }: HttpContextContract) {
    const isAuth = await auth.check()
    if (!isAuth) {
        return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
    }
    const salaId = request.param('id')
    const sala = await Sala.findOrFail(salaId)

    if (sala.id_professor !== auth.user?.id) {
        return response.forbidden({ error: 'Você não tem permissão para excluir esta sala' })
    }
    await sala.delete()
    return 'Sala Deletada'
}

public async update({ auth, response, request }: HttpContextContract) {
    // Verifica se o usuário está autenticado
    const isAuth = await auth.check()

    if (!isAuth) {
      return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
    }
    const body = request.only(['numeracao_sala','capacidade_sala','id_professor'])
    const validacao = await Database.query().select('numeracao_sala').from('salas')
    let numeracao_salaExists = false
    const use = auth.user
    if (use?.nivel !== 'professor' && use?.id !== body.id_professor) {
    return response.unauthorized({ error: 'Você não tem permissão para atualizar esta sala' })
    }
    for (const sala of validacao) {
        if (sala.numeracao_sala == body.numeracao_sala) {
        numeracao_salaExists = true
        }
    }
    if (numeracao_salaExists) {
    return response.status(422).json({ error: 'sala já existe, tente novamente com uma nova identificação' })
    }
    const salaId = request.param('id')
    const sala = await Sala.findOrFail(salaId)
    if (sala.id_professor !== auth.user?.id) {
      return response.forbidden({ error: 'Você não tem permissão para editar esta sala' })
    }
    await sala.merge(body).save()
    return sala
  }
}