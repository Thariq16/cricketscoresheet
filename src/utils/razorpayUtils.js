import { toast } from "react-toastify";
import { sendHttpRequest } from "../common/Common";

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


// Function to handle payment
export const handlePayment = async (amount, currency, name, email, contact ) => {
  const res = await loadRazorpayScript();
  if (!res) {
    alert('Failed to load Razorpay script. Please check your internet connection.');
    return;
  }

  let data = { amount, currency }

  console.log(data)

  sendHttpRequest(
    "POST",
    "/payment/create-order",
    null,
    JSON.stringify(data)
  )
    .then(async (res) => {
      const { order } = res.data;

      // Open Razorpay checkout
      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'FieldR',
        description: 'Test Transaction',
        image: 'https://www.fieldr.lk/img/logo.png',
        order_id: order.id,
        handler: function (response) {
          // alert(`Payment ID: ${response.razorpay_payment_id}`);
          // alert(`Order ID: ${response.razorpay_order_id}`);
          // alert(`Signature: ${response.razorpay_signature}`);

          // Send the payment details to the backend for verification
          sendHttpRequest(
            "POST", "/payment/verify-payment",
            null,
            JSON.stringify(response))
            .then((paymentResponse) => {
              if (paymentResponse.data.success) {
                toast.success(`Payment verified successfully!`);
              } else {
                toast.success(`Payment verification failed. Please try again.`)
              }
            }).catch((err) => {
              console.log('paymentResponse err :: ', err);
              toast.error(`${err}`)
            })
        },
        prefill: {
          name: name,
          email: email,
          contact: contact,
        },
        theme: {
          color: '#3399cc',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    })
    .catch((error) => {
      toast.error(error.response.data.message);
    });
};