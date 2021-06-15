public with sharing class clsLazyLoading {
    
    @AuraEnabled(Cacheable=true)    
    public static List<Account> getAccounts(integer LimitSize, integer offset){


            List<Account> lstAccounts = new List<Account>();


            lstAccounts = [Select Id, Name, Rating from Account Order by Name limit :LimitSize offset :offset];

            return lstAccounts;



    }
}
