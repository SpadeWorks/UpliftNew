export class Product {
      PackCode: string;
      ProductDescription: string;
      BatchDetails: string;
      QuantityUnit: string;
      QuantityShrink: string;
      QuantityCases: string;
      QuantityPallet: string;

      constructor(packCode, productDescription, batchDetails, quantityUnit, quantityShrink, quantityCases, quantityPallet){
            this.PackCode = packCode;
            this.BatchDetails = batchDetails;
            this.QuantityUnit = quantityUnit;
            this.QuantityShrink = quantityShrink;
            this.QuantityCases = quantityCases;
            this.QuantityPallet = quantityPallet;
      }
}