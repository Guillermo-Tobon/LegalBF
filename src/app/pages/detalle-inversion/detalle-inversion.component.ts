import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { ArchivosService } from 'src/app/services/archivos.service';
import { AuthService } from 'src/app/services/auth.service';
import { InversionesService } from 'src/app/services/inversiones.service';
import { ClientesService } from 'src/app/services/clientes.service';


@Component({
  selector: 'app-detalle-inversion',
  templateUrl: './detalle-inversion.component.html',
  styleUrls: ['./detalle-inversion.component.css']
})
export class DetalleInversionComponent implements OnInit {


  public usuario:any[] = [];
  public userAsociado:any[] = [];
  public inversion:any[] = [];
  public archivos:any[] = [];
  public anexos:any[] = [];
  public editInversion:{} = {};
  public FormEditInversion:any;
  public formSubmitted = false;
  public archivoSubir:File;

  constructor(
              private routeActive: ActivatedRoute,
              private archivosServ: ArchivosService,
              private InversionServ: InversionesService,
              private clientesSrv: ClientesService,
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

      this.getAnexosByIdInver(this.inversion['id_inv']);

      this.getUserById(this.inversion['id_us_inv']);


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
  public verArchivo = (tipoFile:any, nomFile:any) =>{

    this.archivosServ.viewFileService( tipoFile, nomFile ).subscribe( (resp:any) =>{

      const urlFile = `http://files.clientslegalbf.com/${tipoFile}/${nomFile}`;
      window.open(urlFile, "_blank");
    
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
      text: "¿You really want to delete the file " + archivo.nom_archivo_info + "?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.archivosServ.deleleFileService(archivo.tipo_archivo_info, archivo.nom_archivo_info, archivo.id_info).subscribe( (resp:any) =>{
          
          if ( resp.ok ) {
            Swal.fire('Success!', resp.msg, 'success');
            this.getArchivosUserInversion(this.inversion['id_inv'], this.inversion['id_us_inv']);
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
    this.formSubmitted = true;

    if ( this.FormEditInversion.invalid ) {
      return; 
    }

    this.InversionServ.updateInversionService( this.FormEditInversion.value, idInversion ).subscribe( (resp:any) =>{

      if( resp.ok ){
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: resp.msg,
          showConfirmButton: true,
          timer: 1800
        });
        this.router.navigate(['dashboard/inversiones']);
        setTimeout(() => { window.location.reload(); }, 2000);
      }

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })

  }



  /**
   * Método para obtener los anexos
   * @param idInversion => ID inversión
   */
  public getAnexosByIdInver = (idInversion:string) =>{

    this.InversionServ.getAnexosByIdService(idInversion).subscribe( (resp:any) =>{
      
      this.anexos = resp.anexos || [];
      
    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    });
  }





  /**
   * Método para cargar el formulario de editar inversión
   * @param inversion => Objeto de inversión a editar
   */
  public cargarFormEditInver = (inversion:any) =>{
    this.FormEditInversion = this.fb.group({
      nombreInver: [inversion['nombre_inv'], [Validators.required, Validators.minLength(3)]],
      capitalExtra: [inversion['capital_extra_inv'], [Validators.required]],
      monedaExtra: [inversion['moneda_extra_inv'], [Validators.required]],
      tasaCambio: [inversion['tasa_cambio_inv'], [Validators.required]],
      capitalCop: [inversion['capital_cop_inv'], [Validators.required]],
      tasaInteres: [inversion['tasa_ea_inv'], [Validators.required, Validators.minLength(1)]],
      interesExtra: [inversion['interes_extra_inv'], [Validators.required, Validators.minLength(1)]],
      interesCop: [inversion['interes_cop_inv'], [Validators.required, Validators.minLength(1)]],
      pais: [inversion['pais_inv'], [Validators.required, Validators.minLength(3)]],
      rentaExtra: [inversion['renta_extra_inv'], [Validators.required]],
      rentaCop: [inversion['renta_cop_inv'], [Validators.required]],
      tiempo: [inversion['tiempo_inv'], [Validators.required]],
      descripcion: [inversion['descripcion_inv'], [Validators.required, Validators.minLength(20)]],
      estado: [inversion['estado_inv'] == 1? true : false, [Validators.required]],
    })
  }


  /**
   * Método para validar el campo del formulario
   * @param campo => valor del campo a validar
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.FormEditInversion.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }



  /**
  * Método para obtener usuario pot id
  * @param idUser => ID del usuario a consultar
  */
  public getUserById = (idUse:any) =>{
    this.clientesSrv.getUserByIdService( idUse ).subscribe( (resp:any) =>{

      this.userAsociado = resp.usuario || [];

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })
  }




  /**
   * Método para navegar a crear anexos
   */
  public navegarCrearAnexo = () =>{

    const inver = JSON.stringify(this.inversion);
    this.router.navigate(['dashboard/crear-anexo', inver]);

  }


  /**
   * Método para navegar a detalle anexo
   */
  public navegarAnexo = (anexo:any) =>{

    const obAnexo = JSON.stringify(anexo);
    this.router.navigate(['dashboard/detalle-anexo', obAnexo]);

  }



  goBack(){
    this.location.back();
  }

}
