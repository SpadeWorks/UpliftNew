import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Utils } from '../utils';
import { Sheq } from './sheq';
import * as $ from 'jquery';
import * as Constants from '../constants';
import { Product } from "./product";
import Promise from "ts-promise";
import {
  FormBuilder, FormGroup, FormControl,
  FormArray, Validators, FormControlName, AbstractControl
} from '@angular/forms';
import { flatten } from '@angular/compiler';
import * as moment from 'moment';
@Component({
  selector: 'app-sheq',
  templateUrl: './sheq.component.html',
  styleUrls: ['./sheq.component.css']
})
export class SheqComponent implements OnInit {

  constructor(private fb: FormBuilder, private _DataService: DataService, private _utils: Utils) { }
  baseSiteUrl = `${location.protocol}//${location.hostname}`;
  attachments = [];
  newAttachments = [];
  reasonCodes = [{ value: '', label: 'Select' }];
  level1Options = [{ value: '', label: 'Select' }];
  level2Options = [{ value: '', label: 'Select' }];
  level3Options = [{ value: '', label: 'Select' }];
  level4Options = [{ value: '', label: 'Select' }];
  approvalStatusOptions = [{value: 'Yes', label: 'Yes'}, {value: 'No', label: 'No'}];
  complaintStatusOptions = [{value: 'Submitted', label: 'Submitted'}, {value: 'Assigned', label: 'Assigned'}];
  level1Disabled = true;
  level2Disabled = true;
  level3Disabled = true;
  level4Disabled = true;
  level4Data = [];
  itemID = 0;
  userType = Constants.Globals.ADMIN;
  isResonCodeDisabled = true;
  sheqForm: FormGroup;

  get products(): FormArray {
    return <FormArray>this.sheqForm.get('products');
  }

