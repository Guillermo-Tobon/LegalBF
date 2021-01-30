import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { ArchivosService } from 'src/app/services/archivos.service';
import { AuthService } from 'src/app/services/auth.service';
import { InversionesService } from 'src/app/services/inversiones.service';

@Component({
  selector: 'app-detalle-inversion',
  templateUrl: './detalle-inversion.component.html',
  styleUrls: ['./detalle-inversion.component.css']
})
export class DetalleInversionComponent implements OnInit {

  public usuario:any[] = [];
  public inversion:any[] = [];
  public archivos:any[] = [];
  public editInversion:{} = {};
  public FormEditInversion:any;
  public formSubmitted = false;

  constructor(
              private routeActive: ActivatedRoute,
              private archivosServ: ArchivosService,
              private InversionServ: InversionesService,
              private authServ: AuthService,
              private location: Location,
              private router: Router,
              private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.usuario = this.authServ.usuario;

    this.routeActive.params.subscribe( data =>{
      this.inversion = JSON.parse( data['inversion'] ) || [];

      this.getArchivosUserInversion(this.inversion['id_inv'], this.inversion['id_us_inv']);

      this.cargarFormEditInver(this.inversion);

    })
  }


  /**
   * Método de servicio para obtener los archivos por user e inversión
   * @param idInver => ID inversión
   * @param id => ID del usuario 
   */
  public getArchivosUserInversion = (idInver:string, idUs:number) =>{
    this.archivosServ.getFilesInverUserService(idInver, idUs).subscribe( (resp:any) =>{

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

      //window.open(resp.pathFile, "_blank");
      window.open(`http://127.0.0.1:8887/${archivo.tipo_archivo_info}/${archivo.nom_archivo_info}`, "_blank");
    
    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })

  }



  /**
   * Método para eliminar archivo por id
   * @param archivo => Objeto archivo a eliminar 
   */
  public eliminarArchivo = (archivo:any) =>{

    Swal.fire({
      text: "¿Realmente desea eliminar el archivo " + archivo.nom_archivo_info + "?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.archivosServ.deleleFileService(archivo.tipo_archivo_info, archivo.nom_archivo_info, archivo.id_info).subscribe( (resp:any) =>{
          
          if ( resp.ok ) {
            Swal.fire('Bien hecho!', resp.msg, 'success');
            setTimeout(() => { window.location.reload(); }, 2000);
          }
    
        }, (err) =>{
          //En caso de un error
          Swal.fire('Error', err.error.msg, 'error');
        })
      }
    })
    
  }



  /**
   * Método para cargar el modal de editar inversión
   * @param inversion => Inversión a editar
   */
  public modalEditInvert = (inversion:any) =>{
    this.editInversion = inversion;
  }


  /**
   * Método para actualizar la inversión
   * @param idInversion => ID inversión
   */
  public editarInversion = ( idInversion:string ) =>{

    this.InversionServ.updateInversionService( this.FormEditInversion.value, idInversion ).subscribe( (resp:any) =>{

      if( resp.ok ){
        Swal.fire('Bien hecho!', resp.msg, 'success');
        setTimeout(() => { 
          this.router.navigate(['dashboard/inversiones']); 
          window.location.reload();
        }, 2000);
      }

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })

  }



  /**
   * Método para cargar el formulario de editar inversión
   * @param inversion => Objeto de inversión a editar
   */
  public cargarFormEditInver = (inversion:any) =>{
    this.FormEditInversion = this.fb.group({
      nombreInver: [inversion['nombre_inv'], [Validators.required, Validators.minLength(5)]],
      capital: [inversion['capital_inv'], [Validators.required, Validators.minLength(3)]],
      moneda: [inversion['moneda_inv'], [Validators.required]],
      tiempo: [inversion['tiempo_inv'], [Validators.required, Validators.minLength(2)]],
      tasainteres: [inversion['tasa_ea_inv'], [Validators.required, Validators.minLength(1)]],
      pais: [inversion['pais_inv'], [Validators.required, Validators.minLength(3)]],
      descripcion: [inversion['descripcion_inv'], [Validators.required, Validators.minLength(20)]],
      estado: [inversion['estado_inv'] == 1? true : false, [Validators.required]],
    })
  }


  goBack(){
    this.location.back();
  }

}
