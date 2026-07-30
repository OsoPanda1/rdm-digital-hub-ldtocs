export type PQCConfig = {
  algorithm: "kyber512" | "kyber768" | "kyber1024" | "dilithium2" | "dilithium3";
  keySize: number;
  status: "active" | "deprecated";
};

export type PQCSignature = {
  algorithm: string;
  publicKey: string;
  signature: string;
  timestamp: string;
  verified: boolean;
};

export type PQCKeyPair = {
  id: string;
  algorithm: string;
  publicKey: string;
  encryptedSecretKey: string;
  createdAt: string;
  expiresAt?: string;
};
