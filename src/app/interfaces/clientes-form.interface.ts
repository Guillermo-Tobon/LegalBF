export interface ClienteForm {
  id?: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  compania: string;
  descripcion: string;
  password: string;
  passwordConfir?: string;
  nomCia: string;
  estado: boolean;
}