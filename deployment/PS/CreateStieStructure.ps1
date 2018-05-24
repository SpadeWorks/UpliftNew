Param ( [string]$SiteURL , [string]$CredStoreName, [string]$RootLocation)
$logFilePath = $RootLocation + "\log.txt"
$ErrorActionPreference = "Stop"
Try
{	
	$schemaPath = $RootLocation + "\XML\PnP-Provisioning-File.xml"
	Set-PnPTraceLog -On -LogFile $logFilePath -Level Debug
	Connect-PnPOnline -Url $SiteURL
	Apply-PnPProvisioningTemplate -Path $schemaPath
}
Catch
{
  $dateTime= Get-Date
  "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath -append 
	   throw  $_.Exception.Message
}