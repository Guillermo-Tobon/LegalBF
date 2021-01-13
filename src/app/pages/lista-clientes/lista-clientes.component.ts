import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ClientesService } from 'src/app/services/clientes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-clientes',
  templateUrl: './lista-clientes.component.html',
  styleUrls: ['./lista-clientes.component.css']
})
export class ListaClientesComponent implements OnInit {

  public usuarios:any[] = [];

  constructor(
              private clientesServ: ClientesService,
              private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarios()
  }


  /**
   * Método para obtener los usuarios
   */
  public obtenerUsuarios = () =>{
    this.clientesServ.getUsuariosService().subscribe( (data:any) =>{
      if(data.ok){

        this.usuarios = data.usuarios;

      } else {
        Swal.fire('Error', 'En este momento no podemos procesar la información. Inténtelo más tarde.', 'error');
        setTimeout(() => { this.router.navigateByUrl('/'); }, 1200);

      }

    }, (err) =>{
      //En caso de un error
      Swal.fire('Error', err.error.msg, 'error');
    })
  }



  /**
   * Método para ver detalle del usuario
   * @param usuario => Usuario especifico
   */
  public verDetalleCliente = (usuario:any) =>{
    const user = JSON.stringify(usuario);
    this.router.navigate(['dashboard/detalle-cliente', user]);
  }



}
