module.exports = function (app) {
    app
        .value('duScrollDuration', 2000)
        .value('duScrollOffset', 30)

    app.controller("appCtrl", ["$mdSidenav", "$mdMedia", "$scope", "$document", "$timeout", "contentService", function ($mdSidenav, $mdMedia, $scope, $document, $timeout, contentService) {
        var vm = this;

        vm.content = contentService.content;

        vm.showSidenav = $mdMedia("gt-sm");

        vm.isString = (data) => {
            return typeof data == 'string';
        }

        vm.toggleSidenav = () => {
            vm.showSidenav = !vm.showSidenav;
        }

        vm.changeContent = (heading) => {
            vm.currHeading = heading;
            vm.currContent = vm.content[vm.currHeading]
        }

        vm.navigateTo = (location) => {
            console.log('navigating to:', location);
            $timeout(() => {
                var navEl = angular.element(document.getElementById(location));

                $document.duScrollToElement(navEl, 30, 1000);
                // $document.scrollToElementAnimated(navEl);
            }, 10)
        }

        $scope.$watch(() => {
            return !$mdMedia("gt-sm")
        }, (newVal) => {
            if (newVal) {
                vm.showSidenav = false;
            } else {
                vm.showSidenav = true;
            }
        })


        vm.changeContent("Helper")
    }])
}