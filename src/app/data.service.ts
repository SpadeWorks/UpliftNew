import { Injectable } from '@angular/core';
import Promise from "ts-promise";
import * as Constants from './constants';
import * as pnp from '../../node_modules/sp-pnp-js/dist/pnp.min';
import { Utils } from './utils';
import { Sheq } from './sheq/sheq';
import * as $ from 'jquery';
import { resolve } from 'q';


@Injectable({
  providedIn: 'root'
})

export class DataService {
  constructor(private _Utils: Utils) {
    // declare var SP: any;
    pnp.setup({
      sp: {
        headers: {
          "Accept": "application/json;odata=verbose",
        }
      }
    });
  }

  getComplaintByID(ID: number) {
    return new Promise((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(Constants.Lists.COMPLAINTS).items
        .filter(`${Constants.Complaints.ID} eq '${ID}'`)
        .select(`${Constants.Complaints.ID},\
${Constants.Complaints.DATE_OF_INCIDENT},\
${Constants.Complaints.SITE_NAME},\
${Constants.Complaints.PERSON_RESPONSIBLE}/ID,\
${Constants.Complaints.PERSON_RESPONSIBLE}/FirstName,\
${Constants.Complaints.PERSON_RESPONSIBLE}/LastName,\
${Constants.Complaints.CUSTOMER_NUMBER},\
${Constants.Complaints.CUSTOMER_NAME},\
${Constants.Complaints.CUSTOMER_CONTACT_NAME},\
${Constants.Complaints.CUSTOMER_CONTACT_DESIGNATION},\
${Constants.Complaints.CUSTOMER_CONTACT},\
${Constants.Complaints.COMPLAINT_DETAILS},\
${Constants.Complaints.PACKCODE1},\
${Constants.Complaints.PACKCODE2},\
${Constants.Complaints.PACKCODE3},\
${Constants.Complaints.PACKCODE4},\
${Constants.Complaints.PACKCODE5},\
${Constants.Complaints.PRODUCTDESCRIPTION1},\
${Constants.Complaints.PRODUCTDESCRIPTION2},\
${Constants.Complaints.PRODUCTDESCRIPTION3},\
${Constants.Complaints.PRODUCTDESCRIPTION4},\
${Constants.Complaints.PRODUCTDESCRIPTION5},\
${Constants.Complaints.BATCH_DETAILS_1},\
${Constants.Complaints.BATCH_DETAILS_2},\
${Constants.Complaints.BATCH_DETAILS_3},\
${Constants.Complaints.BATCH_DETAILS_4},\
${Constants.Complaints.BATCH_DETAILS_5},\
${Constants.Complaints.Quantity_Cases_1},\
${Constants.Complaints.Quantity_Cases_2},\
${Constants.Complaints.Quantity_Cases_3},\
${Constants.Complaints.Quantity_Cases_4},\
${Constants.Complaints.Quantity_Cases_5},\
${Constants.Complaints.QUANTITY_PALLET_1},\
${Constants.Complaints.QUANTITY_PALLET_2},\
${Constants.Complaints.QUANTITY_PALLET_3},\
${Constants.Complaints.QUANTITY_PALLET_4},\
${Constants.Complaints.QUANTITY_PALLET_5},\
${Constants.Complaints.QUANTITY_SHRINK_1},\
${Constants.Complaints.QUANTITY_SHRINK_2},\
${Constants.Complaints.QUANTITY_SHRINK_3},\
${Constants.Complaints.QUANTITY_SHRINK_4},\
${Constants.Complaints.QUANTITY_SHRINK_5},\
${Constants.Complaints.QUANTITY_UNITS_1},\
${Constants.Complaints.QUANTITY_UNITS_2},\
${Constants.Complaints.QUANTITY_UNITS_3},\
${Constants.Complaints.QUANTITY_UNITS_4},\
${Constants.Complaints.QUANTITY_UNITS_5},\
${Constants.Complaints.REASON_CODE},\
${Constants.Complaints.LEVEL1_LOOKUP}/ID,\
${Constants.Complaints.LEVEL1_LOOKUP}/Title,\
${Constants.Complaints.LEVEL2_LOOKUP}/ID,\
${Constants.Complaints.LEVEL2_LOOKUP}/Title,\
${Constants.Complaints.LEVEL3_LOOKUP}/ID,\
${Constants.Complaints.LEVEL3_LOOKUP}/Title,\
${Constants.Complaints.LEVEL4_LOOKUP}/ID,\
${Constants.Complaints.LEVEL4_LOOKUP}/Title,\
${Constants.Complaints.EXPLANATION},\
${Constants.Complaints.REMEDY_NUMBER},\
${Constants.Complaints.ATTACHMENTS},\
${Constants.Complaints.COMPLAINT_STATUS},\
${Constants.Complaints.INVOICE_NUMBER},\
${Constants.Complaints.INVOICE_VALUE},\
${Constants.Complaints.LAST_DELIVERY_DATE},\
${Constants.Complaints.ROOT_CAUSE},\
${Constants.Complaints.ACTION_TAKEN},\
${Constants.Complaints.Approver_Comments},\
${Constants.Complaints.PLANT_NAME},\
${Constants.Complaints.PLANT_NUMBER},\
${Constants.Complaints.PLANT_CONTACT_NAME},\
${Constants.Complaints.PACKCODE1},\
${Constants.Complaints.PRODUCTDESCRIPTION1},\
${Constants.Complaints.BBE_EXPIRY},\
${Constants.Complaints.QUANTITY},\
${Constants.Complaints.QUANTITY_UNIT},\
${Constants.Complaints.REMEDY_NUMBER},\
${Constants.Complaints.DELIVERY_NUMBER},\
${Constants.Complaints.APPROVAL_STATUS}`)
        .expand(`${Constants.Complaints.LEVEL1_LOOKUP},\
${Constants.Complaints.LEVEL2_LOOKUP},\
${Constants.Complaints.LEVEL3_LOOKUP},\
${Constants.Complaints.LEVEL4_LOOKUP},\
${Constants.Complaints.PERSON_RESPONSIBLE}`)
        .get().then(data => {
          var c = data[0];
          var sheq: Sheq = {
            ID: c[ID],
            DateOfIncident: c[Constants.Complaints.DATE_OF_INCIDENT],
            SiteName: c[Constants.Complaints.SITE_NAME],
            PersonResponsible: c[Constants.Complaints.PERSON_RESPONSIBLE],
            PersonResponsibleId: c[Constants.Complaints.PERSON_RESPONSIBLE],
            CustomerNumber: c[Constants.Complaints.CUSTOMER_NUMBER],
            CustomerName: c[Constants.Complaints.CUSTOMER_NAME],
            CustomerContactName: c[Constants.Complaints.CUSTOMER_CONTACT_NAME],
            CustomerContactDesignation: c[Constants.Complaints.CUSTOMER_CONTACT_DESIGNATION],
            CustomerContact: c[Constants.Complaints.CUSTOMER_CONTACT],
            ComplaintDetails: c[Constants.Complaints.COMPLAINT_DETAILS],
            PackCode1: c[Constants.Complaints.PACKCODE1],
            PackCode2: c[Constants.Complaints.PACKCODE2],
            PackCode3: c[Constants.Complaints.PACKCODE3],
            PackCode4: c[Constants.Complaints.PACKCODE4],
            PackCode5: c[Constants.Complaints.PACKCODE5],
            ProductDescription1: c[Constants.Complaints.PRODUCTDESCRIPTION1],
            ProductDescription2: c[Constants.Complaints.PRODUCTDESCRIPTION2],
            ProductDescription3: c[Constants.Complaints.PRODUCTDESCRIPTION3],
            ProductDescription4: c[Constants.Complaints.PRODUCTDESCRIPTION4],
            ProductDescription5: c[Constants.Complaints.PRODUCTDESCRIPTION5],
            BatchDetails1: c[Constants.Complaints.BATCH_DETAILS_1],
            BatchDetails2: c[Constants.Complaints.BATCH_DETAILS_2],
            BatchDetails3: c[Constants.Complaints.BATCH_DETAILS_3],
            BatchDetails4: c[Constants.Complaints.BATCH_DETAILS_4],
            BatchDetails5: c[Constants.Complaints.BATCH_DETAILS_5],
            QuantityCases1: c[Constants.Complaints.Quantity_Cases_1],
            QuantityCases2: c[Constants.Complaints.Quantity_Cases_2],
            QuantityCases3: c[Constants.Complaints.Quantity_Cases_3],
            QuantityCases4: c[Constants.Complaints.Quantity_Cases_4],
            QuantityCases5: c[Constants.Complaints.Quantity_Cases_5],
            QuantityPallet1: c[Constants.Complaints.QUANTITY_PALLET_1],
            QuantityPallet2: c[Constants.Complaints.QUANTITY_PALLET_2],
            QuantityPallet3: c[Constants.Complaints.QUANTITY_PALLET_3],
            QuantityPallet4: c[Constants.Complaints.QUANTITY_PALLET_4],
            QuantityPallet5: c[Constants.Complaints.QUANTITY_PALLET_5],
            QuantityShrink1: c[Constants.Complaints.QUANTITY_SHRINK_1],
            QuantityShrink2: c[Constants.Complaints.QUANTITY_SHRINK_2],
            QuantityShrink3: c[Constants.Complaints.QUANTITY_SHRINK_3],
            QuantityShrink4: c[Constants.Complaints.QUANTITY_SHRINK_4],
            QuantityShrink5: c[Constants.Complaints.QUANTITY_SHRINK_5],
            QuantityUnits1: c[Constants.Complaints.QUANTITY_UNITS_1],
            QuantityUnits2: c[Constants.Complaints.QUANTITY_UNITS_2],
            QuantityUnits3: c[Constants.Complaints.QUANTITY_UNITS_3],
            QuantityUnits4: c[Constants.Complaints.QUANTITY_UNITS_4],
            QuantityUnits5: c[Constants.Complaints.QUANTITY_UNITS_5],
            ReasonCode: c[Constants.Complaints.REASON_CODE],
            Level1Lookup: c[Constants.Complaints.LEVEL1_LOOKUP]['Title'],
            Level1LookupId: c[Constants.Complaints.LEVEL1_LOOKUP]['ID'],
            Level2Lookup: c[Constants.Complaints.LEVEL2_LOOKUP]['Title'],
            Level2LookupId: c[Constants.Complaints.LEVEL2_LOOKUP]['ID'],
            Level3Lookup: c[Constants.Complaints.LEVEL3_LOOKUP]['Title'],
            Level3LookupId: c[Constants.Complaints.LEVEL3_LOOKUP]['ID'],
            Level4Lookup: c[Constants.Complaints.LEVEL4_LOOKUP]['Title'],
            Level4LookupId: c[Constants.Complaints.LEVEL4_LOOKUP]['ID'],
            Explanation: c[Constants.Complaints.EXPLANATION],
            Attachments: c[Constants.Complaints.ATTACHMENTS],
            ComplaintStatus: c[Constants.Complaints.COMPLAINT_STATUS],
            InvoiceNumber: c[Constants.Complaints.INVOICE_NUMBER],
            InvoiceValue: c[Constants.Complaints.INVOICE_VALUE],
            LastDeliveryDate: c[Constants.Complaints.LAST_DELIVERY_DATE],
            RootCause: c[Constants.Complaints.ROOT_CAUSE],
            ActionTaken: c[Constants.Complaints.ACTION_TAKEN],
            ApprovalStatus: c[Constants.Complaints.APPROVAL_STATUS],
            ContentTypeId: c[Constants.Complaints.CONTENT_TYPE_ID],
            ApproverComments: c[Constants.Complaints.Approver_Comments],
            PlantNumber: c[Constants.Complaints.PLANT_NUMBER],
            PlantName: c[Constants.Complaints.PLANT_NAME],
            PlantContactName: c[Constants.Complaints.PLANT_CONTACT_NAME],
            BBEExpiry: c[Constants.Complaints.BBE_EXPIRY],
            Quantity: c[Constants.Complaints.QUANTITY],
            QuantityUnit: c[Constants.Complaints.QUANTITY_UNIT],
            RemedyNumber: c[Constants.Complaints.REMEDY_NUMBER],
            DeliveryNumber: c[Constants.Complaints.DELIVERY_NUMBER]
          }
          resolve(sheq);
        }, error => {
          this._Utils.clientLog(error);
          reject(error);
        })
    });
  }

