Param ( [string]$SiteURL , [string]$CredStoreName, [string]$RootLocation)
#$SiteURL = "https://unileverdev.sharepoint.com/teams/devint_upliftquality";
#$RootLocation = "D:\Akash\Uplift - Unilever\Invoice Blocking Unblocking (1)\Invoice Blocking Unblocking\InvoiceBlockingUnblocking.SharePointOnline.Components\Main\Build Deployment\";

$logFilePath = $RootLocation + "\log.txt"
$ErrorActionPreference = "Stop"
Try
{
    #Call the modules one by one
    Connect-PnPOnline -Url $SiteURL -Credentials $CredStoreName

    #Load CreateSiteStructure file
    $CreateQMSGroupsPath = $RootLocation + "\ps\CreateSiteGroups.psm1"
    Import-Module $CreateQMSGroupsPath

   
    $siteGroupsXmlPath = $RootLocation + "\xml\BUGroups.xml"
	
    CreateBUGroups -logFilePath $logFilePath -CredStoreName $CredStoreName -SiteURL $SiteURL -RootLocation $RootLocation  -SiteGroupXmlPath $siteGroupsXmlPath

}
Catch
{
     $dateTime= Get-Date
     "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath –append  
     throw  $_.Exception.Message
}