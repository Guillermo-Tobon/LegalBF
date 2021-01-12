export interface ClienteForm {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  compania: string;
  password: string;
  passwordConfir?: string;
  nomCia: string;
  estado: boolean;
}