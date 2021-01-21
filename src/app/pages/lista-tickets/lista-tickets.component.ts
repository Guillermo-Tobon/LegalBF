import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-lista-tickets',
  templateUrl: './lista-tickets.component.html',
  styleUrls: ['./lista-tickets.component.css']
})
export class ListaTicketsComponent implements OnInit {

  public usuario:any[] = [];
  public tickets:any[] = [];
  public editTicket:{} = {};

  constructor(
              private authServ: AuthService,
              private ticketServ: TicketsService
  ) { }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario;

    if ( this.usuario[0].admin_us === 'Y' ) {
      this.getAllTickets();
      
    } else {
      this.getTicketsUsuario(this.usuario[0].id_us);
      
    }
    
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
  }



  public contestarTicket = (ticket:any) =>{

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
  


}
