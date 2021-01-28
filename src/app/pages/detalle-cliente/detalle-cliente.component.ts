import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { ClientesService } from 'src/app/services/clientes.service';
import { ArchivosService } from 'src/app/services/archivos.service';
import { InversionesService } from 'src/app/services/inversiones.service';

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
  

  constructor(
              private routeActive: ActivatedRoute,
              private location: Location,
              private clienteServ: ClientesService,
              private archivosServ: ArchivosService,
              private inversionesServ: InversionesService,
              private router: Router,
              private fb: FormBuilder,
  ) { }

  ngOnInit(): void {

    this.routeActive.params.subscribe( data =>{
      this.usuario = JSON.parse( data['usuario'] ) || [];
      
      this.iniciarFormulario(this.usuario);

      this.getInversionesById(this.usuario['id_us']);

      this.getArchivosUserById(this.usuario['id_us']);

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

    this.clienteServ.updateClienteService(this.updateFormCliente.value).subscribe( (resp:any) =>{
      
      if(resp.ok){

        const json = {
          nombres: this.updateFormCliente.get('nombres').value,
          apellidos: this.updateFormCliente.get('apellidos').value,
          email: this.updateFormCliente.get('email').value,
          asunto: 'Actualización cuenta en LegalBF',
          descripcion: `<p>Se actualizó su cuenta de LegalBF por parte del administador.</p>
                        <p>Por favor ingrese a: <a href="https://www.legalbf.com/" target="_blank">www.legalbf.com</a> y verifique su información</p>
                        <br>
                        <b>Para más información, comuníquese con el administrador de LegalBF </b>
                        <br>
                        <p>©2021 - Todos los derechos reservados - es un servicio gratuito de LegalBG</p>`
        }
        this.clienteServ.sendEmailClienteService(json).subscribe( (resp2:any) =>{

          if (resp2.ok) {
            Swal.fire('Bien Hecho!', `Cliente ${this.updateFormCliente.get('nombres').value } actualizado y notificado por correo electrónico con éxito.`, 'success');
            setTimeout(() => { this.router.navigate(['dashboard/lista-clientes']) }, 2000);
          }

        }, (err) =>{
          //En caso de un error
          Swal.fire('Error', err.error.msg, 'error');
        })


      } else{

        Swal.fire('Error', 'En este momento no se puede actualizar el cliente. Inténtelo más tarde.', 'error');
      }

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
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
   * Método para consultar los archivos por usuario
   * @param idUser => ID del usuario
   */
  public getArchivosUserById = (idUser:any) =>{

    this.archivosServ.getFilesUserService(idUser).subscribe( (resp:any) =>{

      this.archivos = resp.archivos || [];      

    }, (err) =>{
      //En caso de un error
      console.log(err.error.msg);
    })

  }

  /**
   * Método para visualizar archivo por id
   * @param archivo => Objeto archivo a visualizar 
   */
  public verArchivo = (archivo:any) =>{

    this.archivosServ.viewFileService( archivo.tipo_archivo_info, archivo.nom_archivo_info ).subscribe( (resp:any) =>{

      //window.open(resp.pathFile, "_blank");
      window.open(`http://127.0.0.1:8887/${archivo.tipo_archivo_info}/${archivo.nom_archivo_info}`, "_blank");
    
    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })

  }



  /**
   * Método para eliminar archivo por id
   * @param archivo => Objeto archivo a eliminar 
   */
  public eliminarArchivo = (archivo:any) =>{

    Swal.fire({
      text: "¿Realmente desea eliminar el archivo " + archivo.nom_archivo_info + "?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.archivosServ.deleleFileService(archivo.tipo_archivo_info, archivo.nom_archivo_info, archivo.id_info).subscribe( (resp:any) =>{
          
          if ( resp.ok ) {
            Swal.fire('Bien hecho!', resp.msg, 'success');
            setTimeout(() => { window.location.reload(); }, 2000);
          }
    
        }, (err) =>{
          //En caso de un error
          Swal.fire('Error', err.error.msg, 'error');
        })
      }
    })
    
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
      compania: [usuario['compania_us'], [Validators.required, Validators.minLength(5)]],
      descripcion: [usuario['descripcion_us'], [Validators.required, Validators.minLength(20)]],
      estado: [usuario['estado_us'] === 1? true : false, [Validators.required]],
      id: [usuario['id_us'], [Validators.required, Validators.minLength(5)]],
    });
  }


  goBack(){
    this.location.back();
  }
  

}
