require("jquery")
require("angular")
require("angular-aria")
require("angular-animate")
require("angular-material")
require("prismjs")
// require("angular-scroll")

require("angular-material/angular-material.css")
require("prismjs/themes/prism")
require("../css/style.css");

var app = angular.module('app', ['ngAria', 'ngAnimate', 'ngMaterial'
    // , 'duScroll'
]);

require("./app.services")(app);
require("./app.controllers")(app);
// require("./app.directives")(app);