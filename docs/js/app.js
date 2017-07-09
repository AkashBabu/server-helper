require("jquery")
import * as angular from "angular"
require("angular-route")
require("angular-route-segment")
require("angular-aria")
require("angular-animate")
require("angular-material")
// require("rainbow-code/dist/rainbow.min")
require("prismjs")

require("angular-material/angular-material.css")
// require("rainbow-code/themes/css/github")
// require("rainbow-code/src/language/javascript")
require("prismjs/themes/prism")
// require("prismjs/themes/prism-dark")
require("../css/style.css");

var app = angular.module('app', ["ngRoute", 'route-segment', 'view-segment', 'ngAria', 'ngAnimate', 'ngMaterial']);

require("./app.config")(app);
require("./app.services")(app);
require("./app.controllers")(app);