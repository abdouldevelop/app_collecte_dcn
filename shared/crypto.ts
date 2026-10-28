import * as Crypto from 'expo-crypto';

/**
 * Hache un secret (mot de passe) en SHA-256.
 * Utilisé pour vérifier le mot de passe hors-ligne sans jamais le stocker en clair.
 */
export async function hashSecret(secret: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, secret);
}
