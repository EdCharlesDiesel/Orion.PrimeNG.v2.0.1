import { Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AppPropertiesService {

  // constructor(@Inject('ENV_CONFIG') private envConfig: enviroment) {
  //   if (envConfig.override) {
  //     const override = envConfig.override;
  //     for (const key in override) {
  //       if (this.hasOwnProperty(key)) {
  //         //TODO Fix this and research
  //      //   this.[key] = override[key];
  //       }
  //     }
  //   }
  // }

  API_URI_PREFIX = '/api';
  API_PORT = 8080; // if null then the location.port will be taken
  API_HOST = null; // if null then the location.hostName will be taken
}
