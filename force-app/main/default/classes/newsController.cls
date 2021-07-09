public with sharing class newsController {

    @AuraEnabled
     public static Map<string, Object> RetreiveNews() {
        
        Http http = new Http();
        string strResponse = null;
        Map<string,Object> newsJsonData = new Map<String,Object>();
        try {
            
            HttpRequest httpReq = new HttpRequest();
            httpReq.setMethod('GET');
            httpReq.setEndpoint('https://newsapi.org/v2/everything?q=tesla&from=2021-06-09&sortBy=publishedAt&apiKey=13feb9c14c6c40a2a070468f61db5a31');
            HttpResponse httpRes = new HttpResponse();
            httpRes = http.send(httpReq);
            if(httpRes.getStatusCode() == 200)
            {
                strResponse = httpRes.getBody();
            }
            else {
                
                throw new CalloutException(httpRes.getBody());

            }


        } catch (Exception Ex)  {

            throw  Ex;
            
        }

        if (string.isNotBlank(strResponse))
             newsJsonData = (Map<String,Object>)JSON.deserializeUntyped(strResponse);
       
             If(!newsJsonData.isEmpty())
                return newsJsonData;
            else 
                return null;

    }
}
