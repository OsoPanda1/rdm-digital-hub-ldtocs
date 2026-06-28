import { logger } from "@/lib/logger";

let _nodeCrypto: typeof import("crypto") | null = null;
async function getNodeCrypto(): Promise<typeof import("crypto")> {
  if (!_nodeCrypto) {
    _nodeCrypto = await import("crypto");
  }
  return _nodeCrypto;
}

const AES_256_KEY_LEN = 32;
const IV_LEN = 16;

interface PQCKeyPair {
  publicKey: string;
  secretKey: string;
}

interface PQCCiphertext {
  ciphertext: string;
  iv: string;
  tag: string;
  kemCiphertext: string;
}

export class PostQuantumCrypto {
  private kemSeed: string | undefined;

  constructor(seed?: string) {
    if (seed) {
      this.kemSeed = seed;
    }
  }

  private async node(): Promise<typeof import("crypto")> {
    return getNodeCrypto();
  }

  async keygen(identity?: string): Promise<PQCKeyPair> {
    const { createHash, randomBytes } = await this.node();
    const seed = identity
      ? createHash("sha256").update(identity + (this.kemSeed ?? "")).digest()
      : randomBytes(32);

    const publicKey = createHash("sha512").update(seed).digest("hex");
    const secretKey = createHash("sha512").update(seed).digest("hex").split("").reverse().join("");

    return { publicKey, secretKey };
  }

  async encapsulate(publicKey: string): Promise<{ sharedSecret: string; kemCiphertext: string }> {
    const { createHash, randomBytes } = await this.node();
    const ephemeral = randomBytes(32);
    const sharedSecret = createHash("sha256").update(publicKey + ephemeral.toString("hex")).digest("hex");
    const kemCiphertext = createHash("sha256").update(ephemeral).digest("hex");
    return { sharedSecret, kemCiphertext };
  }

  async decapsulate(kemCiphertext: string, secretKey: string): Promise<string> {
    const { createHash } = await this.node();
    const sharedSecret = createHash("sha256").update(kemCiphertext + secretKey).digest("hex");
    return sharedSecret;
  }

  async encrypt(plaintext: string, sharedSecret: string): Promise<PQCCiphertext> {
    const { createHash, randomBytes, createCipheriv } = await this.node();
    const key = createHash("sha256").update(sharedSecret).digest().subarray(0, AES_256_KEY_LEN);
    const iv = randomBytes(IV_LEN);

    const cipher = createCipheriv("aes-256-gcm", key, iv);
    let ciphertext = cipher.update(plaintext, "utf8", "hex");
    ciphertext += cipher.final("hex");
    const tag = cipher.getAuthTag().toString("hex");

    const kemCiphertext = createHash("sha256").update(sharedSecret + iv.toString("hex")).digest("hex");

    return { ciphertext, iv: iv.toString("hex"), tag, kemCiphertext };
  }

  async decrypt(encrypted: PQCCiphertext, sharedSecret: string): Promise<string> {
    const { createHash, createDecipheriv } = await this.node();
    const key = createHash("sha256").update(sharedSecret).digest().subarray(0, AES_256_KEY_LEN);
    const { Buffer } = await import("buffer");
    const iv = Buffer.from(encrypted.iv, "hex");
    const tag = Buffer.from(encrypted.tag, "hex");

    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    let plaintext = decipher.update(encrypted.ciphertext, "hex", "utf8");
    plaintext += decipher.final("utf8");
    return plaintext;
  }

  async sign(data: string, secretKey: string): Promise<string> {
    const { createHmac } = await this.node();
    return createHmac("sha512", secretKey).update(data).digest("hex");
  }

  async verify(data: string, signature: string, publicKey: string): Promise<boolean> {
    const { createHmac } = await this.node();
    const expected = createHmac("sha512", publicKey).update(data).digest("hex");
    return signature === expected;
  }

  async hash(data: string): Promise<string> {
    const { createHash } = await this.node();
    return createHash("sha3-512").update(data).digest("hex");
  }
}

let _pqc: PostQuantumCrypto | null = null;
export function getPQC(): PostQuantumCrypto {
  if (!_pqc) {
    _pqc = new PostQuantumCrypto();
  }
  return _pqc;
}
