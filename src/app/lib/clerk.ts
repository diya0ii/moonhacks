import { getAuth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/clerk-sdk-node";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// Get the user's role from Clerk private metadata
export const getUserRole = async (userId: string): Promise<string> => {
  try {
    const user = await clerk.users.getUser(userId);
    return user.privateMetadata?.role as string || "Member"; // Use privateMetadata for security
  } catch (error) {
    console.error("Error fetching user role:", error);
    throw new Error("Failed to fetch user role");
  }
};

// Middleware to check if user is authenticated and return their ID
export const getCurrentUserId = (req: any): string => {
  const { userId } = getAuth(req);
  if (!userId) throw new Error("Not authenticated");
  return userId;
};

// Middleware to check if the user is an Admin
export const isAdmin = async (req: any): Promise<boolean> => {
  try {
    const userId = getCurrentUserId(req);
    const role = await getUserRole(userId);
    return role === "Admin";
  } catch {
    return false;
  }
};

// Middleware to check if the user is a Lead
export const isLead = async (req: any): Promise<boolean> => {
  try {
    const userId = getCurrentUserId(req);
    const role = await getUserRole(userId);
    return role === "Lead";
  } catch {
    return false;
  }
};

// Middleware to check if the user is a Member
export const isMember = async (req: any): Promise<boolean> => {
  try {
    const userId = getCurrentUserId(req);
    const role = await getUserRole(userId);
    return role === "Member";
  } catch {
    return false;
  }
};

// Get the current user's data, including role and profile image
export const getCurrentUser = async (req: any) => {
  try {
    const userId = getCurrentUserId(req);
    const user = await clerk.users.getUser(userId);

    return {
      id: userId,
      email: user.emailAddresses[0]?.emailAddress,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      role: user.privateMetadata?.role as string || "Member",
      profileImage: user.imageUrl,
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw new Error("Failed to fetch user data");
  }
};