  getPersonReponsible(siteName: string) {
    return new Promise((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(Constants.Lists.SITE_MASTER).items
        .select(`${Constants.SiteMaster.SITE_NAME},
                ${Constants.SiteMaster.PERSON_RESPONSIBLE}/ID,
                ${Constants.SiteMaster.PERSON_RESPONSIBLE}/FirstName,
                ${Constants.SiteMaster.PERSON_RESPONSIBLE}/LastName,
                ${Constants.SiteMaster.PERSON_RESPONSIBLE}/EMail`)
        .filter(`${Constants.SiteMaster.SITE_NAME} eq '${siteName}'`)
        .expand(`${Constants.SiteMaster.PERSON_RESPONSIBLE}`)
        .get().then(sites => {
          resolve(sites);
        }, error => {
          this._Utils.clientLog(error);
          reject(error);
        })
    });
  }

  getCustomerInfo(customerNumber: string) {
    return new Promise((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(Constants.Lists.CUSTOMER_MASTER).items
        .select(`${Constants.CustomerMaster.CUSTOMER_CONTACT},
                ${Constants.CustomerMaster.CUSTOMER_NAME},
                ${Constants.CustomerMaster.CUSTOMER_NUMBER},
                ${Constants.CustomerMaster.CUSTOMER_CONTACT_DESIGNATION}`)
        .filter(`${Constants.CustomerMaster.CUSTOMER_NUMBER} eq '${customerNumber}'`)
        .get().then(customer => {
          resolve(customer);
        }, error => {
          this._Utils.clientLog(error);
          reject(error);
        })
    });
  }

