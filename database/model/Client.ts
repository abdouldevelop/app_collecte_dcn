import { Model } from '@nozbe/watermelondb'
import { field, date, children, writer, action } from '@nozbe/watermelondb/decorators'
import Souscription from './Souscription'
import { database } from '../database'

export default class Client extends Model {
  static table = 'clients'
  static associations = {
    souscriptions: { type: "has_many" as const, foreignKey: 'client_id' },
  }

  @field('first_name') firstName !: string
  @field('last_name') lastName !: string
  @field('phone') phone !: string
  @field('numero_ordre') numeroOrdre !: string
  @field('agent_id') agentId !: string
  @date('created_at') createdAt !: number
  @date('updated_at') updatedAt !: number

  @children('souscriptions') souscriptions !: import('@nozbe/watermelondb').Relation<Souscription>

  static async createClient(data: Client){
  return await database.write(async() =>{

  return  await database.get<Client>('clients').create((client) => {
        client.firstName = data.firstName
        client.lastName = data.lastName
        client.phone = data.phone
        client.numeroOrdre = data.numeroOrdre
        client.agentId = data.agentId
    })
  })
    
  }

}
