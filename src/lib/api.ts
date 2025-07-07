// src/lib/api.ts
import { OCRResponse, APIErrorResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

export async function processReceiptAPI(imageFile: File): Promise<OCRResponse> {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/extract`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData: APIErrorResponse = await response.json();
      throw new APIError(
        errorData.error || "Failed to process receipt",
        response.status,
        errorData.details
      );
    }

    const data: OCRResponse = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }

    // Handle network errors or other unexpected errors
    throw new APIError(
      "Network error: Unable to connect to the server",
      0,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

// Helper function to check if the API is available
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
    });
    return response.ok;
  } catch {
    return false;
  }
}
