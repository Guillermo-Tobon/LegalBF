import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public usuario:any[] = [];
  public estado:string;

  constructor(
              private authServ: AuthService,
              private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.usuario = this.authServ.usuario;
    this.translate.use(localStorage.getItem('idioma'));

    let traActive;
    let traInactive;
    this.translate.get('active').subscribe((res: string) =>{traActive = res});
    this.translate.get('inactive').subscribe((res: string) =>{traInactive = res});
  
    if (this.usuario[0].estado_us === 1) {
      this.estado = `${traActive}`;
    } else {
      this.estado = `${traInactive}`;        
    }
  }


}