  getPlantInfo(plantNumber: string) {
    return new Promise((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(Constants.Lists.PLANT_MASTER).items
        .select(`${Constants.PlantMaster.PLANT_NUMBER},
                ${Constants.PlantMaster.PLANT_NAME},
                ${Constants.PlantMaster.PLANT_CONTACT_DESIGNATION},
                ${Constants.PlantMaster.PLANT_CONTACT_Number}`)
        .filter(`${Constants.PlantMaster.PLANT_NUMBER} eq '${plantNumber}'`)
        .get().then(plant => {
          resolve(plant);
        }, error => {
          this._Utils.clientLog(error);
          reject(error);
        })
    });
  }

  getProductInfo(packCode: string) {
    return new Promise((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(Constants.Lists.PACK_CODE_MASTER).items
        .select(`${Constants.PackCodeMaster.PACK_CODE},
                ${Constants.PackCodeMaster.PRODUCT_DESCRIPTION}`)
        .filter(`${Constants.PackCodeMaster.PACK_CODE} eq '${packCode}'`)
        .get().then(product => {
          if(product && product.length){
            resolve(product["0"].ProductDescription);
          } else{
            resolve('');
          }
        }, error => {
          this._Utils.clientLog(error);
          reject(error);
        })
    });
  }

  getReasonCodes() {
    return new Promise((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(Constants.Lists.REASON_CODE_MASTER).items
        .select(`${Constants.ReasonCodeMaster.TITLE}`)
        .get().then(reasonCodes => {
          resolve(reasonCodes);
        }, error => {
          this._Utils.clientLog(error);
          reject(error);
        })
    });
  }

