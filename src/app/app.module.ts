import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { NcaComponent } from './nca/nca.component';
import { SheqComponent } from './sheq/sheq.component';
import { DataService } from './data.service';

@NgModule({
  declarations: [
    AppComponent,
    NcaComponent,
    SheqComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
