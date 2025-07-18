import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const initialTextElement = {
  id: "1",
  text: "POV",
  x: 50,
  y: 50,
  fontSize: 300,
  opacity: 1,
  font: "arial",
  color: "rgba(255, 255, 255, 1)",
};
