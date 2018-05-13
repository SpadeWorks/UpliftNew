import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Utils } from '../utils';
import { Sheq } from './sheq';
import * as $ from 'jquery';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { flatten } from '@angular/compiler';
@Component({
  selector: 'app-sheq',
  templateUrl: './sheq.component.html',
  styleUrls: ['./sheq.component.css']
})
export class SheqComponent implements OnInit {

  constructor(private fb: FormBuilder, private _DataService: DataService, private _utils: Utils) { }

  reasonCodes = [{ value: '', label: 'Select' }];
  level1Options = [{ value: '', label: 'Select' }];
  level2Options = [{ value: '', label: 'Select' }];
  level3Options = [{ value: '', label: 'Select' }];
  level4Options = [{ value: '', label: 'Select' }];
  level1Disabled = true;
  level2Disabled = true;
  level3Disabled = true;
  level4Disabled = true;


  isResonCodeDisabled = true;
  sheqForm: FormGroup;

  get products(): FormArray {
    return <FormArray>this.sheqForm.get('products');
  }

  ngOnInit() {
    this.sheqForm = this.fb.group({
      dateOfIncident: ['', [Validators.required]],
      productionSite: ['', Validators.required],
      personResponsible: '',
      customerNumber: ['', Validators.required],
      customerName: '',
      contactPerson: '',
      contactPersonDesignation: '',
      contactNumber: '',
      complaintDetails: '',
      rootCause: '',
      actionTaken: '',
      reasonCode: ['', Validators.required],
      level1: '',
      level2: '',
      level3: '',
      level4: '',
      explaination: '',
      products: this.fb.array([this.buildProduct()])
    });

    this._DataService.getReasonCodes().then(codes => {
      $.each(codes, (index, code) => {
        this.reasonCodes.push({ value: code.Title, label: code.Title });
        this.isResonCodeDisabled = false;
      });
    });

    this._DataService.getLevel1Data().then(data => {
      $.each(data, (index, item) => {
        this.level1Options.push({ value: item.ID, label: item.Title });
        this.level1Disabled = false;
      });
    });
  }

  buildProduct(): FormGroup {
    return this.fb.group({
      packCode: '',
      productDescription: '',
      batchDetails: '',
      quantityUnit: '',
      quantityShrink: '',
      quantityCases: '',
      quantityPallet: ''
    })
  }

  addPackCode(): void {
    if (this.products.length < 5) {
      this.products.push(this.buildProduct());
    }
  }

  level1Change(ID): void {
    if (ID) {
      this._DataService.getLevel2Data(ID).then(data => {
        $.each(data, (index, item) => {
          this.level2Options.push({ value: item.ID, label: item.Title });
          this.level2Disabled = false;
        });
      });
    }
  }
  level2Change(ID): void {
    if (ID) {
      this._DataService.getLevel3Data(ID).then(data => {
        $.each(data, (index, item) => {
          this.level3Options.push({ value: item.ID, label: item.Title });
          this.level3Disabled = false;
        });
      });
    }
  }
  level3Change(ID): void {
    if (ID) {
      this._DataService.getLevel4Data(ID).then(data => {
        $.each(data, (index, item) => {
          this.level4Options.push({ value: item.ID, label: item.Title });
          this.level4Disabled = false;
        });
      });
    }
  }

  level4Change(ID): void {
    if (ID) {
      this._DataService.getLevel4Data(ID).then((data: any) => {
        this.sheqForm.patchValue({
          explaination: 'test',
        });
      });
    }
  }

  dataServiceTester() {
    this._DataService.getPersonReponsible("Boksburg Powders").then(data => {
      console.log(data);
    });

    this._DataService.getProductInfo("21166838").then(data => {
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

  onCusomerNumberChange($event) {
    this._DataService.getCustomerInfo($event.target.value).then((data: any[]) => {
      if (data.length) {
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
