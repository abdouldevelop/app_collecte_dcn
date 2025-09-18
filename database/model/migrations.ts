import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        {
          type: 'add_columns',
          table: 'clients',
          columns: [
            { name: 'agent_id', type: 'number' },
          ],
        },
      ],
    },
  ],
})