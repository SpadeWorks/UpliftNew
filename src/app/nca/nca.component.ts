import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Utils } from '../utils';
import { Nca } from './nca';
import { Complaint } from '../common/Complaint';
import * as $ from 'jquery';
import * as Constants from '../constants';
import Promise from "ts-promise";
import {
  FormBuilder, FormGroup, FormControl,
  FormArray, Validators, FormControlName, AbstractControl
} from '@angular/forms';
import { flatten } from '@angular/compiler';
import * as moment from 'moment';
import { IMyDpOptions } from 'mydatepicker';
@Component({
  selector: 'app-nca',
  templateUrl: './nca.component.html',
  styleUrls: ['./nca.component.css']
})
export class NcaComponent implements OnInit {
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

  quantityOptions = [
    { value: 'Units', label: 'Units' },
    { value: 'Shrink', label: 'Shrink' },
    { value: 'Case', label: 'Case' },
    { value: 'Pallet', label: 'Pallet' }
  ];

  personResponsibleOptions = [];
  level1Disabled = true;
  level2Disabled = true;
  level3Disabled = true;
  level4Disabled = true;
  level4Data = [];
  itemID = 0;
  userType = [];
  isResonCodeDisabled = true;
  ncaForm: FormGroup;
  showStatus: boolean = false;
  scaControlsVisible = false;
  approverControlsVisible = false;
  responsiblePersongsControlVisible = false;
  complaintStatusVisible = false;
  formLoading = true;
  get products(): FormArray {
    return <FormArray>this.ncaForm.get('userControls.products');
  }

  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: Constants.Globals.DATE_FORMAT,
    showTodayBtn: false
  };

  ngOnInit() {
    var product;
    var lastDeliveryDate;
    var dateOfIncident;
    var expiryDate;

    this.ncaForm = this.fb.group({
      userControls: this.fb.group({
        dateOfIncident: ['', [Validators.required]],
        customerNumber: ['', Validators.required],
        plantNumber: '',
        plantName: '',
        plantContactName: '',
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
        attachments: '',
        packCode1: '',
        productDescription1: '',
        expiryDate: '',
        quantity: '',
        quantityUnit: '',
        remedyNumber: '',
        deliveryNumber: ''

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

    const controls = this.ncaForm.controls;
    this._DataService.getLevel1Data().then(data => {
      $.each(data, (index, item) => {
        this.level1Options.push({ value: item.ID, label: item.Title });
        this.level1Disabled = false;
      });
    });


    this.itemID = +this._utils.getUrlParameters("ID");
    if (this.itemID) {
      this.ncaForm.disable();
      this._DataService.getComplaintByID(this.itemID).then((complaint: Nca) => {
        if (complaint) {
          this.showStatus = true;
          this.onProductionSiteChange(complaint.SiteName).then(data => {
            if (data) {
              this.ncaForm.controls.scaControls.patchValue({
                productionSite: complaint.SiteName,
                personResponsible: $.map(complaint.PersonResponsible.results, r => r.ID.toString()),
              })
            }
          });

          this.level1Change(complaint.Level1LookupId).then(d => {
            this.level2Change(complaint.Level2LookupId).then(d => {
              this.level3Change(complaint.Level3LookupId).then(d => {
                this.level4Change(complaint.Level4LookupId).then(() => {
                  this.ncaForm.patchValue({
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
                      this.ncaForm.disable();
                      controls.buttons.disable();
                      if (complaint.ComplaintStatus) {
                        this.complaintStatusVisible = true;
                      }

                      if (complaint.ComplaintStatus == Constants.Globals.ASSIGNED) {
                        this.scaControlsVisible = true;
                      }

                      if (complaint.ComplaintStatus != Constants.Globals.SUBMITTED &&
                        complaint.ComplaintStatus != Constants.Globals.ASSIGNED) {
                        this.responsiblePersongsControlVisible = true;
                      }

                    }
                    if (userType.indexOf(Constants.Globals.UPLIFT_RESPONSIBLE_PERSON) > -1) {
                      this.ncaForm.disable();
                      controls.responsiblePersonControls.enable();
                      controls.buttons.enable();
                      controls.complaintStatus.enable();
                      if (complaint.ComplaintStatus != Constants.Globals.SUBMITTED) {
                        this.responsiblePersongsControlVisible = true;
                      }
                    }

                    if (userType.indexOf(Constants.Globals.UPLIFT_SCA) > -1) {
                      controls.userControls.enable();
                      controls.scaControls.enable();
                      controls.complaintStatus.enable();
                      controls.buttons.enable();
                      if (complaint.ComplaintStatus == Constants.Globals.SUBMITTED) {
                        this.scaControlsVisible = true;
                      }
                    }
                    this.formLoading = false;
                  });
                })
              })
            })
          })
          lastDeliveryDate = complaint.LastDeliveryDate ? new Date(complaint.LastDeliveryDate) : new Date();
          dateOfIncident = complaint.DateOfIncident ? new Date(complaint.DateOfIncident) : new Date();
          expiryDate = complaint.BBEExpiry ? new Date(complaint.BBEExpiry) : new Date(),
            this.ncaForm.patchValue({
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
                complaintDetails: complaint.ComplaintDetails,
                explanation: complaint.Explanation,
                plantNumber: complaint.PlantNumber,
                plantName: complaint.PlantNumber,
                plantContactName: complaint.PlantContactName,
                packCode1: complaint.PackCode1,
                productDescription1: complaint.ProductDescription1,
                expiryDate: {
                  date: {
                    year: expiryDate.getFullYear(),
                    month: expiryDate.getMonth() + 1,
                    day: expiryDate.getDate()
                  }
                },
                quantity: complaint.Quantity,
                quantityUnit: complaint.QuantityUnit,
                remedyNumber: complaint.RemedyNumber,
                deliveryNumber: complaint.DeliveryNumber,
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
          this.ncaForm.controls.scaControls.patchValue({
            personResponsible: $.map(this.personResponsibleOptions, r => r.value.toString()),
          })
          resolve(true);
        } else {
          this.personResponsibleOptions = [];
          this.ncaForm.controls.scaControls.patchValue({
            personResponsible: []
          })
          resolve(true);
        }
      })
    })
  }

  onRemovePackCode(index) {
    this.products.removeAt(index);
  }

  level1Change(ID) {
    return new Promise((resolve, reject) => {
      if (ID) {
        this.ncaForm.patchValue({
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
        this.ncaForm.patchValue({
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
        this.ncaForm.patchValue({
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
          this.ncaForm.patchValue({
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
        this.ncaForm.patchValue({
          userControls: {
            customerName: data[0]["CustomerName"],
          }
        });
      }
    })
  }

  onPlantNumberChange($event) {
    this._DataService.getPlantInfo($event.target.value).then((data: any[]) => {
      if (data.length) {
        this.ncaForm.patchValue({
          userControls: {
            plantName: data[0][Constants.PlantMaster.PLANT_NAME],
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
    return controlName ? ((val = this.ncaForm.get(controlName).value) ? val : '') : '';
  }

  onCancel() {
    let source = this._utils.getUrlParameters("Source");
    window.location.href = source;
  }

  updateData() {
    return new Promise((resolve, reject) => {
      var self = this;
      var nca = new Nca();
      var complaintID;
      let control: any;
      var responsiblePersons = [];
      nca.ID = self.itemID || 0;

      if (this.userType.indexOf(Constants.Globals.UPLIFT_USER) > -1) {
        nca.DateOfIncident = this.getISODate(this.getControlValue("userControls.dateOfIncident")) || new Date().toISOString();
        nca.PlantNumber = this.getControlValue("userControls.plantNumber");
        nca.PlantName = this.getControlValue("userControls.plantName");
        nca.PlantContactName = this.getControlValue("userControls.plantContactName");
        nca.CustomerNumber = this.getControlValue("userControls.customerNumber");
        nca.CustomerName = this.getControlValue("userControls.customerName");
        nca.ComplaintDetails = this.getControlValue("userControls.complaintDetails");
        nca.PackCode1 = this.getControlValue("userControls.packCode1");
        nca.ProductDescription1 = this.getControlValue("userControls.productDescription1");
        nca.BBEExpiry = this.getISODate(this.getControlValue("userControls.expiryDate")) || new Date().toISOString();
        nca.Quantity = this.getControlValue("userControls.quantity").toString();
        nca.QuantityUnit = this.getControlValue("userControls.quantityUnit");
        nca.RemedyNumber = this.getControlValue("userControls.remedyNumber");
        nca.DeliveryNumber = this.getControlValue("userControls.deliveryNumber");
        nca.QuantityUnit = this.getControlValue("userControls.quantityUnit");
        nca.Level1LookupId = +this.getControlValue("userControls.level1");
        nca.Level2LookupId = +this.getControlValue("userControls.level2");
        nca.Level3LookupId = +this.getControlValue("userControls.level3");
        nca.Level4LookupId = +this.getControlValue("userControls.level4");
        nca.Explanation = this.getControlValue("userControls.explanation");
      }
      if (this.userType.indexOf(Constants.Globals.UPLIFT_SCA) > -1) {
        nca.SiteName = this.getControlValue("scaControls.productionSite");
        responsiblePersons = this.getControlValue("scaControls.personResponsible");
        if (responsiblePersons) {
          responsiblePersons = $.map(responsiblePersons, r => +r);
          nca.PersonResponsibleId = { results: responsiblePersons };
        }
      }
      if (this.userType.indexOf(Constants.Globals.UPLIFT_RESPONSIBLE_PERSON) > -1) {
        nca.RootCause = this.getControlValue("responsiblePersonControls.rootCause");
        nca.ActionTaken = this.getControlValue("responsiblePersonControls.actionTaken");
        nca.ReasonCode = this.getControlValue("responsiblePersonControls.reasonCode");
      }
      nca.ComplaintStatus = this.getControlValue("complaintStatus") || "Submitted";
      nca.ContentTypeId = Constants.Globals.ncaContentTypeID;
      console.log(nca);
      self._DataService.addOrUpdateItem(nca).then((data: any) => {
        var currentItemID = self.itemID || data.data.ID;
        complaintID = self._DataService.generateComplaintID(currentItemID, 5, "nca");
        if (self.newAttachments.length) {
          self._DataService.addAttachment(currentItemID, self.newAttachments).then(response => {
            resolve({ id: currentItemID, complaintID: complaintID });
          }, error => {
            reject(error);
          });
        } else {
          resolve({ id: currentItemID, complaintID: complaintID });
        }
      }, error => {
        console.log(error);
        alert("Error occurred while submitting the form please resubmit.");
        self.ncaForm.controls.buttons.enable();
      });
    })
  }

  handleSuccess(data) {
    this.ncaForm.controls.buttons.enable();
    this.formLoading = true;
    if (!this._utils.getUrlParameters("ID")) {
      alert(`Data submitted successfully. ${data.complaintID} is your complaint ID for future reference.`);
      window.location.href = window.location.href.replace('?', `?ID=${data.id}&`);
    } else {
      window.location.href = window.location.href;
    }
  }

  handleError(data) {
    this.ncaForm.controls.buttons.enable();
    this.formLoading = true;
    alert(`Following error occured while submitting the form : \n err`);
  }

  onSubmit() {
    var self = this;
    this.ncaForm.controls.buttons.disable();
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


