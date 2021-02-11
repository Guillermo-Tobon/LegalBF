import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

import { InversionesService } from 'src/app/services/inversiones.service';
import { ArchivosService } from 'src/app/services/archivos.service';

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
    capital: ['', [Validators.required, Validators.minLength(3)]],
    moneda: ['', [Validators.required]],
    tiempo: ['', [Validators.required, Validators.minLength(2)]],
    tasainteres: ['', [Validators.required, Validators.minLength(1)]],
    pais: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['', [Validators.required, Validators.minLength(20)]],
    estado: [true, [Validators.required]],
  })
  

  constructor(
              private routeActive: ActivatedRoute,
              private location: Location,
              private inversionServ: InversionesService,
              private archivosServ: ArchivosService,
              private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.routeActive.params.subscribe( data =>{
      this.usuario = JSON.parse( data['usuario'] ) || [];

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
        Swal.fire('Bien hecho!', `${resp.msg}.`, 'success');
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
