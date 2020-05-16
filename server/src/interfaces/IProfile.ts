export default interface IProfile {
  user: string;
  handle: string;
  company?: string;
  website?: string;
  location?: string;
  status: string;
  skills: string[];
  bio?: string;
  github_username?: string;
  experience?: {
    title: string;
    company: string;
    location?: string;
    from: Date;
    to?: Date;
    current: boolean;
    description?: string;
  }[];
  education?: {
    school: string;
    degree: string;
    field_of_study: string;
    from: Date;
    to?: Date;
    current: boolean;
    description?: string;
  }[];
  social?: {
    youtube: string;
    twitter: string;
    facebook: string;
    linkedin: string;
    instagram: string;
  };
}
