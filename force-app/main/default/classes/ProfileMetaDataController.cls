public class ProfileMetaDataController {
    @AuraEnabled(cacheable = true)
    public static Metadata getProfileData(String selectedProfileId)
    {
        String auth = 'Bearer ' + SessionIdController.getSessionId();
        String profileId = selectedProfileId;
        
        String query = 'SELECT Metadata FROM Profile WHERE Id = \'' + profileId + '\'';
        String endpoint = URL.getSalesforceBaseUrl().toExternalForm() +
            '/services/data/v58.0/tooling/query/?q=' +
            EncodingUtil.urlEncode(query, 'UTF-8');
        
        HttpRequest request = new HttpRequest();
        request.setHeader('Authorization', auth);
        request.setEndpoint(endpoint);
        request.setMethod('GET');
        
        HttpResponse response = new Http().send(request);
        system.debug('result-->'+response.getBody());
        SuccessWrapper succWrap = (SuccessWrapper)JSON.deserialize(response.getBody(), SuccessWrapper.class);
        return succWrap.Records[0].Metadata;   
    }
    @AuraEnabled(cacheable = true)
    public static void updateProfileData(String profileMetaDatastr, String ProfileID)
    {   
        MetadataService.Profile profileMetadata = (MetadataService.Profile)JSON.deserialize(profileMetaDatastr, MetadataService.Profile.class); 		
        system.debug('profileMetadata-->'+profileMetadata);
        
        MetadataService.MetadataPort service = new MetadataService.MetadataPort();
        service.SessionHeader = new MetadataService.SessionHeader_element();
        service.SessionHeader.sessionId = SessionIdController.getSessionId();
        system.debug('sessionId-->'+SessionIdController.getSessionId());
        
        MetadataService.Profile[] profiles = (MetadataService.Profile[]) service.readMetadata('Profile', new String[]{ProfileID}).getRecords();
        MetadataService.Profile existingProfile = profiles[0];
        
        existingProfile.loginHours = profileMetadata.loginHours;
        existingProfile.loginIpRanges = profileMetadata.loginIpRanges;
        
        MetadataService.Profile[] updatedProfiles = new MetadataService.Profile[]{existingProfile};
        system.debug('updatedProfiles-->'+updatedProfiles[0].loginHours);
        system.debug('updatedProfiles-->'+updatedProfiles[0].loginIpRanges);
        
        MetadataService.SaveResult[] results = service.updateMetadata(updatedProfiles);
        
      /*   Metadata profileMetadata = (Metadata)JSON.deserialize(profileMetaDatastr, Metadata.class); 
         System.debug('profileMetadata-->'+profileMetadata);
         String auth = 'Bearer ' + SessionIdController.getSessionId();       
        	
         String profileSuccessString = JSON.serialize(profileMetadata); 
         
         String patchEndpoint = URL.getSalesforceBaseUrl().toExternalForm() +
                '/services/data/v58.0/sobjects/Profile/' + profileId;
            
            HttpRequest patchRequest = new HttpRequest();
            patchRequest.setHeader('Authorization', auth);
            patchRequest.setHeader('Content-Type', 'application/json');
            patchRequest.setEndpoint(patchEndpoint);
            patchRequest.setMethod('PATCH');
            patchRequest.setBody(profileSuccessString);
        
            try
            {
                HttpResponse patchResponse = new Http().send(patchRequest); 
			}
            catch(exception e)
            {
                System.debug('Error updating login hours for the profile: ' + e.getMessage());
            } */
            
            //system.debug('patchResponse'+JSON.deserializeUntyped(patchResponse.getBody()));
            
       /*     if (patchResponse.getStatusCode() == 204) 
            {
                System.debug('Login hours for the profile updated successfully.');
            } 
        	else 
            {
                System.debug('Error updating login hours for the profile: ' + patchResponse.getBody());
            }*/
         
    }
    
    public class SuccessWrapper{
        @AuraEnabled public Integer size;
        @AuraEnabled public Integer totalSize;
        @AuraEnabled public Boolean done;
        @AuraEnabled public Object queryLocator;
        @AuraEnabled public String entityTypeName;
        @AuraEnabled public List<Records> records;
    }
    public class Records {
        @AuraEnabled public Attributes attributes;
        @AuraEnabled public Metadata Metadata;
    }
    public class LoginHours {
        @AuraEnabled public String fridayEnd;
        @AuraEnabled public String fridayStart;
        @AuraEnabled public String mondayEnd;
        @AuraEnabled public String mondayStart;
        @AuraEnabled public String saturdayEnd;
        @AuraEnabled public String saturdayStart;
        @AuraEnabled public String sundayEnd;
        @AuraEnabled public String sundayStart;
        @AuraEnabled public String thursdayEnd;
        @AuraEnabled public String thursdayStart;
        @AuraEnabled public String tuesdayEnd;
        @AuraEnabled public String tuesdayStart;
        @AuraEnabled public String wednesdayEnd;
        @AuraEnabled public String wednesdayStart;
    }
    
    public class Attributes {
        @AuraEnabled public String type;
        @AuraEnabled public String url;
    }
    
    public class ApplicationVisibilities {
    }
    
    public class Metadata {
        //@AuraEnabled public List<ApplicationVisibilities> applicationVisibilities;
        //@AuraEnabled public Object categoryGroupVisibilities;
        //@AuraEnabled public List<ApplicationVisibilities> classAccesses;
        //@AuraEnabled public Boolean custom;
        //@AuraEnabled public List<ApplicationVisibilities> customPermissions;
        //@AuraEnabled public Object description;
        //@AuraEnabled public List<ApplicationVisibilities> externalDataSourceAccesses;
        //@AuraEnabled public List<ApplicationVisibilities> fieldPermissions;
        @AuraEnabled public LoginHours loginHours;
        @AuraEnabled public List<LoginIpRanges> loginIpRanges;
        //@AuraEnabled public List<ApplicationVisibilities> objectPermissions;
        //@AuraEnabled public List<ApplicationVisibilities> pageAccesses;
        //@AuraEnabled public List<ApplicationVisibilities> profileActionOverrides;
        //@AuraEnabled public List<ApplicationVisibilities> recordTypeVisibilities;
        //@AuraEnabled public List<ApplicationVisibilities> tabVisibilities;
        //@AuraEnabled public Object urls;
        //@AuraEnabled public String userLicense;
        //@AuraEnabled public List<UserPermissions> userPermissions;
    }
    
    public class LoginIpRanges {
        @AuraEnabled public String description;
        @AuraEnabled public String endAddress;
        @AuraEnabled public String startAddress;
    }
    
    public class UserPermissions {
        @AuraEnabled public Boolean enabled;
        @AuraEnabled public String name;
    }
    
}