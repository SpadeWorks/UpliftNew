import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Utils } from '../utils';
import { Sheq } from './sheq';
import { Complaint } from '../common/Complaint';
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
  complaintStatusOptions = [
    { value: 'Submitted', label: 'Submitted' },
    { value: 'Assigned', label: 'Assigned' },
    { value: 'WIP', label: 'WIP' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Resolved', label: 'Resolved' },
    { value: 'Rejected', label: 'Rejected' },
  ];
  currentComplaintStatus = Constants.Globals.SUBMITTED;
  personResponsibleOptions = [];
  level1Disabled = true;
  level2Disabled = true;
  level3Disabled = true;
  level4Disabled = true;
  level4Data = [];
  itemID = 0;
  userType = [];
  isResonCodeDisabled = true;
  sheqForm: FormGroup;
  showStatus: boolean = false;
  scaControlsVisible = false;
  approverControlsVisible = false;
  responsiblePersongsControlVisible = false;
  complaintStatusVisible = false;
  formLoading = true;


  get products(): FormArray {
    return <FormArray>this.sheqForm.get('userControls.products');
  }

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: Constants.Globals.DATE_FORMAT,
    showTodayBtn: false
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
        comments: ''
      }),
      responsiblePersonControls: this.fb.group({
        rootCause: '',
        actionTaken: '',
        reasonCode: ['', Validators.required],
      }),
      complaintStatus: '',
      buttons: this.fb.group({
        cancel: 'Cancel',
        save: 'Submit'
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
                  this._DataService.getCurrentUserType(complaint.PersonResponsible.results).then((userType: string[]) => {
                    this.userType = userType;
                    if (userType.indexOf(Constants.Globals.UPLIFT_USER) > -1) {
                      this.sheqForm.disable();
                      controls.buttons.disable();
                      if (complaint.ComplaintStatus) {
                        this.complaintStatusVisible = true;
                      }

                      if (complaint.ComplaintStatus == Constants.Globals.ASSIGNED) {
                        this.scaControlsVisible = true;
                      }

                      if (complaint.ComplaintStatus == Constants.Globals.ASSIGNED &&
                        complaint.ApprovalStatus == Constants.Globals.YES) {
                        this.approverControlsVisible = true;
                      }

                      if (complaint.ComplaintStatus != Constants.Globals.SUBMITTED &&
                        complaint.ComplaintStatus != Constants.Globals.ASSIGNED &&
                        complaint.ApprovalStatus == Constants.Globals.YES) {
                        this.responsiblePersongsControlVisible = true;
                      }

                    }
                    if (userType.indexOf(Constants.Globals.UPLIFT_RESPONSIBLE_PERSON) > -1) {
                      if (complaint.ComplaintStatus != Constants.Globals.SUBMITTED &&
                        complaint.ApprovalStatus == Constants.Globals.YES) {
                        controls.responsiblePersonControls.enable();
                        controls.buttons.enable();
                        controls.complaintStatus.enable();
                        this.responsiblePersongsControlVisible = true;
                      }
                    }

                    if (userType.indexOf(Constants.Globals.UPLIFT_APPROVER) > -1) {
                      if (complaint.ComplaintStatus != Constants.Globals.SUBMITTED) {
                        controls.approverControls.enable();
                        controls.buttons.enable();
                        this.approverControlsVisible = true;
                      }
                    }

                    if (userType.indexOf(Constants.Globals.UPLIFT_SCA) > -1) {
                      controls.userControls.enable();
                      controls.scaControls.enable();
                      controls.complaintStatus.enable();
                      controls.buttons.enable();
                      if (complaint.ComplaintStatus != '') {
                        this.scaControlsVisible = true;
                      }
                    }
                    this.formLoading = false;
                  });
                })
              })
            })
          })

          this.currentComplaintStatus = complaint.ComplaintStatus;
          lastDeliveryDate = complaint.LastDeliveryDate ? new Date(complaint.LastDeliveryDate) : new Date();
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
              comments: complaint.ApproverComments
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
    } else {
      this.formLoading = false;
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
          this.personResponsibleOptions = [];
          $.map(data[0].PersonResponsible.results, (item, index) => {
            this.personResponsibleOptions.push({
              value: item.ID,
              label: `${item.FirstName} ${item.LastName}`
            })
          });
          console.log($.map(this.personResponsibleOptions, r => r.value.toString()));
          this.sheqForm.controls.scaControls.patchValue({
            personResponsible: $.map(this.personResponsibleOptions, r => r.value.toString()),
          })
          resolve(true);
        } else {
          this.personResponsibleOptions = [];
          this.sheqForm.controls.scaControls.patchValue({
            personResponsible: []
          })
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

  getISODate(date): string {
    return date ? new Date(date.date.year, date.date.month - 1, date.date.day).toISOString() : '';
  }
  getControlValue(controlName): any {
    let val
    return controlName ? ((val = this.sheqForm.get(controlName).value) ? val : '') : '';
  }

  updateComplaintID(id: number, ComplaintID: string) {
    return new Promise((resolve, reject) => {
      var obj = {
        ID: id,
        ComplaintID: ComplaintID,
        Title: ComplaintID
      }
      this._DataService.addOrUpdateItem(obj).then((data: any) => {
        resolve(data);
      }, err => {
        console.log(err);
        alert("Error occurred while submitting the form please resubmit.");
      });
    });
  }

  onCancel() {
    let source = this._utils.getUrlParameters("Source");
    window.location.href = source;
  }

  updateData() {
    return new Promise((resolve, reject) => {
      var self = this;
      var sheq = new Sheq();
      var complaintID;
      let control: any;
      var responsiblePersons = [];
      sheq.ID = self.itemID || 0;
      if (this.userType.indexOf(Constants.Globals.UPLIFT_USER) > -1) {
        sheq.DateOfIncident = this.getISODate(this.getControlValue("userControls.dateOfIncident")) || new Date().toISOString();
        sheq.CustomerNumber = this.getControlValue("userControls.customerNumber");
        sheq.CustomerName = this.getControlValue("userControls.customerName");
        sheq.CustomerContactName = this.getControlValue("userControls.contactPerson");
        sheq.CustomerContactDesignation = this.getControlValue("userControls.contactPersonDesignation");
        sheq.CustomerContact = this.getControlValue("userControls.contactNumber");
        sheq.ComplaintDetails = this.getControlValue("userControls.complaintDetails");
        sheq.Level1LookupId = +this.getControlValue("userControls.level1");
        sheq.Level2LookupId = +this.getControlValue("userControls.level2");
        sheq.Level3LookupId = +this.getControlValue("userControls.level3");
        sheq.Level4LookupId = +this.getControlValue("userControls.level4");
        sheq.Explanation = this.getControlValue("userControls.explanation");
        for (var index = 1; index <= 5; index++) {
          control = self.products.controls[index - 1];
          control = control ? control.controls : null;
          sheq['PackCode' + index] = control ? control["packCode"].value : '';
          sheq['ProductDescription' + index] = control ? control["productDescription"].value : '';
          sheq['BatchDetails' + index] = control ? control['batchDetails'].value : '';
          sheq['QuantityUnits' + index] = control && control["quantityUnit"].value ?
            control["quantityUnit"].value.toString() : '';
          sheq['QuantityShrink' + index] = control && control["quantityShrink"].value ?
            control["quantityShrink"].value.toString() : '';
          sheq['QuantityCases' + index] = control && control["quantityCases"].value ?
            control["quantityCases"].value.toString() : '';
          sheq['QuantityPallet' + index] = control && control["quantityPallet"].value ?
            control["quantityPallet"].value.toString() : '';
        }
      }
      if (this.userType.indexOf(Constants.Globals.UPLIFT_SCA) > -1) {
        sheq.SiteName = this.getControlValue("scaControls.productionSite");
        responsiblePersons = this.getControlValue("scaControls.personResponsible");
        if (responsiblePersons) {
          responsiblePersons = $.map(responsiblePersons, r => +r);
          sheq.PersonResponsibleId = { results: responsiblePersons };
        }
      }
      if (this.userType.indexOf(Constants.Globals.UPLIFT_APPROVER) > -1) {
        sheq.ApprovalStatus = this.getControlValue("approverControls.approvalStatus");
        if (sheq.ApprovalStatus && sheq.ApprovalStatus.toLowerCase() == Constants.Globals.NO.toLowerCase()) {
          sheq.ComplaintStatus = Constants.Globals.REJECTED;
        }
        sheq.InvoiceNumber = this.getControlValue("approverControls.invoiceNumber");
        sheq.InvoiceValue = this.getControlValue("approverControls.invoiceValue");
        sheq.ApproverComments = this.getControlValue("approverControls.comments");
        sheq.LastDeliveryDate = this.getISODate(this.getControlValue("approverControls.lastDeliveryDate")) || new Date().toISOString();
      }
      if (this.userType.indexOf(Constants.Globals.UPLIFT_RESPONSIBLE_PERSON) > -1) {
        sheq.RootCause = this.getControlValue("responsiblePersonControls.rootCause");
        sheq.ActionTaken = this.getControlValue("responsiblePersonControls.actionTaken");
        sheq.ReasonCode = this.getControlValue("responsiblePersonControls.reasonCode");
      }

      sheq.ComplaintStatus = sheq.ComplaintStatus ||
        this.getControlValue("complaintStatus") || Constants.Globals.SUBMITTED;


      sheq.SubmittedOn = new Date().toISOString();
      sheq.ContentTypeId = Constants.Globals.sheqContentTypeID;
      console.log(sheq);
      self._DataService.addOrUpdateItem(sheq).then((data: any) => {
        var currentItemID = self.itemID || data.data.ID;
        complaintID = self._DataService.generateComplaintID(currentItemID, 5, "SHEQ");
        if (self.newAttachments.length) {
          self._DataService.addAttachment(currentItemID, self.newAttachments).then(response => {
            this.updateComplaintID(currentItemID, complaintID).then(d => {
              resolve({ id: currentItemID, complaintID: complaintID });
            })
          }, error => {
            reject(error);
          });
        } else {
          this.updateComplaintID(currentItemID, complaintID).then(d => {
            resolve({ id: currentItemID, complaintID: complaintID });
          })
        }
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  handleSuccess(data) {

    if (!this._utils.getUrlParameters("ID")) {
      alert(`Data submitted successfully. ${data.complaintID} is your complaint ID for future reference.`);
      window.location.href = window.location.href = (<any>window)._spPageContextInfo.siteAbsoluteUrl; //window.location.href.replace('?', `?ID=${data.id}&`);
    } else {
      window.location.href = (<any>window)._spPageContextInfo.siteAbsoluteUrl
    }
    this.formLoading = false;
    this.sheqForm.controls.buttons.enable();
  }

  handleError(data) {
    this.sheqForm.controls.buttons.enable();
    this.formLoading = false;
    alert(`Following error occured while submitting the form : \n err`);
  }

  onSubmit() {
    var self = this;
    this.sheqForm.controls.buttons.disable();
    this.formLoading = true;
    if (this.userType.length > 0) {
      this.updateData().then(data => {
        this.handleSuccess(data);
      }, err => {
        this.handleError(err)
      });
    } else {
      this._DataService.getCurrentUserType([]).then((userType: string[]) => {
        this.userType = userType;
        this.updateData().then(data => {
          this.handleSuccess(data);
        }, err => {
          this.handleError(err);
        })
      });
    }
  }
}


