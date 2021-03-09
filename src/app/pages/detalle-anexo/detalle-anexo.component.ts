import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { ClientesService } from 'src/app/services/clientes.service';
import { AuthService } from 'src/app/services/auth.service';
import { ArchivosService } from 'src/app/services/archivos.service';
import { FormBuilder, Validators } from '@angular/forms';
import { InversionesService } from 'src/app/services/inversiones.service';

@Component({
  selector: 'app-detalle-anexo',
  templateUrl: './detalle-anexo.component.html',
  styleUrls: ['./detalle-anexo.component.css']
})
export class DetalleAnexoComponent implements OnInit {

  public anexo:any[] = [];
  public usuario:any[] = [];
  public userAsociado:any[] = [];
  public editAnexo:{} = {};
  public FormEditarAnexo:any;
  public formSubmitted = false;
  public cambiarFile:String = 'hiddenInputFile';
  public archivoSubir:File;

  constructor(
              private routeActive: ActivatedRoute,
              private location: Location,
              private authServ: AuthService,
              private archivosServ: ArchivosService,
              private clientesSrv: ClientesService,
              private InversionServ: InversionesService,
              private router: Router,
              private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.usuario = this.authServ.usuario;

    this.routeActive.params.subscribe( data =>{
      this.anexo = JSON.parse( data['anexo'] ) || [];

      console.log(this.anexo)

      this.getUserById(this.anexo['id_us_inv']);
      
      this.cargarFormEditAnexo(this.anexo);

    })
  }


  /**
   * Método para actualizar el anexo
   * @param idInversion => ID inversión
   */
  public editarAnexosById = ( idInversion:string ) =>{
    this.formSubmitted = true;

    if ( this.FormEditarAnexo.invalid ) {
      return; 
    }

    this.InversionServ.updateAnexoService( this.FormEditarAnexo.value, idInversion ).subscribe( (resp:any) =>{

      if( resp.ok ){
        const json = {
          nombres: this.userAsociado[0].nombres_us,
          apellidos: this.userAsociado[0].apellidos_us,
          email: this.userAsociado[0].email_us,
          //email: 'desarrollomemo@gmail.com',
          asunto: 'Annex update to your project in Clients LegalBF',
          descripcion: `<p>The <strong>${this.anexo['movimiento_anex']}</strong> annex was updated of your project at LegalBF.</p>
                        <p>Please go to: <a href="http://clientslegalbf.com/" target="_blank">www.clientslegalbf.com</a> You can verify your information.</p>
                        <br>
                        <b>For more information, contact LegalBF administrator. </b>
                        <br>
                        <p>©2021 - LegalBF Service</p>`
        }
        this.clientesSrv.sendEmailClienteService(json);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: resp.msg,
          showConfirmButton: true,
          timer: 1800
        });
        this.location.back();
        setTimeout(() => { window.location.reload(); }, 2000);
      }

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })

  }



  /**
   * Método para validar si cambia el archivo
   * @param check => estado del checkbox
   */
  public checkCambiarFile = (check:any) =>{
    if (check) {
      this.cambiarFile = '';
      
    } else {
      this.cambiarFile = 'hiddenInputFile';
      
    }
  }



  /**
   * Método para cargar el modal de editar anexos
   * @param anexo => Anexo a editar
   */
  public modalEditAnexo = (anexo:any) =>{
    this.editAnexo = anexo;
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
   * Método para cargar el formulario de editar inversión
   * @param inversion => Objeto de inversión a editar
   */
  public cargarFormEditAnexo = (anexo:any) =>{
    this.FormEditarAnexo = this.fb.group({
      movimientoAnexo: [anexo['movimiento_anex'], [Validators.required, Validators.minLength(3)]],
      fechaAnexo: [anexo['fechpublica_anex'], [Validators.required]],
      capitalExtra: [anexo['capital_extra_anex'], [Validators.required]],
      capitalCop: [anexo['capital_cop_anex'], [Validators.required]],
      interesExtra: [anexo['interes_extra_anex'], [Validators.required, Validators.minLength(1)]],
      interesCop: [anexo['interes_cop_anex'], [Validators.required, Validators.minLength(1)]],
      capitalInteresExtra: [anexo['capital_interes_extra_anex'], [Validators.required]],
      capitalInteresCop: [anexo['capital_interes_cop_anex'], [Validators.required]],
      descripcion: [anexo['descripcion_anex'], [Validators.required, Validators.minLength(20)]],
    })
  }



  /**
   * Método para validar el campo del formulario
   * @param campo => valor del campo a validar
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.FormEditarAnexo.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
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


  public obtenerArchivo = (file:File) =>{
    this.archivoSubir = file;
  }


  /**
   * Método para cambiar el archivo por id de anexo
   */
  public cambiarArchivoById = () =>{
    if ( this.archivoSubir == undefined) {
      return;
    }

    this.archivosServ.deleleFileService(this.anexo['tipo_archivo_info'], this.anexo['nom_archivo_info'], this.anexo['id_info']).subscribe((resp:any) =>{

      this.archivosServ.uploadFilesServices(this.archivoSubir, this.anexo['id_inv'], this.anexo['id_anex'], this.userAsociado[0].id_us).then(
        (resp2:any) =>{
          Swal.fire('Success!', `${resp2.msg}`, 'success');
          this.location.back();

        }).catch( (err) =>{
              Swal.fire('Error', err.error.msg, 'error');
          })

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })

  }



  goBack(){
    this.location.back();
  }

}
