import { Model } from '@nozbe/watermelondb'
import { field, date, relation } from '@nozbe/watermelondb/decorators'
import Souscription from './Souscription'
import Agent from './Agent'

export default class Versement extends Model {
  static table = 'versements'
  static associations = {
    // Add ALL the belongs_to associations for foreign keys
    souscriptions: { type: 'belongs_to', key: 'souscription_id' },
    agents: { type: 'belongs_to', key: 'agent_id' },
  } as const

  // Add the foreign key fields first
  @field('souscription_id') souscriptionId!: string
  @field('agent_id') agentId!: string
  @field('amount') montant!: number
  @date('date_versement') dateVersement!: number
  @date('created_at') createdAt!: number

  // Then add the relations
  @relation('souscriptions', 'souscription_id') souscription!: import('@nozbe/watermelondb').Relation<Souscription>
  @relation('agents', 'agent_id') agent!: import('@nozbe/watermelondb').Relation<Agent>
}