import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Utils } from '../utils';
import { Sheq } from './sheq';
import { Complaint } from './Complaint';
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
import { IMyDpOptions } from 'mydatepicker';
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
  approvalStatusOptions = [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
  complaintStatusOptions = [{ value: 'Submitted', label: 'Submitted' }, { value: 'Assigned', label: 'Assigned' }];
  personResponsibleOptions = [];
  level1Disabled = true;
  level2Disabled = true;
  level3Disabled = true;
  level4Disabled = true;
  level4Data = [];
  itemID = 0;
  userType = Constants.Globals.ADMIN;
  isResonCodeDisabled = true;
  sheqForm: FormGroup;
  showStatus: boolean = false;


  get products(): FormArray {
    return <FormArray>this.sheqForm.get('userControls.products');
  }

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: Constants.Globals.DATE_FORMAT,
  };

  ngOnInit() {
    var product;
    var lastDeliveryDate;
    var dateOfIncident;

    this.sheqForm = this.fb.group({
      userControls: this.fb.group({
        dateOfIncident: ['', [Validators.required]],
        customerNumber: ['', Validators.required],
        customerName: '',
        contactPerson: '',
        contactPersonDesignation: '',
        contactNumber: '',
        complaintDetails: '',
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        explanation: '',
        products: this.fb.array([this.buildProduct()]),
        attachments: ''
      }),
      scaControls: this.fb.group({
        productionSite: ['', Validators.required],
        personResponsible: '',
      }),
      approverControls: this.fb.group({
        approvalStatus: '',
        invoiceNumber: '',
        invoiceValue: '',
        lastDeliveryDate: '',
      }),
      responsiblePersonControls: this.fb.group({
        rootCause: '',
        actionTaken: '',
        reasonCode: ['', Validators.required],
      }),
      complaintStatus: '',
      buttons: this.fb.group({
        cancel: 'Cancel',
        save: 'Save'
      })
    });

    const controls = this.sheqForm.controls;
    this._DataService.getLevel1Data().then(data => {
      $.each(data, (index, item) => {
        this.level1Options.push({ value: item.ID, label: item.Title });
        this.level1Disabled = false;
      });
    });


    this.itemID = +this._utils.getUrlParameters("ID");
    if (this.itemID) {
      this.sheqForm.disable();
      this._DataService.getComplaintByID(this.itemID).then((complaint: Sheq) => {
        if (complaint) {
          this.showStatus = true;
          this.onProductionSiteChange(complaint.SiteName).then(data => {
            if (data) {
              this.sheqForm.controls.scaControls.patchValue({
                productionSite: complaint.SiteName,
                personResponsible: $.map(complaint.PersonResponsible.results, r => r.ID.toString()),
              })
            }
          });

          this.level1Change(complaint.Level1LookupId).then(d => {
            this.level2Change(complaint.Level2LookupId).then(d => {
              this.level3Change(complaint.Level3LookupId).then(d => {
                this.level4Change(complaint.Level4LookupId).then(() => {
                  this.sheqForm.patchValue({
                    userControls: {
                      level1: complaint.Level1LookupId,
                      level2: complaint.Level2LookupId,
                      level3: complaint.Level3LookupId,
                      level4: complaint.Level4LookupId,
                      explanation: complaint.Explanation
                    }
                  });

                  // Enable or Disable controls based on user access.
                  this._DataService.getCurrentUserType().then(userType => {
                    this.userType = <string>userType;
                    if (this.userType == Constants.Globals.UPLIFT_SCA) {
                      controls.userControls.enable();
                      controls.scaControls.enable();
                      controls.complaintStatus.enable();
                      controls.buttons.enable();
                    } else if (this.userType == Constants.Globals.UPLIFT_APPROVER) {
                      this.sheqForm.disable();
                      controls.approverControls.enable();
                      controls.buttons.enable();
                    } else if (this.userType == Constants.Globals.UPLIFT_RESPONSIBLE_PERSON) {
                      this.sheqForm.disable();
                      controls.responsiblePersonControls.enable();
                      controls.buttons.enable();
                    } else {
                      this.sheqForm.disable();
                      controls.buttons.disable();
                    }
                  });
                })
              })
            })
          })
          lastDeliveryDate = complaint.LastDeliveryDate? new Date(complaint.LastDeliveryDate) : new Date();
          dateOfIncident = complaint.DateOfIncident ? new Date(complaint.LastDeliveryDate) : new Date();
          this.sheqForm.patchValue({
            userControls: {
              dateOfIncident: {
                date: {
                  year: dateOfIncident.getFullYear(),
                  month: dateOfIncident.getMonth() + 1,
                  day: dateOfIncident.getDate()
                }
              },
              productionSite: complaint.SiteName,
              customerNumber: complaint.CustomerNumber,
              customerName: complaint.CustomerName,
              contactPerson: complaint.CustomerContactName,
              contactPersonDesignation: complaint.CustomerContactDesignation,
              contactNumber: complaint.CustomerContact,
              complaintDetails: complaint.ComplaintDetails,
              explanation: complaint.Explanation,
            },
            scaControls: {
              productionSite: complaint.SiteName,
              // personResponsible: complaint.PersonResponsible ,
            },
            approverControls: {
              approvalStatus: complaint.ApprovalStatus,
              invoiceNumber: complaint.InvoiceNumber,
              invoiceValue: complaint.InvoiceValue,
              lastDeliveryDate: {
                date: {
                  year: lastDeliveryDate.getFullYear(),
                  month: lastDeliveryDate.getMonth() + 1,
                  day: lastDeliveryDate.getDate()
                }
              },
            },
            responsiblePersonControls: {
              rootCause: complaint.RootCause,
              actionTaken: complaint.ActionTaken,
              reasonCode: complaint.ReasonCode,
            },
            complaintStatus: complaint.ComplaintStatus
          });

          if (complaint.PackCode1) {
            this.products.removeAt(0);
            product = new Product(complaint.PackCode1,
              complaint.ProductDescription1,
              complaint.BatchDetails1,
              complaint.QuantityUnits1,
              complaint.QuantityShrink1,
              complaint.QuantityCases1,
              complaint.QuantityPallet1);
            this.products.push(this.buildProduct(product));
          }
          if (complaint.PackCode2) {
            product = new Product(complaint.PackCode2,
              complaint.ProductDescription2,
              complaint.BatchDetails2,
              complaint.QuantityUnits2,
              complaint.QuantityShrink2,
              complaint.QuantityCases2,
              complaint.QuantityPallet2);
            this.products.push(this.buildProduct(product));
          }
          if (complaint.PackCode3) {
            product = new Product(complaint.PackCode3,
              complaint.ProductDescription3,
              complaint.BatchDetails3,
              complaint.QuantityUnits3,
              complaint.QuantityShrink3,
              complaint.QuantityCases3,
              complaint.QuantityPallet3);
            this.products.push(this.buildProduct(product));
          }
          if (complaint.PackCode4) {
            product = new Product(complaint.PackCode4,
              complaint.ProductDescription4,
              complaint.BatchDetails4,
              complaint.QuantityUnits4,
              complaint.QuantityShrink4,
              complaint.QuantityCases4,
              complaint.QuantityPallet4);
            this.products.push(this.buildProduct(product));
          }
          if (complaint.PackCode5) {
            product = new Product(complaint.PackCode5,
              complaint.ProductDescription5,
              complaint.BatchDetails5,
              complaint.QuantityUnits5,
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

  onProductionSiteChange(siteName) {
    return new Promise((resolve, reject) => {
      this._DataService.getPersonReponsible(siteName).then((data: any) => {
        if (data.length) {
          $.map(data[0].PersonResponsible.results, (item, index) => {
            this.personResponsibleOptions.push({
              value: item.ID,
              label: `${item.FirstName} ${item.LastName}`
            })
          });
          resolve(true);
        }
      })
    })
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
          userControls: {
            level2: ''
          }
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
          userControls: {
            level3: ''
          }
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
          userControls: {
            level4: ''
          }
        });
        this.level4Disabled = true;
        this._DataService.getLevel4Data(ID).then((data: any[]) => {
          this.level4Data = data;
          this.level4Options = [{ value: '', label: 'Select' }];
          $.each(data, (index, item) => {
            this.level4Options.push({ value: item.ID, label: item.Title });
          });
          this.level4Disabled = false;
          resolve(true);
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
            userControls: {
              explanation: selectedItem[0][Constants.LossTreeLevel4Master.EXPLANATION]
            }
          });
        }
        resolve(true);
      }
    });
  }

  onCusomerNumberChange($event) {
    this._DataService.getCustomerInfo($event.target.value).then((data: any[]) => {
      if (data.length) {
        this.sheqForm.patchValue({
          userControls: {
            customerName: data[0]["CustomerName"],
          }
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

  getISODate(date): string{
    return new Date(date.date.year, date.date.month -1 , date.date.day).toISOString();
  }

  onSubmit(formValues) {
    this.sheqForm.controls.buttons.disable();
    var self = this;
    self._DataService.getCurrentUserType().then(userType => {
      var sheq = new Sheq();
      var complaintID;
      let control: any;
      var responsiblePersons = [];
      self.userType = <string>userType;
      sheq.ID = self.itemID || 0;
      if (self.userType == Constants.Globals.UPLIFT_APPROVER) {
        sheq.ApprovalStatus = self.sheqForm.get("approverControls.approvalStatus").value;
        sheq.InvoiceNumber = self.sheqForm.get("approverControls.invoiceNumber").value;
        sheq.InvoiceValue = self.sheqForm.get("approverControls.invoiceValue").value;
        sheq.LastDeliveryDate = this.getISODate(self.sheqForm.get("approverControls.lastDeliveryDate").value);
      } else if (self.userType == Constants.Globals.UPLIFT_RESPONSIBLE_PERSON) {
        sheq.RootCause = self.sheqForm.get("responsiblePersonControls.rootCause").value;
        sheq.ActionTaken = self.sheqForm.get("responsiblePersonControls.actionTaken").value;
        sheq.ReasonCode = self.sheqForm.get("responsiblePersonControls.reasonCode").value;
        sheq.ComplaintStatus = self.sheqForm.get("complaintStatus").value;
      } else if (self.userType == Constants.Globals.UPLIFT_SCA || self.userType == Constants.Globals.UPLIFT_USER) {
        var date = $("#dateIncident").val();
        sheq.DateOfIncident = this.getISODate(self.sheqForm.get("userControls.dateOfIncident").value);
        sheq.CustomerNumber = self.sheqForm.get("userControls.customerNumber").value;
        sheq.CustomerName = self.sheqForm.get("userControls.customerName").value;
        sheq.CustomerContactName = self.sheqForm.get("userControls.contactPerson").value;
        sheq.CustomerContactDesignation = self.sheqForm.get("userControls.contactPersonDesignation").value;
        sheq.CustomerContact = self.sheqForm.get("userControls.contactNumber").value;
        sheq.ComplaintDetails = self.sheqForm.get("userControls.complaintDetails").value;
        for (var index = 1; index <= 5; index++) {
          control = self.products.controls[index - 1];
          control = control ? control.controls : null;
          sheq['PackCode' + index] = control ? control["packCode"].value : '';
          sheq['ProductDescription' + index] = control ? control["productDescription"].value : '';
          sheq['BatchDetails' + index] = control ? control['batchDetails'].value : '';
          sheq['QuantityUnits' + index] = control ? control["quantityUnit"].value : '';
          sheq['QuantityShrink' + index] = control ? control["quantityShrink"].value : '';
          sheq['QuantityCases' + index] = control ? control["quantityCases"].value : '';
          sheq['QuantityPallet' + index] = control ? control["quantityPallet"].value : '';
        }
        sheq.Level1LookupId = +self.sheqForm.get("userControls.level1").value;
        sheq.Level2LookupId = +self.sheqForm.get("userControls.level2").value;
        sheq.Level3LookupId = +self.sheqForm.get("userControls.level3").value;
        sheq.Level4LookupId = +self.sheqForm.get("userControls.level4").value;
        sheq.Explanation = self.sheqForm.get("userControls.explanation").value;
        sheq.ContentTypeId = "0x0100376BE29451A1A848B7458189992EFFE6";
        sheq.ComplaintStatus = "Submitted";
        if (self.userType == Constants.Globals.UPLIFT_SCA) {
          sheq.SiteName = self.sheqForm.get("scaControls.productionSite").value;
          sheq.ComplaintStatus = self.sheqForm.get("complaintStatus").value;
          responsiblePersons = self.sheqForm.get("scaControls.personResponsible").value;
          responsiblePersons = $.map(responsiblePersons, r => +r);
          sheq.PersonResponsibleId = { results: responsiblePersons };
        }
      }
      self._DataService.addOrUpdateSheqItem(sheq).then((data: any) => {
        var currentItemID = self.itemID || data.data.ID;
        complaintID = self._DataService.generateComplaintID(currentItemID, 5, "SHEQ");
        if (self.newAttachments.length) {
          self._DataService.addAttachment(currentItemID, self.newAttachments).then(response => {
            self.sheqForm.controls.buttons.enable();
            if(!self._utils.getUrlParameters("ID")){
              window.location.href = window.location.href.replace('?', `?ID=${currentItemID}&`);
            }
            alert(`Data submitted successfully. ${complaintID} is your complaint ID for future reference.`);
          }, error => {
            alert("Error occurred while submitting the form please resubmit.");
            self.sheqForm.controls.buttons.enable();
          });
        } else {
          if(!self._utils.getUrlParameters("ID")){
            window.location.href = window.location.href.replace('?', `?ID=${currentItemID}&`);
          }
          alert(`Data submitted successfully. ${complaintID} is your complaint ID for future reference.`);
          self.sheqForm.controls.buttons.enable();
        }
      }, error => {
        console.log(error);
        alert("Error occurred while submitting the form please resubmit.");
        self.sheqForm.controls.buttons.enable();
      });
    });
  }
}
