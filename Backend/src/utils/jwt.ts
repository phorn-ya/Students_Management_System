import jwt, {
  type Secret,
  type JwtPayload as JwtPayloadType,
  type SignOptions,
} from 'jsonwebtoken';

const JWT_SECRET: Secret =
  process.env.JWT_SECRET ||
  'your-secret-key-change-in-production';

const JWT_EXPIRY =
  process.env.JWT_EXPIRY || '7d';

export interface JwtPayload
  extends JwtPayloadType {

  id: number;
  username: string;
  email: string;
  role: string;
}

// Generate JWT token
export const generateToken = (
  payload: JwtPayload
): string => {

  const options: SignOptions = {
    expiresIn: JWT_EXPIRY as jwt.SignOptions['expiresIn'],
  };

  return jwt.sign(
    payload,
    JWT_SECRET,
    options
  );
};

// Verify JWT token
export const verifyToken = (
  token: string
): JwtPayload | null => {

  try {

    return jwt.verify(
      token,
      JWT_SECRET
    ) as JwtPayload;

  } catch (error) {

    console.error(
      'JWT Verification Error:',
      error
    );

    return null;
  }
};

// Decode token without verification
export const decodeToken = (
  token: string
): JwtPayload | null => {

  try {

    return jwt.decode(
      token
    ) as JwtPayload;

  } catch (error) {

    return null;
  }
};