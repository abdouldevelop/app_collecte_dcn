import { Model } from '@nozbe/watermelondb'
import { field, children } from '@nozbe/watermelondb/decorators'
import Versement from './versement'

export default class Agent extends Model {
  static table = 'agents'
  static associations = {
    versements: { type: "has_many" as const, foreignKey: 'agent_id' },
  }

  @field('first_name')firstName !: string
  @field('last_name') lastName !: string
  @field('phone') phone !: string

  @children('versements') versements!: import('@nozbe/watermelondb').Query<Versement>
}
