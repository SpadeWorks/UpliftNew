var UL = UL || {};

UL.constants = {
    sheqContentTypeID: "0x0100376BE29451A1A848B7458189992EFFE6",
    ncaCotentTypeID: "0x0100FD4838C96DB49E48BCCBFEA748374DA0",
    ncaComplaintWebPart: "NCA Complaints",
    sheqComplaintsWebPart: "SHEQ Complaints",
    sheqAdminWebPart: "SHEQ Admin",
    ncaAdminWebPart: "NCA Admin",
    responsiblePsershonSheqWebPart: "Responsible Person SHEQ",
    responsiblePersonNcaWebPart: "Responsible Person NCA",
    ncaComplaintRadioBtn: "NCA Complaints",
    sheqComplaintRadioBtn: "",
    userType: {
        sca: "Uplift_SCA",
        approver: "Uplift_Approvers",
        user: "Uplift_User",
        responsiblePerson: "Uplift_Responsible_Persons"
    }


}

UL.dashboard = (function () {
    var upliftWPTitleArr = [UL.constants.sheqComplaintsWebPart,
        UL.constants.ncaComplaintWebPart,
        UL.constants.sheqAdminWebPart,
        UL.constants.ncaAdminWebPart,
        UL.constants.responsiblePersonNcaWebPart,
        UL.constants.responsiblePsershonSheqWebPart
    ];

    var strComplaint = "";

    var init = function () {
        $.each(upliftWPTitleArr, function (index, item) {
            hideWebPartByTitle(item);
        });

        hideAuditListWebParts(upliftWPTitleArr)
        getAllComplaintsCount();
        bindClickEvents();
        updateButtonStyle();
    }

    var updateButtonStyle = function () {
        var selectedState = getUrlParameters("status");
        if (selectedState === "") {
            $("#allComplaints").addClass("selected");
        } else if (selectedState === "Assigned") {
            $("#assignComplaints").addClass("selected");
        } else if (selectedState === "WIP") {
            $("#wIPComplaints").addClass("selected");
        } else if (selectedState === "Pending") {
            $("#pendingComplaints").addClass("selected");
        } else if (selectedState === "Resolved") {
            $("#resolvedComplaints").addClass("selected");
        } else if (selectedState === "Rejected") {
            $("#rejectedComplaints").addClass("selected");
        }
    }

    function getUrlParameters(name, url) {
        url = url || window.location.href;
        var regexS, regex, results;
        if (!url) url = location.href;
        name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
        regexS = '[\\?&]' + name + '=([^&#]*)';
        regex = new RegExp(regexS);
        results = regex.exec(url);
        return results === null ? null : decodeURIComponent(results[1]);
    }

    var hideWebPartByTitle = function (title) {
        $("span[Title='" + title + "']").parents('div.s4-wpcell').hide();
    }

    var hideAuditListWebParts = function (WebPartTitles, selectedCT) {
        selectedCT = selectedCT || $("input[name='ComplaintRadio']:checked").val();
        $.each(upliftWPTitleArr, function (index, item) {
            hideWebPartByTitle(item);
        });
        getUserType().then(function (userType) {
            if (userType == UL.constants.userType.sca || userType == UL.constants.userType.approver) {
                if (userType == UL.constants.userType.approver) {
                    $("#dashboardName").html("Approver Dashboard")
                } else {
                    $("#dashboardName").html("Admin Dashboard")
                }
                if (UL.constants.ncaComplaintRadioBtn == selectedCT) {
                    $("span[Title='" + UL.constants.ncaAdminWebPart + "']").parents('div.s4-wpcell').show();
                } else {
                    $("span[Title='" + UL.constants.sheqAdminWebPart + "']").parents('div.s4-wpcell').show();
                }
            } else if (userType === UL.constants.userType.responsiblePerson) {
                $("#dashboardName").html("Responsible Person Dashboard")
                if (UL.constants.ncaComplaintRadioBtn == selectedCT) {
                    $("span[Title='" + UL.constants.responsiblePersonNcaWebPart + "']")
                        .parents('div.s4-wpcell').show();
                } else {
                    $("span[Title='" + UL.constants.responsiblePsershonSheqWebPart + "']")
                        .parents('div.s4-wpcell').show();
                }
            } else {
                $("#dashboardName").html("User Dashboard")
                if (UL.constants.ncaComplaintRadioBtn === selectedCT) {
                    $("span[Title='" + UL.constants.ncaComplaintWebPart + "']").parents('div.s4-wpcell').show();
                } else {
                    $("span[Title='" + UL.constants.sheqComplaintsWebPart + "']").parents('div.s4-wpcell').show();
                }
            }
        })
    }

    var getUserType = function () {
        var deferred = $.Deferred();
        userType = ""
        getCurrentUserGroupColl(_spPageContextInfo.userId).then(function (data) {
            if (data.d.results) {
                $.each(data.d.results, function (index, item) {
                    if (item.LoginName === UL.constants.userType.sca) {
                        userType = UL.constants.userType.sca;
                        return false;
                    }
                })

                if (!userType) {
                    $.each(data.d.results, function (index, item) {
                        if (item.LoginName === UL.constants.userType.approver) {
                            userType = UL.constants.userType.approver;
                            return false;
                        }
                    })

                } 
                if (!userType) {
                    $.each(data.d.results, function (index, item) {
                        if (item.LoginName === UL.constants.userType.responsiblePerson) {
                            userType = UL.constants.userType.responsiblePerson;
                            return false;
                        }
                    })

                } 
                deferred.resolve(userType || UL.constants.userType.user);
            }
        })
        return deferred.promise();
    }

    var getCurrentUserGroupColl = function (UserID) {
        var deferred = $.Deferred();
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/GetUserById(" + UserID + ")/Groups",
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                deferred.resolve(data);
            },
            error: function () {
                deferred.reject(data);
            }
        });
        return deferred.promise();
    }



    var getAllComplaintsCount = function (selectedCT) {
        var urltoatal;
        var appweburl = _spPageContextInfo.webAbsoluteUrl;
        var userID = _spPageContextInfo.userId;
        selectedCT = selectedCT || $("input[name='ComplaintRadio']:checked").val();
        if (selectedCT == UL.constants.ncaComplaintRadioBtn) {
            selectedCT = "NCA_CT";
        } else {
            selectedCT = "SHEQ_CT";
        }

        getUserType().then(function (userType) {
            if (userType == UL.constants.userType.sca || userType == UL.constants.userType.approver) {
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$filter=ContentType eq '" +
                    selectedCT + "'&$select=id&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idAllComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id" +
                    "&$filter=ComplaintStatus eq 'Assigned' and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idAssignComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id&" +
                    "$filter=ComplaintStatus eq 'WIP' and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idWIPComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id" +
                    "&$filter=ComplaintStatus eq 'Pending' and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idPendingComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id" +
                    "&$filter=ComplaintStatus eq 'Resolved' and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idResolvedComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id" +
                    "&$filter=ComplaintStatus eq 'Rejected' and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idRejectedComplaints');
            } else if (userType === UL.constants.userType.responsiblePerson) {
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id&$top=9999&$filter=PersonResponsible eq " +
                    userID + "and ContentType eq '" + selectedCT + "'";
                getComplaintsStatusCount(urltoatal, 'idAllComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id" +
                    "&$filter=ComplaintStatus eq 'Assigned' and PersonResponsible eq " + userID + " and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idAssignComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id&" +
                    "$filter=ComplaintStatus eq 'WIP' and PersonResponsible eq " + userID + " and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idWIPComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id" +
                    "&$filter=ComplaintStatus eq 'Pending' and PersonResponsible eq " + userID + " and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idPendingComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id" +
                    "&$filter=ComplaintStatus eq 'Resolved' and PersonResponsible eq " + userID + " and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idResolvedComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id" +
                    "&$filter=ComplaintStatus eq 'Rejected' and PersonResponsible eq " + userID + " and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idRejectedComplaints');
            } else {
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id&$top=9999&$filter=AuthorId eq " +
                    userID + "and ContentType eq '" + selectedCT + "'";
                getComplaintsStatusCount(urltoatal, 'idAllComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id" +
                    "&$filter=ComplaintStatus eq 'Assigned' and AuthorId eq " + userID + " and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idAssignComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id&" +
                    "$filter=ComplaintStatus eq 'WIP' and AuthorId eq " + userID + " and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idWIPComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id" +
                    "&$filter=ComplaintStatus eq 'Pending' and AuthorId eq " + userID + " and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idPendingComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id" +
                    "&$filter=ComplaintStatus eq 'Resolved' and AuthorId eq " + userID + "and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idResolvedComplaints');
                urltoatal = appweburl +
                    "/_api/web/lists/GetByTitle('Complaints')/items?$select=id" +
                    "&$filter=ComplaintStatus eq 'Rejected' and AuthorId eq " + userID + "and ContentType eq '" +
                    selectedCT + "'&$top=9999";
                getComplaintsStatusCount(urltoatal, 'idRejectedComplaints');
            }
        });
    }

    var getComplaintsStatusCount = function (url, id) {
        $.ajax({
            url: url,
            type: "GET",
            cache: false,
            async: false,
            headers: {
                "accept": "application/json;odata=verbose",
            },
            success: function (data) {
                $("#" + id).text(data.d.results.length);
            },
            error: function (err) {
                console.log(err)
            }
        });
    }

    var getUrl = function (url) {
        url = window.location.href;
        if (url.indexOf("?") > 0) {
            url = url.split("?")[0];
        } else if (url.indexOf("#") > 0) {
            url = url.split("#")[0];
        }
        return url;
    }

    bindClickEvents = function () {
        $(document).on('click', '#allComplaints', function () {
            window.location.href = getUrl();
        })

        $(document).on('click', '#assignComplaints', function () {
            window.location.href = getUrl() + "?status=Assigned";
        })
        $(document).on('click', '#wIPComplaints', function () {
            window.location.href = getUrl() + "?status=WIP";
        })
        $(document).on('click', '#pendingComplaints', function () {
            window.location.href = getUrl() + "?status=Pending";
        })

        $(document).on('click', "#resolvedComplaints", function () {
            window.location.href = getUrl() + "?status=Resolved";
        })

        $(document).on('click', '#rejectedComplaints', function () {
            window.location.href = getUrl() + "?status=Rejected";
        })
        $('#btnSheq').on('click', function () {
            window.location.href = _spPageContextInfo.webAbsoluteUrl +
                "/Pages/Complaint.aspx?Source=" +
                _spPageContextInfo.siteServerRelativeUrl +
                "&ContentTypeId=" + UL.constants.sheqContentTypeID;
        });
        $('#btnNca').on('click', function () {
            window.location.href = _spPageContextInfo.webAbsoluteUrl +
                "/Pages/Complaint.aspx?Source=" +
                _spPageContextInfo.siteServerRelativeUrl +
                "&ContentTypeId=" + UL.constants.ncaCotentTypeID;
        })

        $("input[name='ComplaintRadio']").click(function () {
            var selectedCT = this.value;
            hideAuditListWebParts(upliftWPTitleArr, selectedCT);
            getAllComplaintsCount(selectedCT);
        });
    }

		var listTableResponsive = function() {
			$("table.ms-listviewtable > thead > tr > th").each(function(index){
				//$("table.ms-listviewtable > tbody > tr td").eq(index).attr("data-title",$(this).find("a").text());
				});
		}

    return {
        init: init
    }
}());


$(document).ready(function () {
    UL.dashboard.init(); 
});

$(window).load(function(){
	listTableResponsive();
});