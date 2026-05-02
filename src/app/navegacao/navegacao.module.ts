import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component/home.component";
import { FooterComponent } from "./footer.component/footer.component";
import { MenuComponent } from "./menu.component/menu.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";



@NgModule({
    declarations: [       
    ],
    imports: [
            CommonModule,
            RouterModule,   
            HomeComponent,
            MenuComponent,
            FooterComponent         
    ],
    exports: [
        HomeComponent,
        MenuComponent,
        FooterComponent
    ]
})
export class NavegacaoModule {}