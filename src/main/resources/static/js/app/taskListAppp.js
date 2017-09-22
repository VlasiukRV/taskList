var app = angular.module('app', ['ui.bootstrap', 'ngResource', 'ngRoute', 'ngCookies', 'oi.select', 'cfp.hotkeys']);

app.constant('appConfig', {
    appName: "appTaskList",
    appUrl: "/"+this.appName
});