  ngOnInit() {
    var product;
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
      attachments: '',
      complaintStatus: '',
      approvalStatus: '',
      invoiceNumber: '',
      invoiceValue: '',
      lastDeliveryDate: '',
    });

    this._DataService.getCurrentUserType().then(userType => {
      this.userType = <string>userType;
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
          $.when(this.level1Change(complaint.Level1Lookup.ID),
            this.level2Change(complaint.Level2Lookup.ID),
            this.level3Change(complaint.Level3Lookup.ID),
            this.level4Change(complaint.Level4Lookup.ID)).then((leve1, level2, level3, level4) => {
              this.sheqForm.patchValue({
                level1: complaint.Level1Lookup.ID,
                level2: complaint.Level2Lookup.ID,
                level3: complaint.Level3Lookup.ID,
                level4: complaint.Level4Lookup.ID,
                explanation: complaint.Explanation,
              });
              this.level1Disabled = false;
              this.level2Disabled = false;
              this.level3Disabled = false;
              this.level4Disabled = false;
            })
          this.sheqForm.patchValue({
            dateOfIncident: moment(complaint.DateOfIncident).format("MM/DD/YYYY"),
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
            complaintStatus: complaint.ComplaintStatus
          });

          if (complaint.PackCode1) {
            this.products.removeAt(0);
            product = new Product(complaint.PackCode1,
              complaint.ProductDescription1,
              complaint.BatchDetails1,
              complaint.QuantityUnit1,
              complaint.QuantityShrink1,
              complaint.QuantityCases1,
              complaint.QuantityPallet1);
            this.products.push(this.buildProduct(product));
          }
          if (complaint.PackCode2) {
            product = new Product(complaint.PackCode2,
              complaint.ProductDescription2,
              complaint.BatchDetails2,
              complaint.QuantityUnit2,
              complaint.QuantityShrink2,
              complaint.QuantityCases2,
              complaint.QuantityPallet2);
            this.products.push(this.buildProduct(product));
          }
          if (complaint.PackCode3) {
            product = new Product(complaint.PackCode3,
              complaint.ProductDescription3,
              complaint.BatchDetails3,
              complaint.QuantityUnit3,
              complaint.QuantityShrink3,
              complaint.QuantityCases3,
              complaint.QuantityPallet3);
            this.products.push(this.buildProduct(product));
          }
          if (complaint.PackCode4) {
            product = new Product(complaint.PackCode4,
              complaint.ProductDescription4,
              complaint.BatchDetails4,
              complaint.QuantityUnit4,
              complaint.QuantityShrink4,
              complaint.QuantityCases4,
              complaint.QuantityPallet4);
            this.products.push(this.buildProduct(product));
          }
          if (complaint.PackCode5) {
            product = new Product(complaint.PackCode5,
              complaint.ProductDescription5,
              complaint.BatchDetails5,
              complaint.QuantityUnit5,
              complaint.QuantityShrink5,
              complaint.QuantityCases5,
              complaint.QuantityPallet5);
            this.products.push(this.buildProduct(product));
          }
          if (complaint.Attachments) {
            this._DataService.getAttachments(this.itemID).then((data: any) => {
              this.attachments = [];
              $.map(data.files, (item, index) => {
                this.attachments.push({
                  name: item.FileName,
                  url: `${this.baseSiteUrl}${item.ServerRelativePath.DecodedUrl}`,
                  isAttached: true
                });
              });
            }, error => {
              console.log(error);
            })
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
  }

  buildProduct(product?: Product): FormGroup {
    return this.fb.group({
      packCode: product ? product.PackCode : '',
      productDescription: product ? product.ProductDescription : '',
      batchDetails: product ? product.BatchDetails : '',
      quantityUnit: product ? product.QuantityUnit : '',
      quantityShrink: product ? product.QuantityShrink : '',
      quantityCases: product ? product.QuantityCases : '',
      quantityPallet: product ? product.QuantityPallet : ''
    })
  }

  addPackCode(): void {
    if (this.products.length < 5) {
      this.products.push(this.buildProduct());
    }
  }

  onRemovePackCode(index) {
    this.products.removeAt(index);
  }

  level1Change(ID) {
    return new Promise((resolve, reject) => {
      if (ID) {
        this.sheqForm.patchValue({
          level2: '',
        });
        this.level2Disabled = true;
        this._DataService.getLevel2Data(ID).then(data => {
          this.level2Options = [{ value: '', label: 'Select' }];
          this.level3Options = [{ value: '', label: 'Select' }];
          this.level4Options = [{ value: '', label: 'Select' }];
          $.each(data, (index, item) => {
            this.level2Options.push({ value: item.ID, label: item.Title });
          });
          this.level2Disabled = false;
          resolve(true);
        });
      }
    });
  }
  level2Change(ID) {
    return new Promise((resolve, reject) => {
      if (ID) {
        this.sheqForm.patchValue({
          level3: '',
        });
        this.level3Disabled = true;
        this._DataService.getLevel3Data(ID).then(data => {
          this.level3Options = [{ value: '', label: 'Select' }];
          this.level4Options = [{ value: '', label: 'Select' }];
          $.each(data, (index, item) => {
            this.level3Options.push({ value: item.ID, label: item.Title });
          });
          this.level3Disabled = false;
          resolve(true);
        });
      }
    })
  }
  level3Change(ID) {
    return new Promise((resolve, reject) => {
      if (ID) {
        this.sheqForm.patchValue({
          level4: '',
        });
        this.level4Disabled = true;
        this._DataService.getLevel4Data(ID).then((data: any[]) => {
          this.level4Data = data;
          this.level4Options = [{ value: '', label: 'Select' }];
          $.each(data, (index, item) => {
            this.level4Options.push({ value: item.ID, label: item.Title });
          });
          this.level4Disabled = false;
        });
      }
    });
  }

  level4Change(ID) {
    return new Promise((resolve, reject) => {
      if (ID) {
        var selectedItem = this.level4Data.filter(item => item.ID == ID);
        if (selectedItem.length) {
          this.sheqForm.patchValue({
            explanation: selectedItem[0][Constants.LossTreeLevel4Master.EXPLANATION]
          });
        }
      }
    });
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

  onFildAdded($event) {
    var fileExists = false;
    var newFile = $event.target.files[0];
    $.map(this.attachments, (item, index) => {
      if (item.name === newFile.name) {
        fileExists = true;
        return false;
      }
    })
    if (!fileExists) {
      this.newAttachments.push(newFile);
      this.attachments.push(newFile);
    } else {
      alert(`File with Name: "${newFile.name}" alredy attached.`);
    }
  }

  onRemoveAttachment(removedFile: any) {
    this.attachments = this.attachments.filter((item: any) => {
      return item.name != removedFile.name;
    });

    this.newAttachments = this.newAttachments.filter((item: any) => {
      return item.name != removedFile.name;
    });

    if (this.itemID) {
      this._DataService.deleteAttachemnt(this.itemID, removedFile.name).then(data => {
        console.log("File deleted");
      }, error => {
        console.log(`Error occured in file deletion : ${error}`);
      });
    }
  }

  onSubmit(formValues) {
    console.log("Form submitted: ", this.sheqForm);
    var sheq = new Sheq();
    var date = $("#dateIncident").val();
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

    for (var index = 1; index <= 5; index++) {
      let control = this.sheqForm.controls.products.value[index - 1];
      sheq['PackCode' + index] = control ? control["packCode"] : '';
      sheq['ProductDescription' + index] = control ? control["productDescription"] : '';
      sheq['BatchDetails' + index] = control ? control['batchDetails'] : '';
      sheq['QuantityUnits' + index] = control ? control["quantityUnit"] : '';
      sheq['QuantityShrink' + index] = control ? control["quantityShrink"] : '';
      sheq['QuantityCases' + index] = control ? control["quantityCases"] : '';
      sheq['QuantityPallet' + index] = control ? control["quantityPallet"] : '';
    }

    sheq.RootCause = this.sheqForm.get("rootCause").value;
    sheq.ActionTaken = this.sheqForm.get("actionTaken").value;
    sheq.ReasonCode = this.sheqForm.get("reasonCode").value;
    sheq.Level1LookupId = +this.sheqForm.get("level1").value;
    sheq.Level2LookupId = +this.sheqForm.get("level2").value;
    sheq.Level3LookupId = +this.sheqForm.get("level3").value;
    sheq.Level4LookupId = +this.sheqForm.get("level4").value;
    sheq.Explanation = this.sheqForm.get("explanation").value;
    sheq.ContentTypeId = "0x0100376BE29451A1A848B7458189992EFFE6";
    sheq.ComplaintStatus = this.sheqForm.get("complaintStatus").value;
    var self = this;
    var complaintID;
    this._DataService.addOrUpdateSheqItem(sheq).then((data: any) => {
      var currentItemID = this.itemID || data.data.ID;
      complaintID = this._DataService.generateComplaintID(currentItemID, 5, "SHEQ");
      if (this.newAttachments.length) {
        this._DataService.addAttachment(currentItemID, this.newAttachments).then(response => {
          alert(`Data submitted successfully. ${complaintID} is your complaint ID for future reference.`);
        }, error => {
          alert("Error occurred while submitting the form please resubmit.");
        });
      } else {
        alert(`Data submitted successfully. ${complaintID} is your complaint ID for future reference.`);
      }
    }, error => {
      console.log(error);
      alert("Error occurred while submitting the form please resubmit.");
    });
  }
}
