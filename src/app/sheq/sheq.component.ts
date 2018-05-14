import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Utils } from '../utils';
import { Sheq } from './sheq';
import * as $ from 'jquery';
import * as Constants from '../constants';
import {
  FormBuilder, FormGroup, FormControl,
  FormArray, Validators, FormControlName, AbstractControl
} from '@angular/forms';
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
  itemID = 0;


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
      explanation: '',
      products: this.fb.array([this.buildProduct()]),
      attachments: ''
    });

    this._DataService.getLevel1Data().then(data => {
      $.each(data, (index, item) => {
        this.level1Options.push({ value: item.ID, label: item.Title });
        this.level1Disabled = false;
      });
    });

    this.itemID = +this._utils.getUrlParameters("ID");
    if (this.itemID) {
      this._DataService.getComplaintByID(this.itemID).then((data: any) => {
        if (data.length) {
          var complaint: any = data[0];
          this.level1Options.push({ value: complaint.Level1Lookup.ID, label: complaint.Level1Lookup.Title });
          this.level1Change(complaint.Level1Lookup.ID);
          this.level2Options.push({ value: complaint.Level2Lookup.ID, label: complaint.Level2Lookup.Title });
          this.level2Change(complaint.Level2Lookup.ID);
          this.level3Options.push({ value: complaint.Level3Lookup.ID, label: complaint.Level3Lookup.Title });
          this.level3Change(complaint.Level3Lookup.ID);
          this.level4Options.push({ value: complaint.Level4Lookup.ID, label: complaint.Level4Lookup.Title });
          this.level4Change(complaint.Level4Lookup.ID);
          this.level1Disabled = false;
          this.level2Disabled = false;
          this.level3Disabled = false;
          this.level4Disabled = false;

          this.sheqForm.patchValue({
            dateOfIncident: complaint.DateOfIncident,
            productionSite: complaint.SiteName,
            // personResponsible: complaint.PersonResponsible,
            customerNumber: complaint.CustomerNumber,
            customerName: complaint.CustomerName,
            contactPerson: complaint.CustomerContactName,
            contactPersonDesignation: complaint.CustomerContactDesignation,
            contactNumber: complaint.CustomerContact,
            complaintDetails: complaint.ComplaintDetails,
            rootCause: complaint.RootCause,
            actionTaken: complaint.ActionTaken,
            reasonCode: complaint.ReasonCode,
            level1: complaint.Level1Lookup.ID,
            level2: complaint.Level2Lookup.ID,
            level3: complaint.Level3Lookup.ID,
            level4: complaint.Level4Lookup.ID,
            explanation: complaint.Explanation,
          });

          if(complaint.packCode1){
            this.products.push()
          }
        }
      })
    }

    this._DataService.getReasonCodes().then(codes => {
      $.each(codes, (index, code) => {
        this.reasonCodes.push({ value: code.Title, label: code.Title });
        this.isResonCodeDisabled = false;
      });
    });

    

    $(".uploadedFileList").on("click", ".removeUploadedFile", (e) => {
      console.log("Deleting file.");
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
          this.level2Options = [{ value: '', label: 'Select' }];
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
          this.level3Options = [{ value: '', label: 'Select' }];
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
          this.level4Options = [{ value: '', label: 'Select' }];
          this.level4Options.push({ value: item.ID, label: item.Title });
          this.level4Disabled = false;
        });
      });
    }
  }

  level4Change(ID): void {
    if (ID) {
      this._DataService.getLevel4Data(ID).then((data: any) => {
        if (data.length) {
          this.sheqForm.patchValue({
            explanation: data[0][Constants.LossTreeLevel4Master.EXPLANATION]
          });
        }
      });
    }
  }

  onCusomerNumberChange($event) {
    this._DataService.getCustomerInfo($event.target.value).then((data: any[]) => {
      if (data.length) {
        this.sheqForm.patchValue({
          customerName: data[0]["CustomerName"],
        });
      }
    })
  }

  addFile(event) {
    this._DataService.addAttachment(12, event.target.files);
  }



  onSubmit(formValues) {
    console.log("Form submitted: ", this.sheqForm);
    var sheq = new Sheq();
    var date = this.sheqForm.get("dateOfIncident").value;
    if (date) {
      var dateObj = new Date(date);
      var isoDate = dateObj.toISOString();
      sheq.DateOfIncident = isoDate;
    }

    sheq.SiteName = this.sheqForm.get("productionSite").value;
    // sheq.PersonResponsible = this.sheqForm.get("personResponsible").value;
    sheq.ID = this.itemID || 0;
    sheq.CustomerNumber = this.sheqForm.get("customerNumber").value;
    sheq.CustomerName = this.sheqForm.get("customerName").value;
    sheq.CustomerContactName = this.sheqForm.get("contactPerson").value;
    sheq.CustomerContactDesignation = this.sheqForm.get("contactPersonDesignation").value;
    sheq.CustomerContact = this.sheqForm.get("contactNumber").value;
    sheq.ComplaintDetails = this.sheqForm.get("complaintDetails").value;

    $.each(this.sheqForm.controls.products.value, (i, control) => {
      var index = i + 1;
      sheq['PackCode' + index] = control["packCode"];
      sheq['ProductDescription' + index] = control["productDescription"];
      sheq['BatchDetails' + index] = control['batchDetails'];
      sheq['QuantityUnits' + index] = control["quantityUnit"];
      sheq['QuantityShrink' + index] = control["quantityShrink"];
      sheq['QuantityCases' + index] = control["quantityCases"];
      sheq['QuantityPallet' + index] = control["quantityPallet"];
    });
    sheq.RootCause = this.sheqForm.get("rootCause").value;
    sheq.ActionTaken = this.sheqForm.get("actionTaken").value;
    sheq.ReasonCode = this.sheqForm.get("reasonCode").value;
    sheq.Level1LookupId = +this.sheqForm.get("level1").value;
    sheq.Level2LookupId = +this.sheqForm.get("level2").value;
    sheq.Level3LookupId = +this.sheqForm.get("level3").value;
    sheq.Level4LookupId = +this.sheqForm.get("level4").value;
    sheq.Explanation = this.sheqForm.get("explanation").value;
    sheq.ContentTypeId = "0x0100376BE29451A1A848B7458189992EFFE6";

    this._DataService.addOrUpdateSheqItem(sheq).then(data => {
      console.log(data);
      alert("Data submitted successfully.");
    }, error => {
      console.log(error);
      alert("Error occurred while submitting the form please resubmit.");
    });
  }
}
