import {z} from "zod";

export const newClientSchema = z.object({
  firstName: z.string().min(2, 'Le prenom est requis'),
  lastName: z.string().min(2, 'Le nom de famille est requis'),
  phone: z
    .string()
    .min(10, 'Le numero de telephone est trop court')
    .max(15, 'Le numero de telephone est trop long'),
  address: z.string().optional(),
});

export type ClientSchemaData = z.infer<typeof newClientSchema>;

/** @deprecated Use newClientSchema instead */
export const newClentSchema = newClientSchema;

 export const loginSchema = z.object({
 password: z.string().min(4, 'L\'adresse est trop courte'),
 phone: z.string().min(10, 'Le numéro de téléphone est trop court'),
})

export type LoginSchemaData = z.infer<typeof loginSchema>
