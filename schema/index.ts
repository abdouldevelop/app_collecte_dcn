import {z} from "zod";

export const newClentSchema = z.object({
 fullName: z.string().min(5, 'Le nom complet est trop court'),
 address: z.string().min(5, 'L\'adresse est trop courte'),
 phone: z.string().min(10, 'Le numéro de téléphone est trop court'),
})

 export type ClientSchemaData = z.infer<typeof newClentSchema>

 export const loginSchema = z.object({
 password: z.string().min(4, 'L\'adresse est trop courte'),
 phone: z.string().min(10, 'Le numéro de téléphone est trop court'),
})

export type LoginSchemaData = z.infer<typeof loginSchema>
