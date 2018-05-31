import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { NcaComponent } from './nca/nca.component';
import { SheqComponent } from './sheq/sheq.component';
import { DataService } from './data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { DisableControlDirective } from './shared/disable-control.directive';
import { MyDatePickerModule } from 'mydatepicker';
import { LoadersCssModule } from 'angular2-loaders-css';
import { OnlyNumberDirective } from './shared/only-number.directive';
@NgModule({
  declarations: [
    AppComponent,
    NcaComponent,
    SheqComponent,
    DisableControlDirective,
    OnlyNumberDirective,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MyDatePickerModule,
    LoadersCssModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
