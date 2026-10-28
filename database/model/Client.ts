import { Model } from '@nozbe/watermelondb'
import { field, date, children } from '@nozbe/watermelondb/decorators'
import Souscription from './Souscription'

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

  @children('souscriptions') souscriptions !: import('@nozbe/watermelondb').Query<Souscription>
}
