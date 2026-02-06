import crypto from "crypto";

const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "change-me";
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? ADMIN_PASSWORD;
const TOKEN_TTL_SECONDS = 60 * 60 * 24; // 24h

type TokenPayload = {
  sub: string;
  exp: number;
};

function base64UrlEncode(input: string) {
  return Buffer.from(input).toString("base64url");
}

function base64UrlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(value: string) {
  return crypto.createHmac("sha256", ADMIN_SECRET).update(value).digest("base64url");
}

export function verifyAdminCredentials(username: string, password: string) {
  return username === ADMIN_USER && password === ADMIN_PASSWORD;
}

export function createAdminToken() {
  const payload: TokenPayload = {
    sub: ADMIN_USER,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS
  };
  const payloadEncoded = base64UrlEncode(JSON.stringify(payload));
  const signature = sign(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export function parseAdminToken(token: string | null) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadEncoded, signature] = parts;
  if (sign(payloadEncoded) !== signature) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(payloadEncoded)) as TokenPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function isAdminFromCookie(cookieHeader: string | null) {
  const token = cookieHeader
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("admin_session="))
    ?.split("=")[1];

  return Boolean(parseAdminToken(token ?? null));
}

export function getAdminCookie() {
  const token = createAdminToken();
  return `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${TOKEN_TTL_SECONDS}`;
}

export function clearAdminCookie() {
  return "admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0";
}
