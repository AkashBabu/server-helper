module.exports = function (app) {
    app.controller("navCtrl", ["$mdSidenav", "$mdMedia", "$scope", "contentService", function ($mdSidenav, $mdMedia, $scope, contentService) {
        var ctrl = this;

        ctrl.content = contentService.content;
        console.log('navCtrl content:', ctrl.content);

        ctrl.showSidenav = $mdMedia("gt-sm");

        ctrl.toggleSidenav = () => {
            ctrl.showSidenav = !ctrl.showSidenav;
        }

        ctrl.navigateTo = function(location) {
            console.log('navigating to:', location);
        }

        $scope.$watch(() => {
            return !$mdMedia("gt-sm")
        }, (newVal) => {
            if (newVal) {
                ctrl.showSidenav = false;
            } else {
                ctrl.showSidenav = true;
            }
        })
    }])
        .controller("contentCtrl", ["contentService", function (contentService) {
            var vm = this;

            vm.methods = [];

            vm.content = contentService.content;

            // parseContent(vm.content);
            // function parseContent(content) {
            //     var rootModules = Object.keys(vm.content).map((key) => {

            //     })
            //     rootModules
            // }

            vm.contentHeading = "Helper"
            vm.methods = vm.content[vm.contentHeading].methods;
            vm.currContent = vm.content[vm.contentHeading];

        }])
}