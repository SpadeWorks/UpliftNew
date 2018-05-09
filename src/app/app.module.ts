import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NcaComponent } from './nca/nca.component';
import { SheqComponent } from './sheq/sheq.component';

@NgModule({
  declarations: [
    AppComponent,
    NcaComponent,
    SheqComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
