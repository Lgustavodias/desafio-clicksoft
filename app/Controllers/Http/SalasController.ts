import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class SalasController {
    public async index({ auth, response }: HttpContextContract) {
  
        const isAuth = await auth.check()
    
        if (!isAuth) {
          return response.unauthorized({ error: 'Você precisa estar logado para acessar esta página.' })
        }
        if(auth.user?.nivel =='professor'){
        const salas = await Database.query().select('id','numeracao_sala','capacidade_sala','id_professor').from('salas')
        return salas
        }
        return('Você não tem permissão para visualizar a lista de salas cadastros')
}
}