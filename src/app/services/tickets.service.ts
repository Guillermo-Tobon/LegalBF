import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { ClienteForm } from '../interfaces/clientes-form.interface';
const BASE_URL: String = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  public httpOptions:any = {}; 

  constructor(
              private http: HttpClient
  ) {
    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'x-token': localStorage.getItem('token')}) };
  }


  /**
  * Método para creat tickets
  * @param formData => Datos del formulario
  */
  public creatTicketService = ( formData:ClienteForm ) =>{

    return this.http.post(`${BASE_URL}/crearticket`, formData, this.httpOptions).pipe(
      map( resp => resp )
    )

  }

  /**
   * Método de servicio para consultar los ticket por id user
   * @param id => ID de usuario logueado
   */
  public getTicketByIdService = (id:any) =>{
    return this.http.get(`${BASE_URL}/tickets/${id}`, this.httpOptions).pipe(
      map( resp => resp )
    )
  }


  /**
   * Método de servicio para obtener todos los tickets
   */
  public getAllTicketsService = () =>{
    return this.http.get(`${BASE_URL}/alltickets`, this.httpOptions).pipe(
      map( resp => resp )
    )
  }



  /**
   * Método de servicio para eliminar tickets
   * @param idTicket => ID Ticket a eliminar
   */
  public deleteTicketService = (idTicket:any) =>{
    return this.http.delete(`${BASE_URL}/deleteticket/${idTicket}`,  this.httpOptions ).pipe(
      map( resp => resp )
    )
  }



}
