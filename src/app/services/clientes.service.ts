import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';

import { ClienteForm } from '../interfaces/clientes-form.interface';

const BASE_URL: String = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  public httpOptions:any = {}; 

  constructor( 
              private http: HttpClient
              ) {

    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'x-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTAzOTg2OTUsImV4cCI6MTYxMDQ0MTg5NX0.TtwCXRHfxPFrG4-rU53aiA3HBToN6ILIEckMUwWFeYc'}) };

    }


  
  /**
   * Método de servicio para insertar clientes
   * @param formData => Datos del formulario
   */
  public crearClienteServices = ( formData:ClienteForm ) =>{

    const json = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      email: formData.email,
      telefono: formData.telefono,
      compania: formData.nomCia,
      estado: formData.estado == true? 1 : 0,
    }

    return this.http.post(`${BASE_URL}/insertCliente`, json, this.httpOptions ).pipe(
      tap( (resp:any) =>{

      })
    ) 
    
  }



  /**
   * Método de servicio para insertar usuarios
   * @param formData => Datos del formulario
   */
  public insertUsuarios = (formData: ClienteForm) =>{

    const json = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      estado: formData.estado == true? 1 : 0,
    }

    return this.http.post(`${BASE_URL}/insertUsuario`, json, this.httpOptions).pipe(
      tap( (resp:any) =>{ })
    )
  }




}
