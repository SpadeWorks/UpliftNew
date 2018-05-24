Function CreateBUGroups{
	Param([string]$logFilePath,[string]$CredStoreName,[string]$SiteURL,[string]$RootLocation,[string]$SiteGroupXmlPath)
	Try{
        $dateTime= Get-Date
		
		"Time:" + $dateTime + "Message:" + "Start Creating BU Groups" | Out-File $logFilePath –append
		
		$ErrorActionPreference = "Stop"

        $SiteGroupXmlPathFile = resolve-path($SiteGroupXmlPath)
        $SiteGroupInputContent = [xml](Get-Content $SiteGroupXmlPathFile)
 
         if (!$SiteGroupInputContent){
            Break
        }

        $ctx = Get-PnPContext
        $web = $ctx.Web
        $ctx.Load($web)
        $noDeletePerLevel = $web.RoleDefinitions
        $ctx.Load($noDeletePerLevel)
        $ctx.ExecuteQuery()

        
        $ao = $noDeletePerLevel |? {$_.Name -eq "Read Write not delete access"}
        if($ao){

        }else{
            $permissions = New-Object "Microsoft.SharePoint.Client.BasePermissions"
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::AddListItems)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::ViewListItems)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::EditListItems)
			$permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::OpenItems)
			$permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::ViewVersions)
			$permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::CreateAlerts) 
			$permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::ViewFormPages)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::ViewPages)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::BrowseUserInfo)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::UseRemoteAPIs)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::UseClientIntegration)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::Open)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::UpdatePersonalWebParts)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::EditMyUserInfo)

            $roleDefinitionCreationInfo = New-Object "Microsoft.SharePoint.Client.RoleDefinitionCreationInformation"
            $roleDefinitionCreationInfo.Name = "Read Write not delete access"
            $roleDefinitionCreationInfo.Description = "Can view, add, and update list items and documents"
            $roleDefinitionCreationInfo.BasePermissions = $permissions 
            $web.RoleDefinitions.Add($roleDefinitionCreationInfo)
        }
		
		 $pao = $noDeletePerLevel |? {$_.Name -eq "Add Read not Delete and Update Permissions"}
		 
        if($pao){

        }else{
            $permissions = New-Object "Microsoft.SharePoint.Client.BasePermissions"
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::AddListItems)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::ViewListItems)
			$permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::OpenItems)
			$permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::ViewVersions)
			$permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::CreateAlerts)  
			$permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::ViewFormPages)          
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::ViewPages)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::BrowseUserInfo)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::UseRemoteAPIs)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::UseClientIntegration)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::Open)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::UpdatePersonalWebParts)
            $permissions.Set([Microsoft.SharePoint.Client.PermissionKind]::EditMyUserInfo)

            $roleDefinitionCreationInfo = New-Object "Microsoft.SharePoint.Client.RoleDefinitionCreationInformation"
            $roleDefinitionCreationInfo.Name = "Add Read not Delete and Update Permissions"
            $roleDefinitionCreationInfo.Description = "Can view and add list items and documents"
            $roleDefinitionCreationInfo.BasePermissions = $permissions 
            $web.RoleDefinitions.Add($roleDefinitionCreationInfo)
        }
		
        foreach($group in $SiteGroupInputContent.Groups.Group){

			#Create Permission Gorups Here and assign the Permission Levels
			"Time:" + $dateTime + "Message:" + "Start creating Groups: " + $group.Name | Out-File $logFilePath –append

			New-PnPGroup -Title $group.Name -Description $group.Description -AllowMembersEditMembership -DisallowMembersViewMembership -ErrorAction SilentlyCOntinue
			Set-PnPGroupPermissions -Identity $group.Name -AddRole @($group.Permission)

			"Time:" + $dateTime + "Message:" + "Group Created : " + $group.Name | Out-File $logFilePath –append
        }
     }Catch{
        $dateTime= Get-Date
        "Time: $dateTime -- Exception Type: $($_.Exception.GetType().FullName) -- Exception Message: $($_.Exception.Message)" | Out-File $logFilePath –append  
         throw  $_.Exception.Message
    }
}                