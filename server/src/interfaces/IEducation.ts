export default interface IEducation {
  school: string;
  degree: string;
  field_of_study: string;
  from: Date;
  to?: Date;
  current: boolean;
  description?: string;
}
