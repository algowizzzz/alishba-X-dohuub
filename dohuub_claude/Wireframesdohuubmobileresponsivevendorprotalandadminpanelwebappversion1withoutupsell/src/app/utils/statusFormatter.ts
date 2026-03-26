// Status formatter utilities for converting backend enum format to display format

export type BookingStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type ListingStatus = "ACTIVE" | "PAUSED" | "SUSPENDED" | "DRAFT" | "DELETED";

export function formatBookingStatus(status: string): string {
  const map: Record<string, string> = {
    "PENDING": "Pending",
    "ACCEPTED": "Accepted",
    "IN_PROGRESS": "In Progress",
    "COMPLETED": "Completed",
    "CANCELLED": "Cancelled",
  };
  return map[status] || status;
}

export function formatListingStatus(status: string): string {
  const map: Record<string, string> = {
    "ACTIVE": "Active",
    "PAUSED": "Paused",
    "SUSPENDED": "Suspended",
    "DRAFT": "Draft",
    "DELETED": "Deleted",
  };
  return map[status] || status;
}

// Badge color mappings for consistent styling
export function getBookingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    "PENDING": "bg-yellow-100 text-yellow-800",
    "ACCEPTED": "bg-blue-100 text-blue-800",
    "IN_PROGRESS": "bg-purple-100 text-purple-800",
    "COMPLETED": "bg-green-100 text-green-800",
    "CANCELLED": "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function getListingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    "ACTIVE": "bg-green-100 text-green-800",
    "PAUSED": "bg-yellow-100 text-yellow-800",
    "SUSPENDED": "bg-red-100 text-red-800",
    "DRAFT": "bg-gray-100 text-gray-800",
    "DELETED": "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}
