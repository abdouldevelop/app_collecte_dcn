export interface CreateClientParams {
  firstName: string;
  lastName: string;
  phone: string;
  numeroOrdre: string;
  agentId: number;
}

export type TError = {
    error: string;
    statusCode: number;
    message: string;
  }

 export interface  IAgent {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    adminId: string | null;
    // versements: IVersement[];
    // clients: IClient[];
  }

  export interface IAuth  {
    agent: IAgent;
    token: string;
  }


  export interface  IClient {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    numeroOrdre: string;
    agentId: string;
    agent: IAgent;
    createdAt: Date;
    updatedAt: Date;
    souscriptions: ISouscription[];
  }
  
  export interface  ISaison {
    id: string;
    label: string;
    start: Date;
    end: Date;
    active: boolean;
    kits: IKit[];
    Souscription: ISouscription[];
  }
  
  export interface  IKit {
    id: string;
    label: string;
    saisonId: string;
    saison: ISaison;
    amount: number;
    createdAt: Date;
    souscriptions: ISouscription[];
  }
  
  export interface  ISouscription {
    id: string;
    clientId: string;
    client: IClient;
    kitId: string;
    kit: IKit;
    saisonId: string;
    saison: ISaison;
    statut: string;
    createdAt: Date;
    versements: IVersement[];
  }
  
  export interface  IVersement {
    id: string;
    souscriptionId: string;
    souscription: ISouscription;
    agentId: string;
    agent: IAgent;
    amount: number;
    dateVersement: Date;
    createdAt: Date;
  }

  
