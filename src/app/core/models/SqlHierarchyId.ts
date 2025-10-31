export class SqlHierarchyId implements ISqlHierarchyId {
  readonly isNull?: boolean;

  constructor(data?: ISqlHierarchyId) {
    if (data) {
      for (let property in data) {
          if (data.hasOwnProperty(property)) (this as any)[property] = (data as any)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      (this as any).isNull = _data["isNull"];
    }
  }

  static fromJS(data: any): SqlHierarchyId {
    data = typeof data === 'object' ? data : {};
    let result = new SqlHierarchyId();
    result.init(data);
    return result;
  }

  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data["isNull"] = this.isNull;
    return data;
  }
}

export interface ISqlHierarchyId {
  isNull?: boolean;
}
