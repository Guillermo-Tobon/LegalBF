import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { InversionesService } from 'src/app/services/inversiones.service';
import { ArchivosService } from 'src/app/services/archivos.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-crear-inversion',
  templateUrl: './crear-inversion.component.html',
  styleUrls: ['./crear-inversion.component.css']
})
export class CrearInversionComponent implements OnInit {

  public usuario:any[] = [];
  public idInversion:string = '';
  public formSubmitted = false;
  public year = new Date().getFullYear();
  

  public crearFormInversion = this.fb.group({
    nombreInver: ['', [Validators.required, Validators.minLength(3)]],
    capitalExtra: ['', [Validators.required]],
    monedaExtra: ['', [Validators.required]],
    tasaCambio: ['', [Validators.required]],
    capitalCop: ['', [Validators.required]],
    tasaInteres: ['', [Validators.required, Validators.minLength(1)]],
    interesExtra: ['', [Validators.required, Validators.minLength(1)]],
    interesCop: ['', [Validators.required, Validators.minLength(1)]],
    pais: ['', [Validators.required, Validators.minLength(3)]],
    rentaExtra: ['', [Validators.required]],
    rentaCop: ['', [Validators.required]],
    tiempo: ['', [Validators.required]],
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    estado: [true, [Validators.required]],
  })
  

  constructor(
              private routeActive: ActivatedRoute,
              private location: Location,
              private inversionServ: InversionesService,
              private clienteSrs: ClientesService,
              private translate: TranslateService,
              private fb: FormBuilder,
              private router: Router,
  ) { }

  ngOnInit(): void {

    this.routeActive.params.subscribe( data =>{
      this.usuario = JSON.parse( data['usuario'] ) || [];
    });

    this.translate.use(localStorage.getItem('idioma'));

  }



  /**
   * Método para crear la inversión por usuario
   */
  public crearInversion = () =>{
    this.formSubmitted = true;

    if ( this.crearFormInversion.invalid ) {
      return; 
    }

    let traAsunto;
    let traDesc1;
    let traDesc2;
    let traDesc3;
    let traDesc4;
    let traDesc5;
    let traSuccess;
    let traError;
    this.translate.get('ProjectCreatedClientsLegalBF').subscribe((res: string) =>{traAsunto = res});
    this.translate.get('projectWasCreated').subscribe((res: string) =>{traDesc1 = res});
    this.translate.get('Enter').subscribe((res: string) =>{traDesc2 = res});
    this.translate.get('verifyInformation').subscribe((res: string) =>{traDesc3 = res});
    this.translate.get('ForMoreInformation').subscribe((res: string) =>{traDesc4 = res});
    this.translate.get('ClientsLegalBFService').subscribe((res: string) =>{traDesc5 = res});
    this.translate.get('Success').subscribe((res: string) =>{traSuccess = res});
    this.translate.get('Error').subscribe((res: string) =>{traError = res});

    this.inversionServ.crearInversionService( this.crearFormInversion.value, this.usuario['id_us'] ).subscribe( (resp:any) =>{

      if( resp.ok ){

        const json = {
          nombres: this.usuario['nombres_us'],
          apellidos: this.usuario['apellidos_us'],
          email: this.usuario['email_us'],
          asunto: `${traAsunto}`,
          descripcion: `<p>${this.crearFormInversion.get('nombreInver').value} ${traDesc1}</p>
                        <p>${traDesc2}: <a href="http://clientslegalbf.com/" target="_blank">www.clientslegalbf.com</a> ${traDesc3}</p>
                        <br>
                        <b>${traDesc4}</b>
                        <br>
                        <p>©${this.year} - ${traDesc5}</p>`,
        }
        this.clienteSrs.sendEmailClienteService(json).subscribe( (resp:any) =>{
          console.log(resp)
        }, err => console.error(err));
        
        Swal.fire(`${traSuccess}`, resp.msg, 'success');
        setTimeout(() => { this.router.navigate(['dashboard/inversiones']); }, 2000);
        this.idInversion = resp.idInver;       
      }

    }, (err) =>{
      //En caso de un error
      Swal.fire(`${traError}`, err.error.msg, 'error');
      console.log(err)
    })

  }




  /**
   * Método para validar el campo del formulario
   * @param campo => valor del campo a validar
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.crearFormInversion.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }


  goBack(){
    this.location.back();
  }

  

}
