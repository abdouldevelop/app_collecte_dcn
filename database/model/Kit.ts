// Updated Kit model - Fixed associations
import { Model } from '@nozbe/watermelondb'
import { field, date, relation, children } from '@nozbe/watermelondb/decorators'
import Saison from './Saison'
import Souscription from './Souscription'

export default class Kit extends Model {
  static table = 'kits'
  
  // Make sure the table names match exactly with your other models
  static associations = {
    saisons: { type: 'belongs_to', key: 'saison_id' },
    souscriptions: { type: 'has_many', foreignKey: 'kit_id' },
  }

  @field('label') label !: string
  @field('saison_id') saisonId !: string
  @field('amount') montantTotal !: number
  @date('created_at') createdAt !: number

  @relation('saisons', 'saison_id') saison !: import('@nozbe/watermelondb').Relation<Saison>
  @children('souscriptions') souscriptions !: import('@nozbe/watermelondb').Relation<Souscription>
}
