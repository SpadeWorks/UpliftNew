var upliftWPTitleArr = ["SHEQ Complaints","NCA Complaints", "SHEQ Admin", "NCA Admin"];

var strComplaint = "";

$(document).ready(function(){
	$("input[name='ComplaintRadio']").click(function() {
	    strComplaint = this.value;
	    $(".clsMyVisiualWP span:contains('"+strComplaint+"')").filter(function(i){
			if($(this).text()===strComplaint){
				$('.clsMyVisiualWP').hide();
				$(this).parents('.ms-webpartzone-cell').show();
			}
		});
	});
	$('#btnNca').on('click',function(){
		window.location.href=_spPageContextInfo.webAbsoluteUrl+"/Pages/Complaint.aspx?Source="+_spPageContextInfo.siteServerRelativeUrl+"&ContentTypeId=0x0100376BE29451A1A848B7458189992EFFE6"
	})
	$('#btnSheq').on('click',function(){
		window.location.href=_spPageContextInfo.webAbsoluteUrl+"/Pages/Complaint.aspx?Source="+_spPageContextInfo.siteServerRelativeUrl+"&ContentTypeId=0x0100FD4838C96DB49E48BCCBFEA748374DA0"
	})
	HideAuditListWebParts(upliftWPTitleArr)
	GetAllComplaintsCount();
})



function hideWebPartByTitle(title){
  $("span[Title='"+ title +"']").parents('div.ms-webpart-chrome').hide();
}


function HideAuditListWebParts(WebPartTitles){
  $.each(upliftWPTitleArr, function(index, item){
    hideWebPartByTitle(item);
  });
  if(true){
    if("NCA Complaints"=$("input[name='ComplaintRadio']:checked").val()){
      $("span[Title='NCA Admin']").parents('div.ms-webpart-chrome').show();
    } else{
      $("span[Title='SHEQ Admin']").parents('div.ms-webpart-chrome').show();
    }
  } else{
    if("NCA Complaints"=$("input[name='ComplaintRadio']:checked").val()){
      $("span[Title='NCA Complaints']").parents('div.ms-webpart-chrome').show();
    } else{
      $("span[Title='SHEQ Complaints']").parents('div.ms-webpart-chrome').show();
    }
  }
}

function GetAllComplaintsCount(){
	var urltoatal;
	var appweburl = _spPageContextInfo.webAbsoluteUrl;

	urltoatal = appweburl +"/_api/web/lists/GetByTitle('Complaints')/items?$select=id&$top=9999";
	GetComplaintsStatusCount(urltoatal,'idAllComplaints')

	urltoatal = appweburl +"/_api/web/lists/GetByTitle('Complaints')/items?$select=id&$filter=ComplaintStatus eq 'Assigned'&$top=9999";
	GetComplaintsStatusCount(urltoatal,'idAssignComplaints')

	urltoatal = appweburl +"/_api/web/lists/GetByTitle('Complaints')/items?$select=id&$filter=ComplaintStatus eq 'WIP'&$top=9999";
	GetComplaintsStatusCount(urltoatal,'idWIPComplaints')

	urltoatal = appweburl +"/_api/web/lists/GetByTitle('Complaints')/items?$select=id&$filter=ComplaintStatus eq 'Pending'&$top=9999";
	GetComplaintsStatusCount(urltoatal,'idPendingComplaints')

	urltoatal = appweburl +"/_api/web/lists/GetByTitle('Complaints')/items?$select=id&$filter=ComplaintStatus eq 'Resolved'&$top=9999";
	GetComplaintsStatusCount(urltoatal,'idResolvedComplaints')

	urltoatal = appweburl +"/_api/web/lists/GetByTitle('Complaints')/items?$select=id&$filter=ComplaintStatus eq 'Rejected'&$top=9999";
	GetComplaintsStatusCount(urltoatal,'idRejectedComplaints')
}


function GetComplaintsStatusCount(url,id)
{
	$.ajax({
        url: url,
        type: "GET",
        cache: false,
		async: false,
        headers: {
            "accept": "application/json;odata=verbose",
        },
        success: function (data) {
      		  $("#"+id).text(data.d.results.length);
		},
        error: function(err){
        	console.log(err)
        }
	});
}
