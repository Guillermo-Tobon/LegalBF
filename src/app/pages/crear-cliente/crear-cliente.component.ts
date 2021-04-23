import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ClientesService } from 'src/app/services/clientes.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {

  public formSubmitted = false;
  public year = new Date().getFullYear();

  public regisFormCliente = this.fb.group({
    nombres: ['', [Validators.required, Validators.minLength(3)]],
    apellidos: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email, Validators.minLength(6)]],
    telefono: ['', [Validators.required, Validators.minLength(6)]],
    pais: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfir: ['', [Validators.required, Validators.minLength(6)]],
    compania: ['', [Validators.required, Validators.minLength(5)]],
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    estado: [true, [Validators.required]],
  }, {
    validators: this.passwordsIguales('password', 'passwordConfir')
  });

  constructor( 
              private fb: FormBuilder,
              private router: Router,
              private clienteSrs: ClientesService,
              private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.translate.use(localStorage.getItem('idioma'));
  }



  /**
   * Método para registrar nuevos clientes
   */
  public registrarCliente = () =>{
    this.formSubmitted = true;

    if ( this.regisFormCliente.invalid ) {
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
    let traMsgAlert;
    this.translate.get('UserCreatedClientsLegalBF').subscribe((res: string) =>{traAsunto = res});
    this.translate.get('accountHasBeenCreated').subscribe((res: string) =>{traDesc1 = res});
    this.translate.get('Enter').subscribe((res: string) =>{traDesc2 = res});
    this.translate.get('Username').subscribe((res: string) =>{traDesc3 = res});
    this.translate.get('Password').subscribe((res: string) =>{traDesc4 = res});
    this.translate.get('ForMoreInformation').subscribe((res: string) =>{traDesc5 = res});
    this.translate.get('ClientsLegalBFService').subscribe((res: string) =>{traDesc6 = res});
    this.translate.get('Success').subscribe((res: string) =>{traSuccess = res});
    this.translate.get('Error').subscribe((res: string) =>{traError = res});
    this.translate.get('notPossibleTryAgainLater').subscribe((res: string) =>{traMsgAlert = res});


    this.clienteSrs.insertUsuariosServices(this.regisFormCliente.value).subscribe( resp =>{

      if ( resp.ok ) {

        const json = {
          nombres: this.regisFormCliente.get('nombres').value,
          apellidos: this.regisFormCliente.get('apellidos').value,
          email: this.regisFormCliente.get('email').value,
          asunto: `${traAsunto}`,
          descripcion: `<p>${traDesc1}</p>
                        <p>${traDesc2}: <a href="http://clientslegalbf.com/" target="_blank">www.clientslegalbf.com</a></p>
                        <p>${traDesc3}: ${this.regisFormCliente.get('email').value}</p>
                        <p>${traDesc4}: ${this.regisFormCliente.get('password').value}</p>
                        <br>
                        <b>${traDesc5}</b>
                        <br>
                        <p>©${this.year} - ${traDesc6}</p>`,
        }

        this.clienteSrs.sendEmailClienteService(json).subscribe( (resp2:any) =>{
          console.log(resp2)

        }, err => console.error(err))

        Swal.fire(`${traSuccess}`, resp.msg, 'success');
        setTimeout(() => { this.router.navigate(['dashboard/lista-clientes']) }, 2000);
        
      } else {
        Swal.fire(`${traError}`, `${traMsgAlert}`, 'error');

      }

    }, (err) => {
      //En caso de un error
      Swal.fire(`${traError}`, err.error.msg, 'error');
    });
    
  }





  public campoNoValido = (campo:any): boolean =>{
    if ( this.regisFormCliente.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }



  public contrasenasNoValidas = () =>{
    const pass1 = this.regisFormCliente.get('password').value;
    const pass2 = this.regisFormCliente.get('passwordConfir').value;

    if ( (pass1 !== pass2) && this.formSubmitted ) {
      return true;

    } else if( pass1 == '' && this.formSubmitted ) {
      return true;

    } else if( pass1.length < 6 && this.formSubmitted ) {
      return true;

    } else {
      return false;
    }
  }



  public passwordsIguales(pass1Name: string, pass2Name: string){

    return (formGoup: FormGroup) =>{
      const pass1Control = formGoup.get(pass1Name);
      const pass2Control = formGoup.get(pass2Name);

      if ( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors(null);

      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    }
  }



}
