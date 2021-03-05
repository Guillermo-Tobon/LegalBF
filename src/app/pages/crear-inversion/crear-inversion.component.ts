import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { InversionesService } from 'src/app/services/inversiones.service';
import { ArchivosService } from 'src/app/services/archivos.service';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-crear-inversion',
  templateUrl: './crear-inversion.component.html',
  styleUrls: ['./crear-inversion.component.css']
})
export class CrearInversionComponent implements OnInit {

  public usuario:any[] = [];
  public idInversion:string = '';
  public formSubmitted = false;
  

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
    descripcion: ['', [Validators.required, Validators.minLength(20)]],
    estado: [true, [Validators.required]],
  })
  

  constructor(
              private routeActive: ActivatedRoute,
              private location: Location,
              private inversionServ: InversionesService,
              private clienteSrs: ClientesService,
              private fb: FormBuilder,
              private router: Router,
  ) { }

  ngOnInit(): void {

    this.routeActive.params.subscribe( data =>{
      this.usuario = JSON.parse( data['usuario'] ) || [];

      console.log(this.usuario)

    })

  }



  /**
   * Método para crear la inversión por usuario
   */
  public crearInversion = () =>{
    this.formSubmitted = true;

    if ( this.crearFormInversion.invalid ) {
      return; 
    }

    this.inversionServ.crearInversionService( this.crearFormInversion.value, this.usuario['id_us'] ).subscribe( (resp:any) =>{

      if( resp.ok ){

        const json = {
          nombres: this.usuario['nombres_us'],
          apellidos: this.usuario['apellidos_us'],
          email: this.usuario['email_us'],
          asunto: 'Project created in Clients LegalBF',
          descripcion: `<p>The ${this.crearFormInversion.get('nombreInver').value} project was created in LegalBF</p>
                        <p>Enter: <a href="http://clientslegalbf.com/" target="_blank">www.clientslegalbf.com</a> You can verify the information</p>
                        <br>
                        <b>For more information, contact LegalBF administrator. </b>
                        <br>
                        <p>©2021 - LegalBF Service</p>`,
        }
        this.clienteSrs.sendEmailClienteService(json);
        Swal.fire('Success!', resp.msg, 'success');
        setTimeout(() => { window.location.reload(); }, 2000);
        this.idInversion = resp.idInver;       
      }

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
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
