import { SignJWT, jwtVerify } from 'jose';

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET není nastaven v env proměnných');
  return new TextEncoder().encode(secret);
};

export async function signToken(payload: { userId: string; username: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<{ userId: string; username: string }> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as { userId: string; username: string };
}
