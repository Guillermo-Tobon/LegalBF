import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { TicketsService } from 'src/app/services/tickets.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public usuario:any[] = [];
  public tickets:any[] = [];
  public idioma:string;
  public bandera:any;

  constructor(
              private autServ: AuthService,
              private ticketServ: TicketsService,
              private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.usuario = this.autServ.usuario;
    
    this.alertBienvenida(this.usuario[0].nombres_us);
    
    if ( this.usuario[0].admin_us === 'Y' ) {
      this.getAllTickets();
      
    } else {
      this.getTicketsUsuario(this.usuario[0].id_us);
    }
    
    this.idioma = localStorage.getItem('idioma');
    this.translate.use(this.idioma);

    this.bandera = localStorage.getItem('bandera');
    if (!this.bandera) {
      this.bandera = 'flag-icon-us';
    }
  }



  /**
   * Método de mensaje
   * @param nombre => Nombre del usuario
   */
  public alertBienvenida = (nombre:string) =>{
    let trad = "";
    this.translate.get('Welcome').subscribe((res: string) =>{trad = res});

    const ingresado = localStorage.getItem('Ingresado') || '';
    if( ingresado === 'Si' ){
      Swal.fire({
        icon: 'success',
        title: `${trad}`,
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
      console.log(err)
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
      console.log(err)
    })
  }


  /**
   * Método para cambiar el idioma a francés
   * @param lang => Idioma 
   */
  public idiomaFrances = (lang:any) =>{
    localStorage.setItem('idioma', lang);
    localStorage.setItem('bandera', 'flag-icon-fr');
    this.translate.use(lang);
    setTimeout(() => { window.location.reload() }, 600);
  }

  /**
   * Método para cambiar el idioma a inglés
   * @param lang => Idioma 
   */
   public idiomaIngles = (lang:any) =>{
    localStorage.setItem('idioma', lang);
    localStorage.setItem('bandera', 'flag-icon-us');
    this.translate.use(lang);
    setTimeout(() => { window.location.reload() }, 600);
  }

  /**
   * Método para cambiar el idioma a español
   * @param lang => Idioma 
   */
   public idiomaEspanol = (lang:any) =>{
    localStorage.setItem('idioma', lang);
    localStorage.setItem('bandera', 'flag-icon-es');
    this.translate.use(lang);
    setTimeout(() => { window.location.reload() }, 600);
  }



  /**
   * Método para cerrar sesión user
   */
  public logoutUser = () =>{
    let traTitle;
    let traText;
    let traButton;
    this.translate.get('DoWantLogOut').subscribe((res: string) =>{traTitle = res});
    this.translate.get('RememberProcessedData').subscribe((res: string) =>{traText = res});
    this.translate.get('YesLogOut').subscribe((res: string) =>{traButton = res});

    Swal.fire({
      title: `${traTitle}`,
      text: `${traText}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `${traButton}`
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => { this.autServ.logoutService(); }, 1200);
      }
    })

  }

}
