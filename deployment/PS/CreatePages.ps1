Param ( [string]$SiteURL , [string]$CredStoreName, [string]$RootLocation)
$logFilePath = $RootLocation + "\log.txt"
$ErrorActionPreference = "Stop"
Try
{	
	$webpartPath = $RootLocation + "\xml\Content Editor.dwp"
	Connect-PnPOnline -Url $SiteURL
	$pageName = "Complaint";
	Add-PnPPublishingPage -PageName $pageName -PageTemplateName "BlankWebPartPage" -Title $pageName -Publish
	$pagePath = $SiteURL + "/Pages/" + $pageName + ".aspx";
	Set-PnPFileCheckedOut -Url $pagePath
	Add-PnPWebPartToWebPartPage -ServerRelativePageUrl $pagePath -Path $webpartPath -ZoneId "Header" -ZoneIndex 0 
	Set-PnPFileCheckedIn -Url $pageName

}
Catch
{
  $dateTime= Get-Date
  "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append 
	   throw  $_.Exception.Message
}