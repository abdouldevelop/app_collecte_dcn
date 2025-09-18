import { Model } from '@nozbe/watermelondb'

class Post extends Model {
  static table = 'posts'

  static associations = {
    comments: { type: 'has_many', foreignKey: 'post_id' },
  }

  // Define columns using WatermelonDB schema, not decorators
}

export default Post