import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public usuario:any[] = [];

  constructor(
    private autServ: AuthService
  ) { }

  ngOnInit(): void {
    this.usuario = this.autServ.usuario;
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
