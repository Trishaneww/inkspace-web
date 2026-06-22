// Libs
import { api } from "@/lib/api/client";
import type {
  CheckoutResponse,
  CreatePaymentRequestPayload,
  PaymentRequest,
  PublicPaymentRequest,
} from "@/types/payments";

export const paymentsApi = {
  createPaymentRequest(
    token: string,
    bookingId: string,
    payload: CreatePaymentRequestPayload,
  ) {
    return api.post<PaymentRequest>(
      `/v1/current-user/bookings/${bookingId}/payment-requests`,
      payload,
      token,
    );
  },

  cancelPaymentRequest(token: string, paymentRequestId: string) {
    return api.post<PaymentRequest>(
      `/v1/current-user/payment-requests/${paymentRequestId}/cancel`,
      {},
      token,
    );
  },

  resendPaymentRequest(token: string, paymentRequestId: string) {
    return api.post<PaymentRequest>(
      `/v1/current-user/payment-requests/${paymentRequestId}/resend`,
      {},
      token,
    );
  },

  refundPaymentRequest(token: string, paymentRequestId: string) {
    return api.post<PaymentRequest>(
      `/v1/current-user/payment-requests/${paymentRequestId}/refund`,
      {},
      token,
    );
  },

  getPublic(token: string) {
    return api.get<PublicPaymentRequest>(`/v1/pay/${token}`);
  },

  createClientCheckout(token: string, authToken: string) {
    return api.post<CheckoutResponse>(
      `/v1/current-user/payments/${token}/checkout`,
      {},
      authToken,
    );
  },
};
