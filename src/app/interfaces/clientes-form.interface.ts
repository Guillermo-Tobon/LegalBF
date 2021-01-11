export interface ClienteForm {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  password: string;
  passwordConfir?: string;
  nomCia: string;
  estado: boolean;
}