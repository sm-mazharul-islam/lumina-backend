export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: "User" | "Admin" | "Manager"; // Supports Multiple Roles
  createdAt?: Date;
}
