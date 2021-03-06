import { Component, OnInit, ɵConsole } from '@angular/core';
import Swal from 'sweetalert2';
import { ArchivosService } from 'src/app/services/archivos.service';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-documentacion',
  templateUrl: './documentacion.component.html',
  styleUrls: ['./documentacion.component.css']
})
export class DocumentacionComponent implements OnInit {

  public usuario:any[] = [];
  public archivos:any[] = [];

  constructor(
              private authServ: AuthService,
              private archivosServ: ArchivosService,
              private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario;

    if ( this.usuario[0].admin_us === 'Y' ) {
      this.getAllArchivos();
      
    } else {
      this.getArchivosUserById(this.usuario[0].id_us);

    }

    this.translate.use(localStorage.getItem('idioma'));

  }



  /**
   * Método para obtener los archivos
   */
  public getAllArchivos = () =>{

    this.archivosServ.getAllFilesService().subscribe( (resp:any) =>{

      this.archivos = resp.archivos || [];  

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })

  }



  /**
   * Método para consultar los archivos por usuario
   * @param idUser => ID del usuario
   */
  public getArchivosUserById = (idUser:any) =>{

    this.archivosServ.getFilesUserService(idUser).subscribe( (resp:any) =>{

      this.archivos = resp.archivos || [];  

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })

  }




  /**
   * Método para visualizar archivo por id
   * @param archivo => Objeto archivo a visualizar 
   */
  public verArchivo = (archivo:any) =>{

    this.archivosServ.viewFileService( archivo.tipo_archivo_info, archivo.nom_archivo_info ).subscribe( (resp:any) =>{

      const urlFile = `https://files.clientslegalbf.com/${archivo.tipo_archivo_info}/${archivo.nom_archivo_info}`;
      window.open(urlFile, "_blank");
    
    }, (err) =>{
      //En caso de un error
      const urlFile = `https://files.clientslegalbf.com/file-malo.png`;
      window.open(urlFile, "_blank");
    })

  }



  /**
   * Método para eliminar archivo por id
   * @param archivo => Objeto archivo a eliminar 
   */
  public eliminarArchivo = (archivo:any) =>{

    let traText;
    let traButton;
    let traSuccess;
    let traError;
    this.translate.get('reallyDeleteFile').subscribe((res: string) =>{traText = res});
    this.translate.get('YesDelete').subscribe((res: string) =>{traButton = res});
    this.translate.get('Success').subscribe((res: string) =>{traSuccess = res});
    this.translate.get('Error').subscribe((res: string) =>{traError = res});

    Swal.fire({
      text: `${traText} ${archivo.nom_archivo_info}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${traButton}`
    }).then((result) => {
      if (result.isConfirmed) {
        this.archivosServ.deleleFileService(archivo.tipo_archivo_info, archivo.nom_archivo_info, archivo.id_info).subscribe( (resp:any) =>{
          
          if ( resp.ok ) {
            Swal.fire(`${traSuccess}`, resp.msg, 'success');
            this.getAllArchivos();
          }
    
        }, (err) =>{
          //En caso de un error
          Swal.fire(`${traError}`, err.error.msg, 'error');
        })
      }
    })
    
  }




}
