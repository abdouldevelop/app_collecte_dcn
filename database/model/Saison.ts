import { Model } from '@nozbe/watermelondb'
import { field, date, children } from '@nozbe/watermelondb/decorators'
import Kit from './Kit'

export default class Saison extends Model {
  static table = 'saisons'
  static associations = {
    kits: { type: 'has_many' as const, foreignKey: 'saison_id' },
  }

  @field('label') label !: string
  @date('start') start !: number
  @date('end') end !: number
  @field('active') active !: boolean

  @children('kits') kits !: import('@nozbe/watermelondb').Query<Kit>
}
