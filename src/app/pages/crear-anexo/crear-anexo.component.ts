import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { InversionesService } from 'src/app/services/inversiones.service';
import { ArchivosService } from 'src/app/services/archivos.service';

@Component({
  selector: 'app-crear-anexo',
  templateUrl: './crear-anexo.component.html',
  styleUrls: ['./crear-anexo.component.css']
})
export class CrearAnexoComponent implements OnInit {

  public inversion:any[] = [];
  public formSubmitted:boolean = false;
  public idAnexo:String = '';
  public archivoSubir:File;

  public FormCrearAnexo = this.fb.group({
    nombreAnexo: ['', [Validators.required, Validators.minLength(5)]],
    ganancias: ['', [Validators.required, Validators.minLength(5)]],
    fecha: ['', [Validators.required]],
    comentario: ['', [Validators.required, Validators.minLength(20)]],
  });

  constructor(
              private routeActive: ActivatedRoute,
              private InversionServ: InversionesService,
              private archivosServ: ArchivosService,
              private location: Location,
              private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.routeActive.params.subscribe( data => {
      this.inversion = JSON.parse( data['inversion'] ) || [];
    })
  }




  /**
   * Método para crear anexos a la inversión
   * @param inversion => ID de la inversión
   */
  public crearAnexos = () =>{

    console.log(this.archivoSubir)
  
    this.formSubmitted = true;

    if ( this.FormCrearAnexo.invalid ) {
      return; 
    }

    const dataInver = {
      idUser: this.inversion['id_us_inv'],
      idInversion: this.inversion['id_inv'],  
      tasa: this.inversion['tasa_ea_inv'],
      moneda: this.inversion['moneda_inv']
    }

    this.InversionServ.crearAnexoServices( this.FormCrearAnexo.value, dataInver ).subscribe( (resp:any) =>{

      if( resp.ok ){
        this.formSubmitted = false;
        this.idAnexo = resp.idAnexo;
        
        this.archivosServ.uploadFilesServices( this.archivoSubir, this.inversion['id_inv'], this.idAnexo, this.inversion['id_us_inv'] ).then(
          (resp:any) =>{
            Swal.fire('Bien hecho!', `${resp.msg}`, 'success');
            setTimeout(() => { window.location.reload(); }, 2000);

          }).catch( (err) =>{
              Swal.fire('Error', err.error.msg, 'error');
          })
      }

      
    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })

  }


  /**
   * Método para obtener el archivo por usuario
   * @param file => Objeto file del archivo a subir
   */
  public obtenerArchivo = (file:File) =>{
    this.archivoSubir = file
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



  goBack(){
    this.location.back();
  }





}
