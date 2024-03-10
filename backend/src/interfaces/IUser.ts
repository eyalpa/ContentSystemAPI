// interfaces/IUser.ts
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  country: string;
  communities: string[];
  image?: string;
  password?: string; // Add password field
  // ... any other user properties
}
