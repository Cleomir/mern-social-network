export default interface IEducation {
  id?: string;
  school: string;
  degree: string;
  field_of_study: string;
  from: Date;
  to?: Date;
  current: boolean;
  description?: string;
}
