(function(angular){
    'use strict';
    
    angular
    .module('OpenDashboard')
    .controller('WelcomeController', function($log, $scope, $location,
                                                OpenDashboard_API, ContextMappingService) {    
        $scope.isStudent = OpenDashboard_API.getCurrentUser().isStudent();
        
        $scope.saveContextMapping = function() {
            var inbound_lti_launch_request = OpenDashboard_API.getInbound_LTI_Launch();
            
            // TODO handle non-context case
            var cm_options = {};
            cm_options.key = inbound_lti_launch_request.oauth_consumer_key;
            cm_options.context = inbound_lti_launch_request.context_id;
            
            var options = OpenDashboard_API.createContextMappingInstance(cm_options);

            ContextMappingService.create(options)
            .then(function(savedContextMapping) {
                var cm = OpenDashboard_API.createContextMappingInstance(savedContextMapping);
                var url = '/cm/' + cm.id + '/dashboard';
                
                var dashboards = cm.dashboards;
                if (dashboards && dashboards.length > 0) {
                    var dashboard = dashboards[0];
                    $log.log('default dashboard: '+dashboard);
                    url = url + '/' + dashboard.id;
                }
                
                $location.path(url);
            });
        };        

    });
})(angular);
