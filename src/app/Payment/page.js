"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import LeftSideBar from "../components/LeftSideBar";
import useSidebarStore from "@/store/sidebarStore";

const Payment = () => {
  const { isSidebarOpen } = useSidebarStore();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [showPayPalModal, setShowPayPalModal] = useState(false);

  const handleContinue = (e) => {
    e.preventDefault();
    if (selectedPaymentMethod === "paypal") {
      setShowPayPalModal(true);
    } else if (selectedPaymentMethod === "stripe") {
      // Handle Stripe logic here if needed
      console.log("Stripe selected - proceeding with Stripe payment setup");
    }
  };

  const handlePayPalRedirect = () => {
    window.location.href = "https://www.paypal.com";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <main className="flex flex-1 pt-16">
        {(isSidebarOpen || window.innerWidth >= 768) && <LeftSideBar />}
        <div
          className="flex-1 px-4 py-6 md:ml-80 lg:mr-80 lg:max-w-3xl xl:max-w-4xl mx-auto"
          style={{ width: "100%", maxWidth: "1600px" }}
        >
          <div className="lg:ml-2 xl:ml-28 flex items-center justify-between mb-6" style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}>
            <h2 className="text-2xl font-bold text-gray-900">Get set up to run your ads</h2>
            <div className="flex items-center space-x-3">
              <Link href="/CreateAds">
                <Button
                  className="p-3 bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 ease-in-out transform rounded-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  <X className="w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>

          <form onSubmit={handleContinue}>
            <div
              className="lg:ml-2 xl:ml-28"
              style={{ width: "100%", marginRight: "-3rem", marginTop: "20px" }}
            >
              <p className="text-gray-700 mb-4">
                Confirm the details below and you’ll be ready to publish your first ad.
              </p>
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4 2-2.9 2-4z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 13c0 1.1.9 2 2 2s2-.9 2-2-2-4-2-4-2 2.9-2 4z"
                    />
                  </svg>
                  <button
                    type="button"
                    className="w-full p-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => setShowPaymentOptions(!showPaymentOptions)}
                  >
                    Add payment method
                  </button>
                </div>
                {showPaymentOptions && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">
                      This is the payment method we’ll keep on file for your account. You won’t be charged anything until your ads are up and running.
                    </p>
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        checked={selectedPaymentMethod === "paypal"}
                        onChange={() => setSelectedPaymentMethod("paypal")}
                        className="w-5 h-5"
                      />
                      <label htmlFor="paypal" className="flex items-center space-x-2">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png"
                          alt="PayPal"
                          className="w-6 h-6"
                        />
                        <span className="text-gray-700">Paypal</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="radio"
                        id="stripe"
                        name="paymentMethod"
                        value="stripe"
                        checked={selectedPaymentMethod === "stripe"}
                        onChange={() => setSelectedPaymentMethod("stripe")}
                        className="w-5 h-5"
                      />
                      <label htmlFor="stripe" className="flex items-center space-x-2">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1200px-Stripe_Logo%2C_revised_2016.svg.png"
                          alt="Stripe"
                          className="w-6 h-6"
                        />
                        <span className="text-gray-700">Stripe</span>
                      </label>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                    >
                      Continue
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </form>

          {showPayPalModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowPayPalModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-col items-center">
                  <svg
                    className="w-12 h-12 text-gray-500 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z"
                    />
                    <circle cx="12" cy="9" r="2" fill="currentColor" />
                  </svg>
                  <p className="text-center text-gray-700 mb-4">
                    After tapping ‘Connect with PayPal’ you will be redirected to PayPal to connect your PayPal account.
                  </p>
                  <p className="text-center text-gray-500 mb-4">
                    Use PayPal payment method for your ads campaign
                  </p>
                  <Button
                    onClick={handlePayPalRedirect}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png"
                      alt="PayPal"
                      className="w-6 h-6"
                    />
                    <span>Connect with PayPal</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Payment;