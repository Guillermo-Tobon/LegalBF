import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { InversionesService } from 'src/app/services/inversiones.service';
import { ArchivosService } from 'src/app/services/archivos.service';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-crear-anexo',
  templateUrl: './crear-anexo.component.html',
  styleUrls: ['./crear-anexo.component.css']
})
export class CrearAnexoComponent implements OnInit {

  public inversion:any[] = [];
  public usuario:any[] = [];
  public formSubmitted:boolean = false;
  public idAnexo:String = '';
  public archivoSubir:File;
  public FormCrearAnexo:FormGroup;

  constructor(
              private routeActive: ActivatedRoute,
              private InversionServ: InversionesService,
              private archivosServ: ArchivosService,
              private clientesSrv: ClientesService,
              private location: Location,
              private router: Router,
              private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.routeActive.params.subscribe( data => {
      this.inversion = JSON.parse( data['inversion'] ) || [];

      this.getUserById(this.inversion['id_us_inv'])

    })

    this.iniciarFormulario();
  }




  /**
   * Método para crear anexos a la inversión
   * @param inversion => ID de la inversión
   */
  public crearAnexos = () =>{
    
    this.formSubmitted = true;
    
    if ( this.FormCrearAnexo.invalid ) {
      return; 
    }

    const dataInver = {
      idUser: this.inversion['id_us_inv'],
      idInversion: this.inversion['id_inv'],  
      moneda: this.inversion['moneda_extra_inv']
    }

    this.InversionServ.crearAnexoServices( this.FormCrearAnexo.value, dataInver ).subscribe( (resp1:any) =>{

      if( resp1.ok ){
        this.formSubmitted = false;
        this.idAnexo = resp1.idAnexo;
        
        this.archivosServ.uploadFilesServices( this.archivoSubir, this.inversion['id_inv'], this.idAnexo, this.inversion['id_us_inv'] ).then(
          (resp2:any) =>{

            const json = {
              nombres: this.usuario[0].nombres_us,
              apellidos: this.usuario[0].apellidos_us,
              email: this.usuario[0].email_us,
              //email: 'desarrollomemo@gmail.com',
              asunto: 'Creating an annex to your project in Clients LegalBF',
              descripcion: `<p>An annex to your <strong>${this.inversion['nombre_inv']}</strong> project was created.</p>
                            <p>Please go to: <a href="http://clientslegalbf.com/" target="_blank">www.clientslegalbf.com</a> verify your information.</p>
                            <br>
                            <b>For more information, contact LegalBF administrator. </b>
                            <br>
                            <p>©2021 - LegalBF Service</p>`
            }
            this.clientesSrv.sendEmailClienteService(json).subscribe( (resp:any) =>{
              console.log(resp)

            }, err => console.error('error de email-> ', err.error))

            Swal.fire('Success!', `${resp1.msg}`, 'success');
            setTimeout(() => { this.router.navigate(['dashboard/inversiones']); }, 2000);

          }).catch( (err) =>{
              Swal.fire('Error', err.error.msg, 'error');
              console.log('error de file-> ', err.error)
          })
      }

      
    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
      console.log('error de creacion-> ', err.error)
    })

  }


  /**
   * Método para obtener el archivo por usuario
   * @param file => Objeto file del archivo a subir
   */
  public obtenerArchivo = (file:File) =>{
    this.archivoSubir = file
  }
  
  


  /**
   * Método para validar el campo del formulario
   * @param campo => valor del campo a validar
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.FormCrearAnexo.get(campo).invalid && this.formSubmitted ) {
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

      this.usuario = resp.usuario || [];

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })
  }



  public iniciarFormulario = () =>{
    this.FormCrearAnexo = this.fb.group({
      movimientoAnexo: ['', [Validators.required, Validators.minLength(5)]],
      fechaAnexo: ['', [Validators.required]],
      capitalExtra: ['', [Validators.required]],
      capitalCop: ['', [Validators.required]],
      interesExtra: ['', [Validators.required]],
      interesCop: ['', [Validators.required]],
      capitalInteresExtra: ['', [Validators.required]],
      capitalInteresCop: ['', [Validators.required]],
      comentario: ['', [Validators.required, Validators.minLength(20)]],
    });
  }



  goBack(){
    this.location.back();
  }





}
