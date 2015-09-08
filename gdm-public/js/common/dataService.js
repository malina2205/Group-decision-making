angular.module('GDMApp').factory('dataService', function authFactory ($rootScope, $http, $localStorage) {
    'use strict';
    var url2 = "http://localhost:5000/api"
    var url = "http://gdm-api.herokuapp.com/api"
    return {
        //user//
        getUserByEmail: function(mail){
            return $http.get(url+'/users?email='+mail);
        },
        //final decision
        getDecision: function(recruitmentId){
            return $http.get(url+'/answer/'+recruitmentId);
        },
        //preferences//
        getRecruitmentPreferences: function(recruitmentId) {
            return $http.get(url+'/preferences?decision='+recruitmentId);
        },
        getPreferencesById: function(preferencesId) {
            return $http.get(url+'/preferences/'+preferencesId);
        },
        getPreferencesByIdsPair: function(userId, recruitmentId) {
            return $http.get(url+'/preferences/?decision='+recruitmentId+'&expert='+userId);
        },
        updatePreferences: function(id, data){
            return $http.put(url+'/preferences/'+id, data);
        },
        addPreferences: function(data) {
            return $http.post(url+'/preferences', data);
        },
        removePreferences: function(id) {
            return $http.delete(url+'/preferences/'+id);
        },
        //decisions//
        getRecruitments: function(userId) {
            return $http.get(url+'/decisions/user/'+userId);
        },
        getRecruitment: function(id) {
            return $http.get(url+'/decisions/'+id);
        },
        addRecruitment: function(data) {
            return $http.post(url+'/decisions', data);
        },
        removeRecruitment: function(id) {
            return $http.delete(url+'/decisions/'+id);
        },
        updateRecruitment: function(recruitmentid, data) {
            return $http.put(url+'/decisions/'+recruitmentid, data);
        }
    }
});



