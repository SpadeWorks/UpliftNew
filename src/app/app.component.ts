import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  contentType: string = this.getContentTypeID(); 
  getContentTypeID(){
    return "sheq_ct";
    // if "0x01001AA8E025B7527C4E899AF6E59161B6DA"
    // else "nca_ct";
  }
}
