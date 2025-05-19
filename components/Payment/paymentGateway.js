"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function PaymentGateway({
  amount,
  currency = "INR",
  listingId,
  pricingOption,
  onSuccess,
  onClose,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () => {
      setError("Failed to load payment gateway. Please try again.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const displayAmount = (amount / 100).toFixed(2);

  const getPaymentDescription = () => {
    switch (pricingOption) {
      case "PREMIUM":
        return "Premium Listing (60 days + 7 days promotion)";
      case "PREMIUM_PLUS":
        return "Premium Plus Listing (120 days + 30 days promotion)";
      default:
        return "Free Listing (30 days)";
    }
  };

  const initiatePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            amount,
            currency,
            listingId,
            pricingOption,
            subscriptionId:
              pricingOption === "PREMIUM" || pricingOption === "PREMIUM_PLUS"
                ? pricingOption
                : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment order");
      }

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        onSuccess();
        return;
      }

      const { order } = data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Your Marketplace",
        description: getPaymentDescription(),
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verificationResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  listingId,
                  pricingOption,
                }),
              }
            );

            if (!verificationResponse.ok) {
              throw new Error("Payment verification failed");
            }

            setSuccess(true);
            onSuccess();
          } catch (err) {
            console.error("Verification error:", err);
            setError(err.message || "Payment verification failed");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        notes: {
          listingId,
          pricingOption,
        },
        theme: {
          color: "#10B981",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        setError(
          response.error.description || "Payment failed. Please try again."
        );
      });

      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center p-6">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600 mb-6">
          Your listing has been successfully created and will be visible
          shortly.
        </p>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Complete Payment
      </h3>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Item:</span>
          <span className="font-medium">{getPaymentDescription()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span className="font-medium">
            {currency} {displayAmount}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-3 rounded-md mb-4 flex items-center">
          <XCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={initiatePayment}
          disabled={loading}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-70 flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </button>
      </div>
    </div>
  );
}
