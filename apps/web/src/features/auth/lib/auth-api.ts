import { unwrap } from "@/lib/api/api-error";
import { api } from "@/lib/api/client";

export function requestOtp(phone: string) {
  return unwrap(api.POST("/api/auth/request-otp", { body: { phone } }));
}

export function verifyOtp(phone: string, code: string) {
  return unwrap(api.POST("/api/auth/verify-otp", { body: { phone, code } }));
}

export function signOut() {
  return unwrap(api.POST("/api/auth/logout"));
}
