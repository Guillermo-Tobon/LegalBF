import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { TicketsService } from 'src/app/services/tickets.service';
import { ReturnStatement } from '@angular/compiler';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-lista-tickets',
  templateUrl: './lista-tickets.component.html',
  styleUrls: ['./lista-tickets.component.css']
})
export class ListaTicketsComponent implements OnInit {

  public usuario:any[] = [];
  public tickets:any[] = [];
  public editTicket:{} = {};
  public responTicket:{} = {};
  public FormEditTicket:any;
  public FormAnswerTicket:any;
  public formSubmitted = false;

  constructor(
              private authServ: AuthService,
              private ticketServ: TicketsService,
              private clienteSrs: ClientesService,
              private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario;

    if ( this.usuario[0].admin_us === 'Y' ) {
      this.getAllTickets();
      
    } else {
      this.getTicketsUsuario(this.usuario[0].id_us);
      
    }

    //Iniciar formularios
    this.FormEditTicket = this.fb.group({
      asunto: ['', [Validators.required, Validators.minLength(5)]],
      mensaje: ['', [Validators.required, Validators.minLength(20)]],
    })

    this.FormAnswerTicket = this.fb.group({
      respuesta: ['', [Validators.required, Validators.minLength(20)]],
    })
    
  }


  /**
   * Método para obtener todos los tickets
   */
  public getAllTickets = async() =>{
    await this.ticketServ.getAllTicketsService().subscribe( (resp:any) =>{
      this.tickets = resp.tickets; 

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })
  }



  /**
   * Método para obtener los ticket por id usuario
   * @param id => ID de usuario logueado
   */
  public getTicketsUsuario = async(id:any) =>{

    await this.ticketServ.getTicketByIdService(id).subscribe( (resp:any) =>{
      this.tickets = resp.tickets; 
      
    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })
  }


  /**
   * Método para editar tickets
   * @param ticket => Ticket a modificar
   */
  public modalEditTicket = (ticket:any) =>{
    this.editTicket =  ticket;

    this.FormEditTicket = this.fb.group({
      asunto: [this.editTicket['asunto_tic'], [Validators.required, Validators.minLength(5)]],
      mensaje: [this.editTicket['mensaje_tic'], [Validators.required, Validators.minLength(20)]],
    })

  }



  /**
   * Método para contestar tickets
   * @param ticket => Ticket a modificar
   */
  public modalContestTicket = (ticket:any) =>{
    this.responTicket =  ticket;

  }



  /**
   * Método para actualizar ticket por id
   * @param idTicket => ID ticket
   */
  public editarTicket = (idTicket:string) =>{

    this.ticketServ.updateTicketService( this.FormEditTicket.value, idTicket ).subscribe( (resp:any) =>{

      if(resp.ok){
        Swal.fire('Bien hecho!', resp.msg, 'success');
        setTimeout(() => { window.location.reload(); }, 2000);
      }

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })

  }




  /**
   * Método para contestar ticket por id
   * @param Ticket => ticket
   */
  public contestarTicket = (ticket:any) =>{
    this.formSubmitted = true;

    console.log(ticket)

    if ( this.FormAnswerTicket.invalid ) {
      return; 
    }

    this.ticketServ.upResponTicketService( this.FormAnswerTicket.value, ticket.id_tic ).subscribe( (resp:any) =>{

      if(resp.ok){

        const json = {
          nombres: ticket.nombre_tic,
          apellidos: '',
          email: ticket.email_tic,
          asunto: `Respuesta al ticket ${ticket.id_tic} creado en LegalBF`,
          descripcion: `<p>Se ha dado respuesta por parte del administador a su ticket creado en LegalBF.</p>
                        <p>Ticket: ${ticket.id_tic}</p>
                        <p>Asunto: ${ticket.asunto_tic}</p>
                        <p>Mensaje: ${ticket.mensaje_tic}</p>
                        <p>Respuesta: ${this.FormAnswerTicket.get('respuesta').value}</p>
                        <br>
                        <p>Ingrese a: <a href="https://www.legalbf.com/" target="_blank">www.legalbf.com</a> y verifique su ticket.</p>
                        <br>
                        <b>Para más información, comuníquese con el administrador de LegalBF </b>
                        <br>
                        <p>©2021 - Todos los derechos reservados - es un servicio gratuito de LegalBG</p>`,
        }

        this.clienteSrs.sendEmailClienteService(json).subscribe( (resp2:any) =>{

          if( resp2.ok ){
            Swal.fire('Bien hecho!', resp.msg, 'success');
            setTimeout(() => { window.location.reload(); }, 2000);
          }

        }, (err) =>{
          //En caso de un error
          Swal.fire('Error', err.error.msg, 'error');
        })
        
      }

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })

  }




  /**
   * Método para eliminar tickets
   * @param idTicket => ID Ticket
   */
  public eliminarTicket = (idTicket:any) =>{
    
    Swal.fire({
      title: `Desea eliminar el Ticket ${idTicket}`,
      text: "Una vez eliminado no se puede recuperar!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {

      if (result.isConfirmed) {
        this.ticketServ.deleteTicketService(idTicket).subscribe( (resp:any) =>{
          
          Swal.fire('Bien hecho!', resp.msg, 'success');
          setTimeout(() => { window.location.reload(); }, 2000);
        
        }, (err) =>{
          //En caso de un error
          Swal.fire('Error', err.error.msg, 'error');
          console.log(err)
        })
      }

    })
  }




  public campoNoValido = (campo:any): boolean =>{
    if ( this.FormAnswerTicket.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }
  


}
