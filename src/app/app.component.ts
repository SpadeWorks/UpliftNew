import { Component, OnInit } from '@angular/core';
import { Utils } from './utils';
import * as Constants from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private _utils: Utils) {

  }
  contentTypeID: string = this._utils.getUrlParameters('ContentTypeId');
  contentType: string = this._utils.getUrlParameters('ContentyType');
  isSheq: boolean;

  ngOnInit() {
    if (this.contentTypeID == Constants.Globals.sheqContentTypeID ||
      this.contentType == Constants.Globals.sheqContentType) {
        this.isSheq = true;
    } else{
      this.isSheq = false;
    }
  }

  addNCA(){
    window.location.href = (<any>window)._spPageContextInfo.siteAbsoluteUrl + 
                            "/Pages/Complaint.aspx?" +
                            "Source=" + window.location.href.split("?")[0] + 
                            "&ContentTypeId=" + Constants.Globals.ncaContentTypeID;
  }

  addSheq(){
    window.location.href = (<any>window)._spPageContextInfo.siteAbsoluteUrl + 
                            "/Pages/Complaint.aspx?" +
                            "Source=" + window.location.href.split("?")[0] + 
                            "&ContentTypeId=" + Constants.Globals.sheqContentTypeID;
  }
}
