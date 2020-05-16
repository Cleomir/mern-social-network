import IExperience from "./IExperience";
import IEducation from "./IEducation";

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
  education?: IEducation[];
  experience?: IExperience[];
  social?: {
    youtube: string;
    twitter: string;
    facebook: string;
    linkedin: string;
    instagram: string;
  };
}
