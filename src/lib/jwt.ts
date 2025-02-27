import { JWTPayload, SignJWT, jwtVerify } from "jose";
const secretKey = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function signJwtToken(payload: JWTPayload, expiresIn = "7d") {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .setIssuedAt()
    .sign(secretKey);
}

export async function verifyJwtToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
}
