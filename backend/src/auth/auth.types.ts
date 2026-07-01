export interface AuthenticatedAdmin {
  id: string;
  email: string;
  role: 'admin';
}

export interface SessionPayload {
  sub: string;
  email: string;
  role: 'admin';
}

