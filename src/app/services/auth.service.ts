import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';

const BASE_URL: String = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public httpOptions:any = {}; 

  constructor( 
              private http: HttpClient
    ) {

  this.httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json'}) };

  }

  /**
   * Método de servicio para login de usuario
   * @param formData => Datos del formulario
   */
  public loginService = (formData:any) =>{

    return this.http.post(`${BASE_URL}/loginUser`, formData, this.httpOptions).pipe(
      map( resp => resp )
    )

  }




}
