import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';

import { InversionForm } from '../interfaces/inversion-form.interface';

const BASE_URL: String = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class InversionesService {

  public httpOptions:any = {}; 

  constructor( 
              private http: HttpClient
              ) {

    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'x-token': localStorage.getItem('token')}) };

    }

  
  /**
   * Método de servicio para crear inversiones
   * @param formData => Datos del formulario
   * @param idUser => ID del usuario
   */
  public crearInversionService = (formData:any, idUser:number) =>{

    const json = {
      idUs: idUser,
      nombreInver: formData.nombreInver,
      capitalExtra: formData.capitalExtra,
      monedaInver: formData.monedaExtra,
      tasaCambio: formData.tasaCambio,
      capitalCop: formData.capitalCop,
      tasaEA: formData.tasaInteres,
      interesExtra: formData.interesExtra,
      interesCop: formData.interesCop,
      pais: formData.pais,
      rentaExtra: formData.rentaExtra,
      rentaCop: formData.rentaCop,
      tiempo: formData.tiempo,
      descripcion: formData.descripcion,
      estado: formData.estado == true? 1 : 0
    }
    return this.http.post(`${BASE_URL}/insertInversion`, json, this.httpOptions).pipe(
      tap( (resp:any) =>{})
    )


  }



  /**
   * Método de servicio para obtener las inversiones por usuario
   * @param idUs => ID de usuario
   */
  public getInversionesUserService = (idUs:number) =>{

    return this.http.get(`${BASE_URL}/inversiones/${idUs}`, this.httpOptions).pipe(
      map( resp => resp )
    )

  }


  /**
   * Método para obtener todas las inversiones
   */
  public getAllInversionesService = () =>{

    return this.http.get(`${BASE_URL}/inversiones`, this.httpOptions).pipe(
      map( resp => resp )
    )

  }




  /**
   * Método de servicio para actualizar inversiones
   * @param formData => Datos del formulario
   * @param idUser => ID del usuario
   */
  public updateInversionService = (formData:InversionForm, idInversion:string) =>{

    const json = {
      idInversion,
      nombreInver: formData.nombreInver,
      capitalExtra: formData.capitalExtra,
      monedaInver: formData.monedaExtra,
      fecha: formData.fecha,
      tasaCambio: formData.tasaCambio,
      capitalCop: formData.capitalCop,
      tasaEA: formData.tasaInteres,
      interesExtra: formData.interesExtra,
      interesCop: formData.interesCop,
      pais: formData.pais,
      rentaExtra: formData.rentaExtra,
      rentaCop: formData.rentaCop,
      tiempo: formData.tiempo,
      descripcion: formData.descripcion,
      estado: formData.estado == true? 1 : 0
    }
    return this.http.put(`${BASE_URL}/updateInversion`, json, this.httpOptions).pipe(
      tap( (resp:any) =>{})
    )

  }


  /**
   * Método de servicio para crear anexos
   * @param dataForm => Data del formulario
   * @param dataInver => Data de la inversión
   */
  public crearAnexoServices = (dataForm:any, dataInver:any) =>{

    const json = {
      movimiento: dataForm.movimientoAnexo,
      fecha: dataForm.fechaAnexo,
      capitalExtra: dataForm.capitalExtra,
      capitalCop: dataForm.capitalCop,
      interesExtra: dataForm.interesExtra,
      interesCop: dataForm.interesCop,
      capiInterExtra: dataForm.capitalInteresExtra,
      capiInterCop: dataForm.capitalInteresCop,
      comentario: dataForm.comentario,
      idInversion: dataInver.idInversion,
      idUser: dataInver.idUser,
      monedaAnex: dataInver.moneda
    }
    
    return this.http.post(`${BASE_URL}/insertAnexo`, json, this.httpOptions).pipe(
      tap((resp:any) => resp)
    )

  }


  /**
   * Método de servicio para actualizar anexos
   * @param formData => Datos del formulario
   * @param idUser => ID del inverción
   */
  public updateAnexoService = (dataForm:any, idAnexo:string, idInversion:string) =>{

    const json = {
      idAnexo,
      idInversion,
      movimiento: dataForm.movimientoAnexo,
      fecha: dataForm.fechaAnexo,
      capitalExtra: dataForm.capitalExtra,
      capitalCop: dataForm.capitalCop,
      interesExtra: dataForm.interesExtra,
      interesCop: dataForm.interesCop,
      capiInterExtra: dataForm.capitalInteresExtra,
      capiInterCop: dataForm.capitalInteresCop,
      comentario: dataForm.descripcion,
    }
    return this.http.put(`${BASE_URL}/updateAnexo`, json, this.httpOptions).pipe(
      tap( (resp:any) =>{})
    )

  }





  /**
   * Método de servicio para obtener los anexos por id inversión
   * @param idInversion => ID de la inversión
   */
  public getAnexosByIdService = (idInversion:string) => {

    return this.http.get(`${BASE_URL}/anexos/${idInversion}`, this.httpOptions).pipe(
      map( resp => resp )
    )

  }



  /**
   * Método de servicio para obtener los usuarios y sus inversiones
   */
  public getUserInversionService = () =>{
    return this.http.get(`${BASE_URL}/usuariosInversion`, this.httpOptions).pipe(
      map( resp => resp )
    )
  }





}
