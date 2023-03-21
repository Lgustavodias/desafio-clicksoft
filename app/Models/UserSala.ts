import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserSala extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public id_professor: number

  @column()
  public nome_professor:string

  @column()
  public id_aluno: number

  @column()
  public id_sala: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
