import {SqlInt32} from "./SqlInt32";
import {SqlDouble} from "./SqlDouble";

export class SqlGeography implements ISqlGeography {
  readonly isNull?: boolean;
  stSrid?: SqlInt32;
  lat?: SqlDouble;
  long?: SqlDouble;
  z?: SqlDouble;
  m?: SqlDouble;
  readonly hasZ?: boolean;
  readonly hasM?: boolean;

  constructor(data?: ISqlGeography) {
    if (data) {
        for (let property in data) {
            if (data.hasOwnProperty(property)) (this as any)[property] = (data as any)[property];
        }
    }
  }

  init(_data?: any) {
    if (_data) {
      (this as any).isNull = _data["isNull"];
      this.stSrid = _data["stSrid"] ? SqlInt32.fromJS(_data["stSrid"]) : undefined as any;
      this.lat = _data["lat"] ? SqlDouble.fromJS(_data["lat"]) : undefined as any;
      this.long = _data["long"] ? SqlDouble.fromJS(_data["long"]) : undefined as any;
      this.z = _data["z"] ? SqlDouble.fromJS(_data["z"]) : undefined as any;
      this.m = _data["m"] ? SqlDouble.fromJS(_data["m"]) : undefined as any;
      (this as any).hasZ = _data["hasZ"];
      (this as any).hasM = _data["hasM"];
    }
  }

  static fromJS(data: any): SqlGeography {
    data = typeof data === 'object' ? data : {};
    let result = new SqlGeography();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data["isNull"] = this.isNull;
    data["stSrid"] = this.stSrid ? this.stSrid.toJSON() : undefined as any;
    data["lat"] = this.lat ? this.lat.toJSON() : undefined as any;
    data["long"] = this.long ? this.long.toJSON() : undefined as any;
    data["z"] = this.z ? this.z.toJSON() : undefined as any;
    data["m"] = this.m ? this.m.toJSON() : undefined as any;
    data["hasZ"] = this.hasZ;
    data["hasM"] = this.hasM;
    return data;
  }
}

export interface ISqlGeography {
  isNull?: boolean;
  stSrid?: SqlInt32;
  lat?: SqlDouble;
  long?: SqlDouble;
  z?: SqlDouble;
  m?: SqlDouble;
  hasZ?: boolean;
  hasM?: boolean;
}
