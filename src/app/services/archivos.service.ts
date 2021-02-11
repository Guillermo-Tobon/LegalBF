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
     * Método de servicio para subir archivos por usuario
     * @param idUser => ID de usuario
     */
    public uploadFilesServices = async(archivo:File, idInver:string, idAnexo:any, idUser:Number) =>{

      const url = `${BASE_URL}/uploadfile/${idInver}/${idAnexo}/${idUser}`;
      const formData = new FormData();
      formData.append( 'archivo', archivo );

      const resp = await fetch( url, {
        method: 'PUT',
        body: formData,
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'x-token': localStorage.getItem('token')
        }
      });

      const data = resp.json();
      return data;

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
    * Método de servicio para obtener todos los archivos
    */
    public getAllFilesService = () =>{

      return this.http.get(`${BASE_URL}/archivos`, this.httpOptions).pipe(
        map( resp => resp )
      )

    }




    /**
     * Método de servicio para obtener los archivos por user e inversión
     * @param idInver => ID inversión
     * @param id => ID del usuario 
     */
    public getFilesInverUserService = (idInver:string, id:any) =>{

      return this.http.get(`${BASE_URL}/archivos/${idInver}/${id}`, this.httpOptions).pipe(
        map( resp => resp )
      )

    }


    /**
     * Método de servicio para visualizar el archivo
     * @param extension => Extensión del archivo
     * @param nomFile => Nombre del archivo
     */
    public viewFileService = (extension:any, nomFile:any) =>{

      return this.http.get(`${BASE_URL}/getarchivo/${extension}/${nomFile}`, this.httpOptions).pipe(
        map( resp => resp )
      )
    }



    /**
     * Método de servicio para eliminar archivos por id
     * @param id => ID del archivo a eliminar
     */
    public deleleFileService = (extension:string, nomFile:string, id:number) =>{

      return this.http.delete(`${BASE_URL}/deletearchivo/${extension}/${nomFile}/${id}`, this.httpOptions).pipe(
        map(resp => resp )
      )

    }

}
