import { httpClient } from "@/lib/http-client";

export async function createOmiseAccount(data: {
  bank_account_number: string;
  bank_account_name: string;
  bank_code: string;
}) {
  try {
    const res = await httpClient.post("/payment/api/omise/create-account", data);
    return res.data;
  } catch (error) {
    console.error("Error creating Omise account:", error);
    throw error;
  }
}
