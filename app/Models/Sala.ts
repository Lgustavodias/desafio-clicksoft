import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Sala extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public numeracao_sala: number

  @column()
  public capacidade_sala: number

  @column()
  public id_professor: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
