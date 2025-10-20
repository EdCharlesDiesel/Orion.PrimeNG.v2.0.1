// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  userProfileUrl: "http://localhost:9003/api/Auth",
  humanResourcesBaseURL: "http://localhost:9008/api/",
  personBaseURL: "http://localhost:9010/api/",
  salesBaseURL: "http://localhost:9006/api/",
  baseURL: "http://localhost:8080/",

  purchasingBaseURL: "http://localhost:9003/api/Auth"

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
