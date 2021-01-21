import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { JsonpClientBackend } from '@angular/common/http';
import { LoginForm } from 'src/app/interfaces/login-form.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    remember: [JSON.parse( localStorage.getItem('remember') )],
  });

  constructor( 
              private router: Router,
              private fb: FormBuilder,
              private authServ: AuthService ) { }

  ngOnInit(): void {
  }

  /**
   * Método para iniciar sesión
   */
  public login = () =>{
    this.formSubmitted = true;

    if ( this.loginForm.invalid ) {
      return; 
    }

    this.authServ.loginService( this.loginForm.value ).subscribe( resp =>{
      
      if ( resp.ok ) {
        this.guardaLocalStorage(this.loginForm.value);
        this.router.navigateByUrl('/');
        
      } else {
        Swal.fire('Error', 'En este momento no se puede iniciar sesión. Inténtelo más tarde.', 'error');

      }

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })
    
  }


  

  /**
   * Método para validar los campos del form
   * @param campo => Valor del campo
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.loginForm.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }




  /**
   * Método para guardar el localstorage
   * @param formData => Data del formulario login
   */
  public guardaLocalStorage = (formData:LoginForm) => {
    
    if ( formData.remember ) {
      localStorage.setItem('email', formData.email );
      localStorage.setItem('remember', JSON.stringify(formData.remember) );
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('remember');
    }
  }







}
