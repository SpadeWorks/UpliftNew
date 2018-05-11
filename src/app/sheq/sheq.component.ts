import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Utils } from '../utils';
import { Sheq } from './sheq';
import * as $ from 'jquery';
@Component({
  selector: 'app-sheq',
  templateUrl: './sheq.component.html',
  styleUrls: ['./sheq.component.css']
})
export class SheqComponent implements OnInit {

  constructor(private _DataService: DataService, private _utils: Utils) { }

  reasonCodes = [{value: 'Select', label: 'Select'}];
  isResonCodeDisabled = true;
  ngOnInit() {
    this._DataService.getPersonReponsible("Boksburg Powders").then(data => {
      console.log(data);
    });

    this._DataService.getProductInfo("21166838").then(data => {
      console.log(data);
    })

    this._DataService.getReasonCodes().then(codes => {
      $.each(codes, (index, code)=>{

          this.reasonCodes.push({value: code.Title, label: code.Title});
          this.isResonCodeDisabled = false;
      })
      console.log(this.reasonCodes);
    })

    this._DataService.getLevel1Data().then(data => {
      console.log(data);
    })

    this._DataService.getLevel2Data("1").then(data => {
      console.log(data);
    })

    this._DataService.getLevel3Data("1").then(data => {
      console.log(data);
    })

    this._DataService.getLevel4Data("1").then(data => {
      console.log(data);
    })

    this._DataService.getComplaintByID("1").then(data => {
      console.log(data);
    })
  }

  onCusomerNumberChange($event){
    this._DataService.getCustomerInfo($event.target.value).then((data: any[]) => {
      if(data.length){
        this.Sheq.customerName = data[0]["CustomerName"];  
      }
      
    })
  }

  Sheq: Sheq = {
    dateOfIncident: '',
    productionSite: '',
    personResponsible: [],
    customerNumber: '',
    customerName: '',
    contactPerson: '',
    contactPersonDesignation: '',
    contactNumber: '',
    complaintDetails: '',
    packCode1: '',
    packCode2: '',
    packCode3: '',
    packCode4: '',
    packCode5: '',
    productDescription: '',
    batchDetails: '',
    quantityUnit1: '',
    quantityUnit2: '',
    quantityUnit3: '',
    quantityUnit4: '',
    quantityUnit5: '',
    quantityShrink1: '',
    quantityShrink2: '',
    quantityShrink3: '',
    quantityShrink4: '',
    quantityShrink5: '',
    quantityCases1: '',
    quantityCases2: '',
    quantityCases3: '',
    quantityCases4: '',
    quantityCases5: '',
    quantityPallet1: '',
    quantityPallet2: '',
    quantityPallet3: '',
    quantityPallet4: '',
    quantityPallet5: '',
    rootCause: '',
    actionTaken: '',
    reasonCode: '',
    level1: '',
    level2: '',
    level3: '',
    level4: '',
    explaination: '',
    attachments: [],
    upliftNumber: ''
  }

  onSubmit(formValues) {
    console.log("Form submitted: ", formValues);
  }

}
