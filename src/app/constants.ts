export class Lists {
    static SITE_MASTER = 'SiteMaster';
    static CUSTOMER_MASTER = "CustomerMaster";
    static PACK_CODE_MASTER = "PackCodeMaster";
    static REASON_CODE_MASTER = "ReasonCodeMaster";
    static LOSS_TREE_LEVEL1_MASTER = "LossTreeLevel1Master";
    static LOSS_TREE_LEVEL2_MASTER = "LossTreeLevel2Master";
    static LOSS_TREE_LEVEL3_MASTER = "LossTreeLevel3Master";
    static LOSS_TREE_LEVEL4_MASTER = "LossTreeLevel4Master";
    static COMPLAINTS = "Complaints";
    static PLANT_MASTER = "PlantMaster";
}

export class SiteMaster {
    static SITE_NAME = 'SiteName';
    static PERSON_RESPONSIBLE = "PersonResponsible";
}

export class CustomerMaster {
    static CUSTOMER_CONTACT = "CustomerContact";
    static CUSTOMER_CONTACT_DESIGNATION = "CustomerContactDesignation";
    static CUSTOMER_NAME = "CustomerName";
    static CUSTOMER_NUMBER = "CustomerNumber";
}

export class PlantMaster {
    static PLANT_CONTACT_NAME = "PlantContactName";
    static PLANT_CONTACT_Number = "PlantContactNumber";
    static PLANT_CONTACT_DESIGNATION = "PlantContactDesignation";
    static PLANT_NAME = "PlantName";
    static PLANT_NUMBER = "PlantNumber";
}

export class PackCodeMaster {
    static PACK_CODE = "PackCode";
    static PRODUCT_DESCRIPTION = "ProductDescription";
    static BRAND = "Brand";
    static CATEGORY = "CategoryText";
    static DEPARTMENT_TEXT = "DepartmentText";
    static FACTORY = "Factory";
    static PACK_SIZE = "PackSize";
    static PLANT = "Plant";
    static SECONDARY_VARIANT = "SecondaryVariant"
    static SUB_CATEGORY_VARIANT = "Sub Category Variant";
    static UNIT_OF_MESURE = "UnitOfMesure";
    static VARIANT = "Variant";
}

export class ReasonCodeMaster {
    static TITLE = "Title";
}

export class LossTreeLevel1Master {
    static TITLE = "Title";
}
export class LossTreeLevel2Master {
    static TITLE = "Title";
    static LEVEL1_LOOKUP = "Level1Lookup";

}
export class LossTreeLevel3Master {
    static TITLE = "Title";
    static LEVEL2_LOOKUP = "Level2Lookup";

}
export class LossTreeLevel4Master {
    static TITLE = "Title";
    static LEVEL3_LOOKUP = "Level3Lookup";
    static EXPLANATION = "Explanation";
}

