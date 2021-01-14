import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ClientesService } from 'src/app/services/clientes.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: ['./crear-cliente.component.css']
})
export class CrearClienteComponent implements OnInit {

  public formSubmitted = false;

  public regisFormCliente = this.fb.group({
    nombres: ['', [Validators.required, Validators.minLength(3)]],
    apellidos: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email, Validators.minLength(6)]],
    telefono: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfir: ['', [Validators.required, Validators.minLength(6)]],
    compania: ['', [Validators.required, Validators.minLength(5)]],
    descripcion: ['', [Validators.required, Validators.minLength(20)]],
    estado: [true, [Validators.required, Validators.minLength(5)]],
  }, {
    validators: this.passwordsIguales('password', 'passwordConfir')
  });

  constructor( 
              private fb: FormBuilder,
              private router: Router,
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

    this.clienteSrs.insertUsuariosServices(this.regisFormCliente.value).subscribe( resp =>{

      if ( resp.ok ) {
        
        Swal.fire('Bien hecho!', resp.msg, 'success');
        setTimeout(() => { this.router.navigate(['dashboard/lista-clientes']) }, 2000);
        
      } else {
        Swal.fire('Error', 'No es posible procesar los datos. Inténtelo más tarde.', 'error');

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
