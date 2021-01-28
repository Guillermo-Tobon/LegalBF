import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public usuario:any[] = [];

  constructor(
              private autServ: AuthService
  ) { }

  ngOnInit(): void {
    this.usuario = this.autServ.usuario;

    this.alertBienvenida(this.usuario[0].nombres_us);
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
