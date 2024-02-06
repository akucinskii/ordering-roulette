import { nanoid } from "nanoid";

export const generateCode = () => {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
};
