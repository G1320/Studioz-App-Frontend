import { Studio } from ".";

export default interface StudioResponse {
    currStudio: Studio
    prevStudio: { _id: string } | null;
    nextStudio: { _id: string } | null;
  

}