public class TestMetadata 
{
    public static void testdata()
    {
        String auth = 'Bearer ' + UserInfo.getSessionId();
        String profileId = UserInfo.getProfileId();
        String newLoginHours = '{"mondayStart": "08:00", "mondayEnd": "16:30"}';
        
        String query = 'SELECT Metadata FROM Profile WHERE Id = \'' + profileId + '\'';
        String endpoint = URL.getSalesforceBaseUrl().toExternalForm() +
            '/services/data/v41.0/tooling/query/?q=' +
            EncodingUtil.urlEncode(query, 'UTF-8');
        
        HttpRequest request = new HttpRequest();
        request.setHeader('Authorization', auth);
        request.setEndpoint(endpoint);
        request.setMethod('GET');
        
        HttpResponse response = new Http().send(request);
        
        system.debug('response'+JSON.deserializeUntyped(response.getBody()));
        
        Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
        List<Object> records = (List<Object>) responseMap.get('records');
        if (!records.isEmpty()) {
            Map<String, Object> profileRecord = (Map<String, Object>) records[0];
            Map<String, Object> profileMetadata = (Map<String, Object>) profileRecord.get('Metadata');
            
            Map<String, Object> loginHours = (Map<String, Object>) profileMetadata.get('loginHours');
            loginHours.putAll((Map<String, Object>) JSON.deserializeUntyped(newLoginHours));
            profileMetadata.put('loginHours', loginHours);

            String profileMetadataString = JSON.serialize(profileMetadata);
            String patchEndpoint = URL.getSalesforceBaseUrl().toExternalForm() +
                '/services/data/v41.0/tooling/sobjects/Profile/' + profileId;
            
            HttpRequest patchRequest = new HttpRequest();
            patchRequest.setHeader('Authorization', auth);
            patchRequest.setHeader('Content-Type', 'application/json');
            patchRequest.setEndpoint(patchEndpoint);
            patchRequest.setMethod('PATCH');
            patchRequest.setBody(profileMetadataString);

            HttpResponse patchResponse = new Http().send(patchRequest);
            
            system.debug('patchResponse'+JSON.deserializeUntyped(patchResponse.getBody()));
 
            if (patchResponse.getStatusCode() == 204) {
                System.debug('Login hours for the profile updated successfully.');
            } else {
                System.debug('Error updating login hours for the profile: ' + patchResponse.getBody());
            }
        }
    } 
    
    class QueryResult
    {
        List<ProfileResult> records;
    }
    class ProfileResult
    {
        ProfileMetadata metadata;
    }
    class ProfileMetadata
    {
       
        LoginHours loginHours;
    }
    class LoginHours
    {
        Integer sundayStart, sundayEnd;
        Integer mondayStart, mondayEnd;
        Integer tuesdayStart, tuesdayEnd;
        Integer wednesdayStart, wednesdayEnd;
        Integer thursdayStart, thursdayEnd;
        Integer fridayStart, fridayEnd;
        Integer saturdayStart, saturdayEnd;
    }
}