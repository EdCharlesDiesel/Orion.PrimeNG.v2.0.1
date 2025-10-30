export interface DatabaseLogModel {
  databaseLogID: number;
  postTime: string;
  databaseUser: string;
  event: string;
  schema: string;
  object: string;
  tsql: string;
  xmlEvent: string;
}
