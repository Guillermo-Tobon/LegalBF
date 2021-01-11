import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ClientesService } from 'src/app/services/clientes.service';


@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {

  public formSubmitted = false;

  public regisFormCliente = this.fb.group({
    nombres: ['Andres', [Validators.required, Validators.minLength(3)]],
    apellidos: ['Lopez', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email, Validators.minLength(6)]],
    telefono: ['3125641289', [Validators.required, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfir: ['', [Validators.required, Validators.minLength(6)]],
    nomCia: ['Lopez Company S.A.S', [Validators.required, Validators.minLength(5)]],
    estado: [true, [Validators.required, Validators.minLength(5)]],
  }, {
    validators: this.passwordsIguales('password', 'passwordConfir')
  });

  constructor( 
              private fb: FormBuilder,
              private clienteSrs: ClientesService ) { }

  ngOnInit(): void {
  }



  /**
   * Método para registrar nuevos clientes
   */
  public registrarCliente = () =>{
    this.formSubmitted = true;

    if ( this.regisFormCliente.invalid ) {
      return; 
    }

    this.clienteSrs.crearClienteServices(this.regisFormCliente.value).subscribe( resp =>{

      if ( resp.ok ) {
        Swal.fire('Bien hecho!', resp.msg, 'success');
        
      }


    }, (err) => {
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
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
