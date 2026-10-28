import { Model } from '@nozbe/watermelondb'
import { field, date, relation, children } from '@nozbe/watermelondb/decorators'
import Client from './Client'
import Kit from './Kit'
import Saison from './Saison'
import Versement from './versement'

export default class Souscription extends Model {
  static table = 'souscriptions'
  static associations = {
    // Add ALL the belongs_to associations for foreign keys
    clients: { type: 'belongs_to', key: 'client_id' },
    kits: { type: 'belongs_to', key: 'kit_id' },
    saisons: { type: 'belongs_to', key: 'saison_id' },
    // Keep the has_many association
    versements: { type: 'has_many', foreignKey: 'souscription_id' },
  } as const

  // Add the foreign key fields first
  @field('client_id') clientId !: string
  @field('kit_id') kitId !: string
  @field('saison_id') saisonId !: string
  @field('statut') statut !: string
  @date('created_at') createdAt !: number

  // Then add the relations
  @relation('clients', 'client_id') client !: import('@nozbe/watermelondb').Relation<Client>
  @relation('kits', 'kit_id') kit !: import('@nozbe/watermelondb').Relation<Kit>
  @relation('saisons', 'saison_id') saison !: import('@nozbe/watermelondb').Relation<Saison>
  @children('versements') versements !: import('@nozbe/watermelondb').Query<Versement>
}