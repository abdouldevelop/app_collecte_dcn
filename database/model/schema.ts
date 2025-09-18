import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const schema = appSchema({
  version: 2,
  tables: [
    tableSchema({
      name: 'clients',
      columns: [
        { name: 'first_name', type: 'string' },
        { name: 'last_name', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'numero_ordre', type: 'string', isOptional: true },
        { name: 'agent_id', type: 'string' , },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number', },
      ],
    }),
    tableSchema({
      name: 'saisons',
      columns: [
        { name: 'label', type: 'string' },
        { name: 'start', type: 'number' },
        { name: 'end', type: 'number' },
        { name: 'active', type: 'boolean', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'kits',
      columns: [
        { name: 'label', type: 'string' },
        { name: 'saison_id', type: 'string', isIndexed: true },
        { name: 'amount', type: 'number' },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'souscriptions',
      columns: [
        { name: 'client_id', type: 'string', isIndexed: true },
        { name: 'kit_id', type: 'string', isIndexed: true },
        { name: 'saison_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'statut', type: 'string' },
      ],
    }),
    tableSchema({
      name: 'versements',
      columns: [
        { name: 'souscription_id', type: 'string', isIndexed: true },
        { name: 'amount', type: 'number' },
        { name: 'date_versement', type: 'number' },
        { name: 'agent_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'agents',
      columns: [
        { name: 'last_name', type: 'string' },
        { name: 'first_name', type: 'string' },
        { name: 'phone', type: 'string' },
      ],
    }),
    // tableSchema({
    //   name: 'utilisateurs',
    //   columns: [
    //     { name: 'nom_utilisateur', type: 'string' },
    //     { name: 'mot_de_passe', type: 'string' },
    //     { name: 'role', type: 'string' },
    //     { name: 'agent_id', type: 'string', isOptional: true, isIndexed: true },
    //   ],
    // }),
  ],
})
