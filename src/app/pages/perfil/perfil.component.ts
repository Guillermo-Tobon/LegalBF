import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public usuario:any[] = [];
  public estado:string;

  constructor(
              private authServ: AuthService
  ) { }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario;
  
    if (this.usuario[0].estado_us === 1) {
      this.estado = 'ACTIVE';
    } else {
      this.estado = 'INACTIVE';        
    }
  }

}
