import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public usuario:any[] = [];
  public tickets:any[] = [];

  constructor(
              private autServ: AuthService,
              private ticketServ: TicketsService,
  ) { }

  ngOnInit(): void {
    this.usuario = this.autServ.usuario;

    this.alertBienvenida(this.usuario[0].nombres_us);

    if ( this.usuario[0].admin_us === 'Y' ) {
      this.getAllTickets();
      
    } else {
      this.getTicketsUsuario(this.usuario[0].id_us);
    }

  }



  /**
   * Método de mensaje
   * @param nombre => Nombre del usuario
   */
  public alertBienvenida = (nombre:string) =>{
    const ingresado = localStorage.getItem('Ingresado') || '';
    if( ingresado === 'Si' ){
      Swal.fire({
        icon: 'success',
        title: `Bienvenido(a)`,
        text: `${nombre}`,
        showConfirmButton: false,
        timer: 2500
      });
      localStorage.removeItem('Ingresado');
    }
  }



  /**
   * Método para obtener todos los tickets
   */
  public getAllTickets = () =>{
    this.ticketServ.getAllTicketsService().subscribe( (resp:any) =>{

      if(resp.ok){
        this.tickets = resp.tickets || []; 
       
      }

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

      this.tickets = resp.tickets || []; 
      
    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })
  }




  /**
   * Método para cerrar sesión user
   */
  public logoutUser = () =>{

    Swal.fire({
      title: 'Desea cerrar sesión?',
      text: "Recuerde verificar todos los datos procesados!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Cerrar Sesión!'
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => { this.autServ.logoutService(); }, 1200);
      }
    })

  }

}
