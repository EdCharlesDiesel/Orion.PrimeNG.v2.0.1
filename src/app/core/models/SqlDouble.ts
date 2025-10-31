export class SqlDouble implements ISqlDouble {
  readonly isNull?: boolean;
  value?: number;

  constructor(data?: ISqlDouble) {
    if (data) {
      for (let property in data) {
          if (data.hasOwnProperty(property)) (this as any)[property] = (data as any)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      (this as any).isNull = _data["isNull"];
      this.value = _data["value"];
    }
  }

  static fromJS(data: any): SqlDouble {
    data = typeof data === 'object' ? data : {};
    let result = new SqlDouble();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data["isNull"] = this.isNull;
    data["value"] = this.value;
    return data;
  }
}

export interface ISqlDouble {
  isNull?: boolean;
  value?: number;
}
