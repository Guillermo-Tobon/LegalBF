import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { ClientesService } from 'src/app/services/clientes.service';
import { InversionesService } from 'src/app/services/inversiones.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.css']
})
export class DetalleClienteComponent implements OnInit {

  public usuario:any[] = [];
  public archivos:any[] = [];
  public inversiones:any[] = [];
  public formSubmitted = false;
  public updateFormCliente:any;
  public archivoSubir:File;
  public year = new Date().getFullYear();

  constructor(
              private routeActive: ActivatedRoute,
              private location: Location,
              private clienteServ: ClientesService,
              private inversionesServ: InversionesService,
              private translate: TranslateService,
              private router: Router,
              private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.routeActive.params.subscribe( data =>{
      this.usuario = JSON.parse( data['usuario'] ) || [];
      
      this.iniciarFormulario(this.usuario);

      this.getInversionesById(this.usuario['id_us']);

    })

    this.translate.use(localStorage.getItem('idioma'));

  }


  /**
   * Método para actualizar los datos del usuario
   */
  public actualizarCliente = () =>{
    this.formSubmitted = true;

    if ( this.updateFormCliente.invalid ) {
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
    let traMsgAlert;
    let traMsgAlert2;
    this.translate.get('UpdateAccountClientsLegalBF').subscribe((res: string) =>{traAsunto = res});
    this.translate.get('UpWasAccountClientsLegalBF').subscribe((res: string) =>{traDesc1 = res});
    this.translate.get('PleaseGoTo').subscribe((res: string) =>{traDesc2 = res});
    this.translate.get('verifyInformation').subscribe((res: string) =>{traDesc3 = res});
    this.translate.get('ForMoreInformation').subscribe((res: string) =>{traDesc4 = res});
    this.translate.get('ClientsLegalBFService').subscribe((res: string) =>{traDesc5 = res});
    this.translate.get('Success').subscribe((res: string) =>{traSuccess = res});
    this.translate.get('Error').subscribe((res: string) =>{traError = res});
    this.translate.get('updatedNotifiedSuccessfully').subscribe((res: string) =>{traMsgAlert = res});
    this.translate.get('notUpdatedTryAgainLater').subscribe((res: string) =>{traMsgAlert2 = res});

    this.clienteServ.updateClienteService(this.updateFormCliente.value).subscribe( (resp:any) =>{
      
      if(resp.ok){

        const json = {
          nombres: this.updateFormCliente.get('nombres').value,
          apellidos: this.updateFormCliente.get('apellidos').value,
          email: this.updateFormCliente.get('email').value,
          asunto: `${traAsunto}`,
          descripcion: `<p>${traDesc1}</p>
                        <p>${traDesc2}: <a href="http://clientslegalbf.com/" target="_blank">www.clientslegalbf.com</a> ${traDesc3}</p>
                        <br>
                        <b>${traDesc4}</b>
                        <br>
                        <p>©${this.year} - ${traDesc5}</p>`
        }
        this.clienteServ.sendEmailClienteService(json).subscribe( (resp2:any) =>{
          console.log(resp2)
          
        }, err => console.error(err))

        Swal.fire(`${traSuccess}`, `${this.updateFormCliente.get('nombres').value } ${traMsgAlert}`, 'success');
        setTimeout(() => { this.router.navigate(['dashboard/lista-clientes']) }, 2000);


      } else{
        Swal.fire(`${traError}`, `${traMsgAlert2}`, 'error');
      }

    }, (err) =>{
      //En caso de un error
      Swal.fire(`${traError}`, err.error.msg, 'error');
    })
  }



  /**
   * Método para navegar a crear inversión
   */
  public navegarCrearInversion = () =>{

    const user = JSON.stringify(this.usuario);
    this.router.navigate(['dashboard/crear-inversion', user]);

  }


  /**
   * Método para cargar las inversiones por usuario
   * @param idUs => ID de usuario
   */
  public getInversionesById = (idUs:number) =>{

    this.inversionesServ.getInversionesUserService(idUs).subscribe( (resp:any) =>{

      this.inversiones = resp.inversiones || [];

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })

  } 



  public navegarInversion = (inversion:any) =>{

    const inver = JSON.stringify(inversion);
    this.router.navigate(['dashboard/detalle-inversion', inver]);

  }




  /**
   * Método para validar los campos del formulario
   * @param campo => Valor del campo
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.updateFormCliente.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Método para iniciar el formulario
   * @param usuario => Datos de usuario
   */
  public iniciarFormulario = (usuario:any) =>{
    this.updateFormCliente = this.fb.group({
      nombres: [usuario['nombres_us'], [Validators.required, Validators.minLength(3)]],
      apellidos: [usuario['apellidos_us'], [Validators.required, Validators.minLength(3)]],
      email: [usuario['email_us'], [Validators.required, Validators.email, Validators.minLength(6)]],
      telefono: [usuario['telefono_us'], [Validators.required, Validators.minLength(6)]],
      pais: [usuario['pais_us'], [Validators.required, Validators.minLength(3)]],
      compania: [usuario['compania_us'], [Validators.required, Validators.minLength(5)]],
      descripcion: [usuario['descripcion_us'], [Validators.required, Validators.minLength(3)]],
      estado: [usuario['estado_us'] === 1? true : false, [Validators.required]],
      id: [usuario['id_us'], [Validators.required, Validators.minLength(5)]],
    });
  }


  goBack(){
    this.location.back();
  }
  

}
