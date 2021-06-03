import { Request, Response, NextFunction } from 'express';

import jwt from 'express-jwt';
import jwks from 'jwks-rsa';

const jwtSecret = jwks.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: 'https://dev-yb9ojl7i.us.auth0.com/.well-known/jwks.json',
});

var jwtCheck = jwt({
  secret: jwtSecret,
  audience: 'quote.bosibackend.com',
  issuer: 'https://dev-yb9ojl7i.us.auth0.com/',
  algorithms: ['RS256'],
  requestProperty: 'body.user',
});

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const path = req.originalUrl;

  if (path === '/api/login') {
    next();
    return;
  } else if (path === '/api/users' && req.method === 'POST') {
    next();
    return;
  } else if (path.includes('doc')) {
    next();
    return;
  }

  jwtCheck(req, res, next);
};