export class Complaints {
    static ID = "ID";
    static ACTION_TAKEN = "ActionTaken";
    static BATCH_DETAILS_1 = "BatchDetails1";
    static BATCH_DETAILS_2 = "BatchDetails2";
    static BATCH_DETAILS_3 = "BatchDetails3";
    static BATCH_DETAILS_4 = "BatchDetails4";
    static BATCH_DETAILS_5 = "BatchDetails5";
    static BBE_EXPIRY = "BBEExpiry";
    static COMPLAINT_DETAILS = "ComplaintDetails";
    static CUSTOMER_CONTACT_DESIGNATION = "CustomerContactDesignation";
    static CUSTOMER_CONTACT_NAME = "CustomerContactName";
    static CUSTOMER_NAME = "CustomerName";
    static CUSTOMER_NUMBER = "CustomerNumber";
    static DATE_OF_INCIDENT = "DateOfIncident";
    static DELIVERY_NUMBER = "DeliveryNumber";
    static EXPLANATION = "Explanation";
    static LEVEL1_LOOKUP = "Level1Lookup";
    static LEVEL2_LOOKUP = "Level2Lookup";
    static LEVEL3_LOOKUP = "Level3Lookup";
    static LEVEL4_LOOKUP = "Level4Lookup";
    static PACKCODE1 = "PackCode1";
    static PACKCODE2 = "PackCode2";
    static PACKCODE3 = "PackCode3";
    static PACKCODE4 = "PackCode4";
    static PACKCODE5 = "PackCode5";
    static PERSON_RESPONSIBLE = "PersonResponsible";
    static PLANT_NUMBER = "PlantNumber";
    static PLANT_NAME = "PlantName";
    static PRODUCTDESCRIPTION = "ProductDescription";
    static PRODUCTDESCRIPTION1 = "ProductDescription1";
    static PRODUCTDESCRIPTION2 = "ProductDescription2";
    static PRODUCTDESCRIPTION3 = "ProductDescription3";
    static PRODUCTDESCRIPTION4 = "ProductDescription4";
    static PRODUCTDESCRIPTION5 = "ProductDescription5";
    static QUANTITY = "Quantity";
    static Quantity_Cases_1 = "QuantityCases1";
    static Quantity_Cases_2 = "QuantityCases2";
    static Quantity_Cases_3 = "QuantityCases3";
    static Quantity_Cases_4 = "QuantityCases4";
    static Quantity_Cases_5 = "QuantityCases5";
    static QUANTITY_PALLET_1 = "QuantityPallet1";
    static QUANTITY_PALLET_2 = "QuantityPallet2";
    static QUANTITY_PALLET_3 = "QuantityPallet3";
    static QUANTITY_PALLET_4 = "QuantityPallet4";
    static QUANTITY_PALLET_5 = "QuantityPallet5";
    static QUANTITY_SHRINK_1 = "QuantityShrink1";
    static QUANTITY_SHRINK_2 = "QuantityShrink2";
    static QUANTITY_SHRINK_3 = "QuantityShrink3";
    static QUANTITY_SHRINK_4 = "QuantityShrink4";
    static QUANTITY_SHRINK_5 = "QuantityShrink5";
    static QUANTITY_UNITS_1 = "QuantityShrink1";
    static QUANTITY_UNITS_2 = "QuantityShrink2";
    static QUANTITY_UNITS_3 = "QuantityShrink3";
    static QUANTITY_UNITS_4 = "QuantityShrink4";
    static QUANTITY_UNITS_5 = "QuantityShrink5";
    static REASON_CODE = "ReasonCode";
    static REMEDY_NUMBER = "RemedyNumber";
    static ROOT_CAUSE = "RootCause";
    static SITE_NAME = "SiteName";
    static CUSTOMER_CONTACT = "CustomerContact";
    static ATTACHMENTS = "Attachments";
    static APPROVAL_STATUS = "ApprovalStatus";
    static INVOICE_NUMBER = "InvoiceNumber";
    static INVOICE_VALUE = "InvoiceValue";
    static LAST_DELIVERY_DATE = "LastDeliveryDate";
    static COMPLAINT_STATUS = "ComplaintStatus";
    static CONTENT_TYPE_ID = "ContentTypeId";
    static Approver_Comments = "ApproverComments";
    static PLANT_CONTACT_NAME = "PlantContactName";
    static QUANTITY_UNIT = "QuantityUnit";
    static UPLIFT_NUMBER = "UpliftNumber";
}

export class Globals{
    static USER = "user";
    static ADMIN = "admin";
    static UPLIFT_APPROVER = "Uplift_Approvers";
    static UPLIFT_SCA = "Uplift_SCA";
    static UPLIFT_USER = "Uplift_Users";
    static UPLIFT_RESPONSIBLE_PERSON = "Uplift_Responsible_Persons";
    static DATE_FORMAT = 'dd.mm.yyyy';
    static SUBMITTED = "Submitted";
    static RESOLVED = "Resolved";
    static REJECTED = "Rejected";
    static ASSIGNED = "Assigned";
    static WIP = "WIP";
    static YES = "Yes";
    static NOT_STARTED = "Not Started";
    static sheqContentTypeID = "0x0100376BE29451A1A848B7458189992EFFE6";
    static ncaContentTypeID = "0x0100FD4838C96DB49E48BCCBFEA748374DA0";
    static sheqContentType = "SHEQ_CT";
    static ncaContentType = "NCA_CT";
    static NO = "No";

}