  getLevel1Data() {
    return new Promise((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(Constants.Lists.LOSS_TREE_LEVEL1_MASTER).items
        .select(`${Constants.LossTreeLevel1Master.TITLE}, ID`)
        .get().then(levels => {
          resolve(levels);
        }, error => {
          this._Utils.clientLog(error);
          reject(error);
        })
    });
  }

  getLevel2Data(level1ID: string) {
    return new Promise((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(Constants.Lists.LOSS_TREE_LEVEL2_MASTER).items
        .select(`${Constants.LossTreeLevel2Master.TITLE}, ID,
                 ${Constants.LossTreeLevel2Master.LEVEL1_LOOKUP}/ID,
                 ${Constants.LossTreeLevel2Master.LEVEL1_LOOKUP}/Title`)
        .filter(`${Constants.LossTreeLevel2Master.LEVEL1_LOOKUP} eq ${level1ID}`)
        .expand(`${Constants.LossTreeLevel2Master.LEVEL1_LOOKUP}`)
        .get().then(levels => {
          resolve(levels);
        }, error => {
          this._Utils.clientLog(error);
          reject(error);
        })
    });
  }

  getLevel3Data(level2ID: string) {
    return new Promise((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(Constants.Lists.LOSS_TREE_LEVEL3_MASTER).items
        .select(`${Constants.LossTreeLevel3Master.TITLE}, ID,
                 ${Constants.LossTreeLevel3Master.LEVEL2_LOOKUP}/ID,
                 ${Constants.LossTreeLevel3Master.LEVEL2_LOOKUP}/Title`)
        .filter(`${Constants.LossTreeLevel3Master.LEVEL2_LOOKUP} eq ${level2ID}`)
        .expand(`${Constants.LossTreeLevel3Master.LEVEL2_LOOKUP}`)
        .get().then(levels => {
          resolve(levels);
        }, error => {
          this._Utils.clientLog(error);
          reject(error);
        })
    });
  }

