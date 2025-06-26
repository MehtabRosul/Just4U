'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';
 

const CheckoutPage = () => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { addOrderToDatabase } = useOrders(); // Get the function from the hook

  const handlePayment = useCallback(async () => {
    // No need to get the hook here, addOrderToDatabase is in scope
    if (!orderDetails) { // Use the state variable directly here after the initial check
      toast({
        title: 'Error',
        description: 'Order details not loaded.',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log("Sending total:", orderDetails.total);
      // Create Razorpay order on the server
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: orderDetails.total }),
      });

      if (!response.ok) {
        throw new Error('Failed to create Razorpay order');
      }

      const order = await response.json();

      // Open Razorpay payment modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay Key ID from environment variables
        amount: order.amount, // Amount is in smallest currency unit (paise for INR)
        currency: order.currency,
        name: "just4u", // Your business name
        description: "Order Payment", // Order description
        order_id: order.id, // Order ID obtained from the server
        handler: function (response: any) {
          // Handle successful payment here
          console.log("Payment successful:", response);

          // Add order to Firebase database after successful payment
          const orderData = {
            ...orderDetails, // Include all order details
            paymentDetails: response, // Include Razorpay payment response
            orderDate: new Date().toISOString(), // Add timestamp
          };
          addOrderToDatabase(orderData); // Call the function to add to database

          // Make an API call to your backend to update the order status
          fetch('/api/update-order-status', { // Assuming you have an endpoint for this
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderId: order.id, // Order ID from your backend order creation
              paymentDetails: response, // Pass payment details for verification
            }),
          })
            .then(updateResponse => updateResponse.json())
            .then(updateData => {
              console.log('Order update response:', updateData);
              // You might handle the response here, e.g., confirm status update
            });
          toast({
            title: 'Payment Successful',
            description: 'Your payment was processed successfully.',
            variant: 'default',
          });
          // You might want to redirect the user to a success page
          // router.push('/order-success');
        },
        prefill: {
          // Pre-fill customer details if available
          // name: orderDetails.selectedAddress.name, // Assuming you have a name in address
          // email: orderDetails.email, // Assuming you have email in order details
          // contact: orderDetails.selectedAddress.phone, // Assuming you have phone in address
        },
        notes: {
          // Optional notes
          // address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc", // Customize the theme color
        },
      };
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error: any) {
      console.error('Error during payment process:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'An error occurred during the payment process.',
        variant: 'destructive',
      });
    }
  }, [orderDetails, addOrderToDatabase]); // Add addOrderToDatabase to dependency array


  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("Checking localStorage for orderDetails...");
      const storedOrderDetails = localStorage.getItem('orderDetails');
      if (storedOrderDetails) {
        console.log('Retrieved from localStorage:', storedOrderDetails); // Log retrieved data
        try {
          setOrderDetails(JSON.parse(storedOrderDetails));
        } catch (error) {
          console.error('Error parsing order details from localStorage:', error); // Log parsing errors
 console.log("orderDetails after setting state:", orderDetails);
          // Handle the error, e.g., clear localStorage or show an error message
        }
      }

    } 
  }, [setOrderDetails]);

  if (!orderDetails) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Order Summary</h1>
        <p>Loading order details...</p>
      </div>
    );
  }

  // Destructure order details only when orderDetails is available
  const { cartItems, selectedAddress, photoPreviewUrl, subtotal, shipping, tax, total } = orderDetails;

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-2xl font-bold mb-6">Order Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          {cartItems.map((item: any) => (
            <div key={item.product.id} className="border rounded-md p-4 mb-4">
              <div className="flex items-center mb-2">
                <span className="font-semibold mr-2">Product Name:</span> {item.product.name} ({item.quantity})
              </div>
              <div className="flex items-center">
                <span className="font-semibold mr-2">Total Price:</span> Rs. {(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}

          {photoPreviewUrl && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Uploaded Photo</h2>
              <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                <Image src={photoPreviewUrl} alt="Uploaded Photo Preview" layout="fill" objectFit="cover" />
              </div>
            </div>
          )}
        </div>

        {/* Delivery Address and Order Total */}
        <div className="text-white">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <div className="border rounded-md p-4 mb-6">
            <p>{selectedAddress.street}</p>
            <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}</p>
          </div>

          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          <p>Item(s) Total: Rs. {subtotal.toFixed(2)}</p>
          <p>Shipping: Rs. {shipping.toFixed(2)}</p>
          <p>Estimated Tax (5%): Rs. {tax.toFixed(2)}</p>

          <h2 className="text-xl font-semibold mb-4">Order Total</h2>
          <div className="border rounded-md p-4">
            <p className="text-lg font-bold">Rs. {total.toFixed(2)}</p>
          </div>

          <button onClick={handlePayment} className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Place Order
          </button>
        </div>
      </div>

      {/* No editing or modification options on this page */}
    </div>
  );
};

export default CheckoutPage;