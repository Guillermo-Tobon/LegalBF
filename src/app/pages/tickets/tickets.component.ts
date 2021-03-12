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

      const json = {
        nombres: 'LegalBF Administrator',
        apellidos: '',
        email: 'desarrollomemo@gmail.com',
        //email: 'timotheerodier@legalbf.com',
        asunto: 'Ticket creation in Clients LegalBF',
        descripcion: `<p>A ticket with a number has been created <b>${resp.idticket}</b> in LegalBF.</p>
                      <p><b>Name: </b>${this.usuario[0]['nombres_us']} ${this.usuario[0]['apellidos_us']}</p>
                      <p><b>Email: </b>${this.usuario[0]['email_us']}</p>
                      <p><b>Phone: </b>${this.usuario[0]['telefono_us']}</p>
                      <p><b>Affair: </b>${this.ticketFormCliente.get('asunto').value}</p>
                      <p><b>Message: </b>${this.ticketFormCliente.get('descripcion').value}</p>
                      <p>Enter: <a href="http://clientslegalbf.com" target="_blank">www.clientslegalbf.com</a> and check the tickets.</p>
                      <br>
                      <p>©2021 - All rights reserved - it is a free service of LegalBG</p>`
      }

      this.clienteSrs.sendEmailClienteService(json).subscribe( (resp2:any) =>{
        console.log(resp2)
      }, (err) =>{
        console.log(err)
      })

      Swal.fire('Success!!', `${resp.msg} - Ticket ( ${resp.idticket} )`, 'success');
      setTimeout(() => { this.router.navigate(['dashboard/lista-tickets']) }, 2000);
      

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
      console.log(err.error)
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
