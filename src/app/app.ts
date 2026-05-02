import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './navegacao/menu.component/menu.component';
import { FooterComponent } from './navegacao/footer.component/footer.component';
import { HomeComponent } from "./navegacao/home.component/home.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
