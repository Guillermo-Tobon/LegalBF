import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { InversionesService } from 'src/app/services/inversiones.service';
import { ArchivosService } from 'src/app/services/archivos.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { TranslateService } from '@ngx-translate/core';

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
  public fechaHoy:Date = new Date();
  public year = new Date().getFullYear();

  constructor(
              private routeActive: ActivatedRoute,
              private InversionServ: InversionesService,
              private archivosServ: ArchivosService,
              private clientesSrv: ClientesService,
              private translate: TranslateService,
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

    this.translate.use(localStorage.getItem('idioma'));
  }




  /**
   * Método para crear anexos a la inversión
   * @param inversion => ID de la inversión
   */
  public crearAnexos = () =>{
    this.formSubmitted = true;

    let traWarning;
    let traMsgAlert1;
    let traMsgAlert2;
    this.translate.get('Warning').subscribe((res: string) =>{traWarning = res});
    this.translate.get('documentRequiredAnnex').subscribe((res: string) =>{traMsgAlert1 = res});
    this.translate.get('fileisNotAllowed').subscribe((res: string) =>{traMsgAlert2 = res});

    if ( this.FormCrearAnexo.invalid ) {
      return; 
    }
    if(this.archivoSubir == undefined){
      Swal.fire(`${traWarning}`, `${traMsgAlert1}`, 'warning');
      return;
    }
    const extension = this.archivoSubir.name.split('.').pop() || undefined;
    if (extension != 'pdf') {
      Swal.fire(`${traWarning}`, `${traMsgAlert2}`, 'warning');
      return;
    }

    
    let traAsunto;
    let traDesc1;
    let traDesc2;
    let traDesc3;
    let traDesc4;
    let traDesc5;
    let traDesc6;
    let traSuccess;
    let traError;
    this.translate.get('CreatingAnnexClientsLegalBF').subscribe((res: string) =>{traAsunto = res});
    this.translate.get('AnAnnexYour').subscribe((res: string) =>{traDesc1 = res});
    this.translate.get('projectCreated').subscribe((res: string) =>{traDesc2 = res});
    this.translate.get('PleaseGoTo').subscribe((res: string) =>{traDesc3 = res});
    this.translate.get('verifyInformation').subscribe((res: string) =>{traDesc4 = res});
    this.translate.get('ForMoreInformation').subscribe((res: string) =>{traDesc5 = res});
    this.translate.get('ClientsLegalBFService').subscribe((res: string) =>{traDesc6 = res});
    this.translate.get('Success').subscribe((res: string) =>{traSuccess = res});
    this.translate.get('Error').subscribe((res: string) =>{traError = res});
    
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
              asunto: `${traAsunto}`,
              descripcion: `<p>${traDesc1} <strong>${this.inversion['nombre_inv']}</strong> ${traDesc2}</p>
                            <p>${traDesc3}: <a href="http://clientslegalbf.com/" target="_blank">www.clientslegalbf.com</a> ${traDesc4}</p>
                            <br>
                            <b>${traDesc5}</b>
                            <br>
                            <p>©${this.year} - ${traDesc6}</p>`
            }
            this.clientesSrv.sendEmailClienteService(json).subscribe( (resp:any) =>{
              console.log(resp)

            }, err => console.error('error de email-> ', err.error))

            Swal.fire(`${traSuccess}`, `${resp1.msg}`, 'success');
            setTimeout(() => { this.router.navigate(['dashboard/inversiones']); }, 2000);

          }).catch( (err) =>{
              Swal.fire(`${traError}`, err.error.msg, 'error');
              console.log('error de file-> ', err.error)
          })
      }

      
    }, (err) =>{
      //En caso de un error
      Swal.fire(`${traError}`, err.error.msg, 'error');
      console.log('error de creacion-> ', err.error)
    })

  }


  /**
   * Método para obtener el archivo por usuario
   * @param file => Objeto file del archivo a subir
   */
  public obtenerArchivo = (file:File) =>{
    this.archivoSubir = file;
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


  /**
   * Método para validar los campos del formulario
   */
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
      comentario: ['',],
    });
  }


  //Obtener la fecha de hoy
  public getFechaHoy = () =>{
    const hoy = this.fechaHoy.toISOString().split('T');
    return hoy[0];
  }


  //Volver a atras
  goBack(){
    this.location.back();
  }


}
