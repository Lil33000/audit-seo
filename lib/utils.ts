import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImpactColor = (impact?: string) => {
  switch (impact?.toLowerCase()) {
    case "élevé":
    case "high":
      return "text-red-600 bg-red-50";
    case "moyen":
    case "medium":
      return "text-yellow-600 bg-yellow-50";
    case "faible":
    case "low":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};
export const getPriorityColor = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case "haute":
    case "high":
      return "text-red-600 bg-red-50";
    case "moyenne":
    case "medium":
      return "text-yellow-600 bg-yellow-50";
    case "basse":
    case "low":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};
export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
