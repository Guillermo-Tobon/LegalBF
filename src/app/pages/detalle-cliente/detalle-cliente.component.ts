import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteForm } from 'src/app/interfaces/clientes-form.interface';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.css']
})
export class DetalleClienteComponent implements OnInit {

  public usuario:any[] = [];
  public formSubmitted = false;
  public updateFormCliente:any;
  

  constructor(
              private routeActive: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.routeActive.params.subscribe( data =>{
      this.usuario = JSON.parse( data['usuario'] ) || [];
      
      this.iniciarFormulario(this.usuario);
    })

  }


  /**
   * Método para actualizar los datos del usuario
   */
  public actualizarCliente = () =>{
    this.formSubmitted = true;

    if ( this.updateFormCliente.invalid ) {
      return; 
    }

    console.log(this.updateFormCliente.value)
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



  public iniciarFormulario = (usuario:any) =>{
    this.updateFormCliente = this.fb.group({
      nombres: [usuario['nombres_us'], [Validators.required, Validators.minLength(3)]],
      apellidos: [usuario['apellidos_us'], [Validators.required, Validators.minLength(3)]],
      email: [usuario['email_us'], [Validators.required, Validators.email, Validators.minLength(6)]],
      telefono: [usuario['telefono_us'], [Validators.required, Validators.minLength(6)]],
      compania: [usuario['compania_us'], [Validators.required, Validators.minLength(5)]],
      estado: [usuario['estado_us'], [Validators.required, Validators.minLength(5)]],
    });
  }

}
