export interface User {
  id: string;
  login: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface RegisterRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  message: string;
}
