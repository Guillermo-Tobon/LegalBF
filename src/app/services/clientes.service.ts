import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, ɵConsole } from '@angular/core';
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

    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'x-token': localStorage.getItem('token')}) };

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
      compania: formData.compania,
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
  public insertUsuariosServices = (formData: ClienteForm) =>{

    const json = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      compania: formData.compania,
      descripcion: formData.descripcion,
      estado: formData.estado == true? 1 : 0,
    }

    return this.http.post(`${BASE_URL}/insertUsuario`, json, this.httpOptions).pipe(
      tap( (resp:any) =>{ })
    )
  }



  /**
   * Método de servicio para obtener los usuarios
   */
  public getUsuariosService = () =>{
    return this.http.get(`${BASE_URL}/usuarios`, this.httpOptions).pipe(
      map( data => data )
    )
  }



  /**
   * Método de servicio para actualizar el cliente
   * @param formData => Información del formulario
   */
  public updateClienteService = (formData:ClienteForm) =>{

    const json = {
      id: formData.id,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      email: formData.email,
      telefono: formData.telefono,
      compania: formData.compania,
      descripcion: formData.descripcion,
      estado: formData.estado === true? 1: 0
    }

    return this.http.put(`${BASE_URL}/updateCliente`, json, this.httpOptions).pipe(
      map( resp => resp )
    )

  }


  /**
   * Método de servicio para enviar correos
   * @param formData => información del cliente
   */
  public sendEmailClienteService = (formData:any) =>{

    return this.http.post(`${BASE_URL}/email`, formData, this.httpOptions).pipe(
      map( resp => resp )
    )

  }




}
