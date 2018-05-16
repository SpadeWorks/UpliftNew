import { Injectable } from '@angular/core';
import Promise from "ts-promise";
import * as Constants from './constants';
import * as pnp from '../../node_modules/sp-pnp-js/dist/pnp.min';
import { Utils } from './utils';
import { Sheq } from './sheq/sheq';
import * as $ from 'jquery';
import { resolve } from 'q';

var _spPageContextInfo: any;
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
${Constants.Complaints.ROOT_CAUSE}`)
        .expand(`${Constants.Complaints.LEVEL1_LOOKUP},\
${Constants.Complaints.LEVEL2_LOOKUP},\
${Constants.Complaints.LEVEL3_LOOKUP},\
${Constants.Complaints.LEVEL4_LOOKUP},\
${Constants.Complaints.PERSON_RESPONSIBLE}`)
        .get().then(complaint => {
          resolve(complaint);
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

  getProductInfo(packCode: string) {
    return new Promise((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(Constants.Lists.PACK_CODE_MASTER).items
        .select(`${Constants.PackCodeMaster.PACK_CODE},
                ${Constants.PackCodeMaster.PRODUCT_DESCRIPTION}`)
        .filter(`${Constants.PackCodeMaster.PACK_CODE} eq '${packCode}'`)
        .get().then(product => {
          resolve(product);
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

  addOrUpdateSheqItem(sheq: Sheq) {
    return new Promise((resolve, reject) => {
      var promise;
      if (sheq.ID > 0) {
        promise = pnp.sp.web.lists.getByTitle(Constants.Lists.COMPLAINTS).items.getById(sheq.ID).update(sheq);
      } else {
        promise = pnp.sp.web.lists.getByTitle(Constants.Lists.COMPLAINTS).items.add(sheq);
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

  getCurrentUserType() {
    return new Promise((resolve, reject) => {
      var userType = Constants.Globals.UPLIFT_USER;
      pnp.sp.web.siteUsers
        .getById(_spPageContextInfo.userId)
        .select('Id').get()
        .then(user => {
          return pnp.sp.web.siteUsers.getById(user.Id).groups.get();
        }, error => {
          console.log(error);
        })
        .then(groups => {
          $.map(groups, group => {
            if (group.LoginName == Constants.Globals.UPLIFT_SCA) {
              userType = Constants.Globals.UPLIFT_SCA;
              return false;
            }
          });

          if (userType != Constants.Globals.UPLIFT_SCA) {
            $.map(groups, group => {
              if (group.LoginName == Constants.Globals.UPLIFT_APPROVERS) {
                userType = Constants.Globals.UPLIFT_APPROVERS;
              }
            });
          }
          resolve(Constants.Globals.UPLIFT_SCA);
        }, error => {
          console.log(error);
        });
    });
  }
}
