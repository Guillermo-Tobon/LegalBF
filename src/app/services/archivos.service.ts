import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';

const BASE_URL: String = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  public httpOptions:any = {}; 

  constructor( 
              private http: HttpClient
              ) {

    this.httpOptions = { headers: new HttpHeaders({ 'Content-Type':  'application/json', 'x-token': localStorage.getItem('token')}) };

    }


    /**
     * Método de servicio para obtener los archivos por user
     * @param id => ID del usuario
     */
    public getFilesUserService = (id:any) =>{

      return this.http.get(`${BASE_URL}/archivos/${id}`, this.httpOptions).pipe(
        map( resp => resp )
      )

    }


    /**
     * Método de servicio para visualizar el archivo
     * @param extension => Extensión del archivo
     * @param nomFile => Nombre del archivo
     */
    public viewFileService = (extension:any, nomFile:any) =>{

      return this.http.get(`${BASE_URL}/getimagen/${extension}/${nomFile}`, this.httpOptions).pipe(
        map( resp => resp )
      )
    }



    /**
     * Método de servicio para eliminar archivos por id
     * @param id => ID del archivo a eliminar
     */
    public deleleFileService = (id:number) =>{

      return this.http.delete(`${BASE_URL}/deletearchivo/${id}`, this.httpOptions).pipe(
        map(resp => resp )
      )

    }

}
