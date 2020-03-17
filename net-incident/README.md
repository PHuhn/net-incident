# NetIncident

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Net-Incident

### About Net-Incident

Given classified incident logs (like SQL injection, XSS or PHP vulnerabilities),
this application groups the incidents by IP address, lookup the ISP abuse e-mail address, ISP name and NIC (Network Information Center). Can generate an e-mail message via the incident type template.  If mail is configured, it will send the message to the ISP’s abuse e-mail address.

### Construction

Is an Angular 9 CLI application that uses PrimeFaces PrimeNG library for the following:
* p-table,
* p-ComfirmDialog,
* p-dialog (window/popup),
* pButton,
* p-menubar (menu),
* p-dropdown.

The app-component is the conventional root component. The component structure is as follows:

* app-component
  * app-alerts
  * router-outlet (app-routing.module)
  * p-confirmDialog
  * app-header
    * p-menubar
      * app-about
      * app-contact
      * app-help
  * app-login
    * app-server-selection-window
  * app-incident-grid
    * app-server-selection-window
    * app-incident-detail-window
    * app-incident-note-grid
      * app-incident-note-detail-window
    * app-networklog-grid
