import { Component, OnInit } from '@angular/core';
import { Utils } from './utils';
import * as Constants from './constants';
import {
  FormBuilder, FormGroup, FormControl,
  FormArray, Validators, FormControlName, AbstractControl
} from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private _utils: Utils, private fb: FormBuilder) {

  }
  contentTypeID: string = this._utils.getUrlParameters('ContentTypeId');
  contentType: string = this._utils.getUrlParameters('ContentyType');
  isSheq: boolean;
  createButtons: FormGroup;
  siteUrl: string = (<any>window)._spPageContextInfo.siteAbsoluteUrl;
  ngOnInit() {

    this.createButtons = this.fb.group({
      sheq: '+ Add SHEQ Complaint',
      nca: '+ Add NCA Complaint'
    });
    if (this.contentTypeID &&
          this.contentTypeID.toLowerCase().indexOf(Constants.Globals.sheqContentTypeID.toLowerCase()) > -1 ||
          this.contentType && this.contentType.toLowerCase() === Constants.Globals.sheqContentType.toLowerCase()) {
        this.isSheq = true;
        this.createButtons.controls.sheq.disable();
    } else{
      this.createButtons.controls.nca.disable();
      this.isSheq = false;
    }
  }

  addNCA(){
    window.location.href = this.siteUrl +
                            '/Pages/Complaint.aspx?' +
                            'Source=/teams/dev_upliftquality' +
                            '&ContentTypeId=' + Constants.Globals.ncaContentTypeID;
  }

  addSheq(){
    window.location.href = this.siteUrl +
                            '/Pages/Complaint.aspx?' +
                            'Source=/teams/dev_upliftquality' +
                            '&ContentTypeId=' + Constants.Globals.sheqContentTypeID;
  }
}
