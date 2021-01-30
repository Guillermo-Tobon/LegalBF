import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';
import { TicketsService } from 'src/app/services/tickets.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  public usuario:any[] = [];
  public formSubmitted = false;
  public ticketFormCliente:any;

  constructor(
              private routeActive: ActivatedRoute,
              private fb: FormBuilder,
              private router: Router,
              private ticketServ: TicketsService,
              private clienteSrs: ClientesService
  ) { }

  ngOnInit(): void {

    this.routeActive.params.subscribe( data =>{
      this.usuario = JSON.parse( data['usuario'] ) || [];
      
      this.iniciarFormulario(this.usuario);
    })

  }




  /**
   * Método para crear tickets
   */
  public regisTicketCliente = () =>{
    this.formSubmitted = true;

    if ( this.ticketFormCliente.invalid ) {
      return; 
    }
    if ( !this.ticketFormCliente.get('acepto').value ) {
      return;
    }

    this.ticketServ.creatTicketService( this.ticketFormCliente.value ).subscribe( (resp:any) =>{

      Swal.fire('Bien hecho!!', `${resp.msg} - Ticket ( ${resp.idticket} )`, 'success');

      const json = {
        nombres: 'Administrador de LegalBF',
        apellidos: '',
        email: 'desarrollomemo@gmail.com',
        asunto: 'Creación de ticket en LegalBF',
        descripcion: `<p>Se ha creado un ticket con número <b>${resp.idticket}</b> en LegalBF.</p>
                      <p><b>Nombre: </b>${this.usuario[0]['nombres_us']} ${this.usuario[0]['apellidos_us']}</p>
                      <p><b>Email: </b>${this.usuario[0]['email_us']}</p>
                      <p><b>Teléfono: </b>${this.usuario[0]['telefono_us']}</p>
                      <p><b>Asunto: </b>${this.ticketFormCliente.get('asunto').value}</p>
                      <p><b>Mensaje: </b>${this.ticketFormCliente.get('descripcion').value}</p>
                      <p>Ingrese a: <a href="https://www.legalbf.com/" target="_blank">www.legalbf.com</a> y verifique los tickets.</p>
                      <br>
                      <p>©2021 - Todos los derechos reservados - es un servicio gratuito de LegalBG</p>`
      }

      this.clienteSrs.sendEmailClienteService(json).subscribe( (resp2:any) =>{
        console.log(resp2)
      }, (err) =>{
        console.log(err)
      })
      

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })
    
  }



/**
 * Método para iniciar el formulario
 * @param usuario => Datos de usuario
 */
  public iniciarFormulario = (usuario:any) =>{
   
    this.ticketFormCliente = this.fb.group({
      nombrecompleto: [`${usuario[0]['nombres_us']} ${usuario[0]['apellidos_us']}`, [Validators.required, Validators.minLength(3)]],
      email: [usuario[0]['email_us'], [Validators.required, Validators.email, Validators.minLength(6)]],
      telefono: [usuario[0]['telefono_us'], [Validators.required, Validators.minLength(6)]],
      compania: [usuario[0]['compania_us'], [Validators.required, Validators.minLength(5)]],
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      acepto: ['', [Validators.required]],
      id: [usuario[0]['id_us'], [Validators.required, Validators.minLength(5)]],
    });
  }


  /**
   * Método para validar los campos del formulario
   * @param campo => Valor del campo
   */
  public campoNoValido = (campo:any): boolean =>{
    if ( this.ticketFormCliente.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }

}
