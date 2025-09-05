export interface Profile {
    id: number;
    name: string;
    department: string | null;
    points: number;
  }
  
  export interface ActivityItem {
    at: string;       // ISO date
    text: string;
    delta: number;    // + or -
  }
  