'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
 

const CheckoutPage = () => {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { addOrderToDatabase } = useOrders(); // Get the function from the hook
  const [confirmation, setConfirmation] = useState<{ awb: string; pickupId: string } | null>(null);
  const { user, profileDetails } = useAuth();

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
        handler: async function (response: any) {
          // ——— Delhivery Integration — Robust Version ———
          // 1. Create Shipment
          const address = {
            ...orderDetails.selectedAddress,
            name: orderDetails.selectedAddress.name || (user && user.displayName) || 'Customer Name',
            phone: orderDetails.selectedAddress.phone || (profileDetails && profileDetails.phoneNumber) || (user && user.phoneNumber) || '9999999999',
            email: orderDetails.email || 'support@yourdomain.com',
          };
          // Always send payment_mode and product for Delhivery
          const payment_mode = 'Prepaid'; // Razorpay = prepaid
          const product = 'D'; // 'D' for prepaid, 'C' for COD
          const shipResp = await fetch('/api/delhivery/create-shipment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              address,
              weight: 1, // TODO: calculate total weight from orderDetails.cartItems
              dimensions: { length: 1, width: 1, height: 1 }, // TODO: calculate combined dimensions from cartItems
              payment_mode,
              product
            })
          });
          const shipData = await shipResp.json();

          // Always ok; check success flag
          if (!shipData.success) {
            console.error('Delhivery Create Shipment Failed:', shipData.rmk);
            toast({
              title: '🎉 Just4U — Order Placed Successfully!',
              description: "Thank you for your order! Your order has been placed and is being processed by our team. We\'ll notify you as soon as your shipment is scheduled for pickup and share your tracking details. If you have any questions, feel free to contact our support.",
              variant: 'default',
            });
            // OPTIONAL: Save this order to a "manual-fulfillment" list in your database
            return;
          }

          const awb = shipData.shipments[0].awb;

          // 2. Schedule Pickup
          // Send product name and Razorpay payment details
          const productName = orderDetails.cartItems && orderDetails.cartItems.length > 0 ? orderDetails.cartItems[0].product.name : 'Product';
          const pickupResp = await fetch('/api/delhivery/create-pickup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              shipmentIds: [awb],
              orderPlacedDate: new Date().toISOString().slice(0,10),
              productName,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature
            })
          });
          const pickupData = await pickupResp.json();

          if (!pickupData.pickup || !pickupData.success) {
            console.error('Delhivery Pickup Scheduling Error:', pickupData);
            alert('⚠️ Pickup scheduling failed');
            return;
          }

          // 3. Persist & Confirm
          await fetch('/api/update-order-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              awb,
              pickupId: pickupData.pickup.pickup_id || pickupData.pickup_id
            })
          });

          setConfirmation({
            awb,
            pickupId: pickupData.pickup.pickup_id || pickupData.pickup_id
          });
          // ————————————————————————
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
  }, [orderDetails, addOrderToDatabase, user, profileDetails]); // Add addOrderToDatabase and user to dependency array


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

      {confirmation && (
        <div className="mt-6 p-4 border border-green-500 rounded bg-green-100 text-green-900">
          <h3 className="font-semibold">Shipment Scheduled!</h3>
          <p>AWB Number: <strong>{confirmation.awb}</strong></p>
          <p>Pickup ID: <strong>{confirmation.pickupId}</strong></p>
          <p>You can track your order with the AWB on our Order History page.</p>
        </div>
      )}

      {/* No editing or modification options on this page */}
    </div>
  );
};

export default CheckoutPage;