  getLevel4Data(level3ID: string) {
    return new Promise((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(Constants.Lists.LOSS_TREE_LEVEL4_MASTER).items
        .select(`${Constants.LossTreeLevel4Master.TITLE}, ID,
                 ${Constants.LossTreeLevel4Master.EXPLANATION},
                 ${Constants.LossTreeLevel4Master.LEVEL3_LOOKUP}/ID,
                 ${Constants.LossTreeLevel4Master.LEVEL3_LOOKUP}/Title`)
        .filter(`${Constants.LossTreeLevel4Master.LEVEL3_LOOKUP} eq ${level3ID}`)
        .expand(`${Constants.LossTreeLevel4Master.LEVEL3_LOOKUP}`)
        .get().then(levels => {
          resolve(levels);
        }, error => {
          this._Utils.clientLog(error);
          reject(error);
        })
    });
  }

  addAttachment(itemID: number, files: any[]) {
    return new Promise((resolve, reject) => {
      let item = pnp.sp.web.lists.getByTitle(Constants.Lists.COMPLAINTS).items.getById(itemID);
      this._Utils.setAttachmentByItemID(item, files).then(data => {
        resolve(data);
      }, error => {
        this._Utils.clientLog(error);
        reject(error);
      });
    });
  }

  addOrUpdateItem(item: any) {
    return new Promise((resolve, reject) => {
      var promise;
      if (item.ID > 0) {
        promise = pnp.sp.web.lists.getByTitle(Constants.Lists.COMPLAINTS).items.getById(item.ID).update(item);
      } else {
        promise = pnp.sp.web.lists.getByTitle(Constants.Lists.COMPLAINTS).items.add(item);
      }
      promise.then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  deleteAttachemnt(itemID: number, fileName: string) {
    return new Promise((resolve, reject) => {
      let item = pnp.sp.web.lists.getByTitle(Constants.Lists.COMPLAINTS).items.getById(itemID);
      this._Utils.deletAttachment(item, fileName).then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  getAttachments(itemID: number) {
    return new Promise((resolve, reject) => {
      let item = pnp.sp.web.lists.getByTitle(Constants.Lists.COMPLAINTS).items.getById(itemID);
      this._Utils.getAttachments(item).then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  generateComplaintID = function (ID: number, size: number, prefix: string) {
    var s = String(ID);
    while (s.length < (size || 2)) { s = "0" + s; }
    return prefix + s;
  }

  getCurrentUserType(personResponsible: number[]) {
    return new Promise((resolve, reject) => {
      var userType = [Constants.Globals.UPLIFT_USER];
      pnp.sp.web.siteUsers
        .getById((<any>window)._spPageContextInfo.userId)
        .select('Id').get()
        .then(user => {
          return pnp.sp.web.siteUsers.getById(user.Id).groups.get();
        }, error => {
          console.log(error);
        })
        .then(groups => {
          if (groups.length) {
            $.map(groups, group => {
              if (group.LoginName == Constants.Globals.UPLIFT_SCA) {
                userType.push(Constants.Globals.UPLIFT_SCA);
              }
              if (group.LoginName == Constants.Globals.UPLIFT_APPROVER) {
                userType.push(Constants.Globals.UPLIFT_APPROVER);
              }
            });
          }
          if (personResponsible) {
            $.map(personResponsible, (item, index) => {
              if (item.ID == (<any>window)._spPageContextInfo.userId) {
                userType.push(Constants.Globals.UPLIFT_RESPONSIBLE_PERSON);
                return false;
              }
            });
          }
          console.log(userType);
          resolve(userType);

        }, error => {
          console.log(error);
        });
    });
  }
}
