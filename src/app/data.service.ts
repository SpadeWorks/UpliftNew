import { Injectable } from '@angular/core';
import Promise from "ts-promise";
import * as Constants from './constants';
import * as pnp from '../../node_modules/sp-pnp-js/dist/pnp.min';
import { Utils } from './utils';

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

  getComplaintByID(ID: string) {
    return new Promise((resolve, reject) => {
      pnp.sp.web.lists.getByTitle(Constants.Lists.COMPLAINTS).items
        .filter(`${Constants.Complaints.ID} eq '${ID}'`)
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
                 ${Constants.LossTreeLevel4Master.EXPLAINATION},
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

}
