// src/lib/api.ts
import ky, { Options, TimeoutError, HTTPError } from "ky";
import { getStorageItem, removeStorageItem } from "@/storage/MMKV";
import { agentStore } from "@/storage/MMKV";

const apiUrl = process.env.EXPO_PUBLIC_BASE_URL;

const api = ky.create({
  prefixUrl: apiUrl,
  timeout: 10000, // 10s
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      async (request) => {
        // Une connexion doit toujours être faite sans le jeton potentiellement
        // expiré du compte précédent.
        if (request.url.includes('agents/login')) return;
        const user = getStorageItem("USER");
        // L'API a existé avec les deux formes { token } et { data: { token } }.
        const token = user?.token ?? user?.data?.token;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
   afterResponse: [
  async (request, options, response) => {
    // Si le serveur répond 401, le token a expiré. On ferme la session mais on
    // conserve la base et son propriétaire : une reconnexion du même compte
    // peut reprendre la synchronisation, sans exposer ces données à un autre.
    if (response.status === 401 && !request.url.includes('agents/login')) {
      removeStorageItem("USER");
      agentStore.getState().logout();
      return response;
    }

    if (!response.ok) {
      let errorBody: any = null;
      try {
        errorBody = await response.clone().json();
      } catch {
        try {
          errorBody = await response.clone().text();
        } catch {
          errorBody = null;
        }
      }

      const customError: any = new HTTPError(response, request, options);
      customError.parsedBody = errorBody;
      throw customError;
    }
    return response;
  },
   ],
  },
});

// Utility wrapper
export const http = {
  get: <T>(url: string, options?: Options) => api.get(url, options).json<T>(),
  post: <T>(url: string, json?: any, options?: Options) =>
    api.post(url, { json, ...options }).json<T>(),
  put: <T>(url: string, json?: any, options?: Options) =>
    api.put(url, { json, ...options }).json<T>(),
  patch: <T>(url: string, json?: any, options?: Options) =>
    api.patch(url, { json, ...options }).json<T>(),
  delete: <T>(url: string, options?: Options) =>
    api.delete(url, options).json<T>(),
};
