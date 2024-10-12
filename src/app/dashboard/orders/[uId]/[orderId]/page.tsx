"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getOrderDetails } from "@/services/orders.services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  params?: {
    orderId?: string;
  };
};

const OrderDetails = ({ params }: Props) => {
  const orderId = params?.orderId;
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const router = useRouter();
  async function getServerSideProps() {
    const res = await getOrderDetails(orderId);
    setOrderDetails(res.order[0]);
  }

  useEffect(() => {
    getServerSideProps();
  }, []);

  if (!orderDetails) {
    return <p className="text-center text-xl">Loading...</p>;
  }

  return (
    <div className="space-y-4 overflow-clip">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className="cursor-pointer"
              onClick={() => router.back()}
            >
              Orders
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Order Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Order Details</h1>
        <div className="mb-6 p-4 bg-gray-100 rounded-md hover:shadow-2xl border">
          <h2 className="text-xl font-semibold">User Information</h2>
          <p>
            Name: <span className="font-medium">{orderDetails.user.name}</span>
          </p>
          <p>
            Contact Number:{" "}
            <span className="font-medium">{orderDetails.user.number}</span>
          </p>
          <p>
            Order Date:{" "}
            <span className="font-medium">
              {new Date(orderDetails.orderDate).toLocaleString().split(",")[0]}{" "}
              Time:
              {new Date(orderDetails.orderDate).toLocaleString().split(",")[1]}
            </span>
          </p>
          <p>
            Order Status:{" "}
            <span className={`capitalize ${orderDetails?.orderStatus === 'completed' ? 'text-green-600' : orderDetails?.orderStatus === 'pending' ? 'text-yellow-600/50' : 'text-red-600' } font-bold`}>{orderDetails?.orderStatus}</span>
          </p>
        </div>
        <div className=" overflow-y-auto p-4" style={{ maxHeight: "50vh", scrollbarWidth: "thin" }}>
        <h2 className="text-xl font-semibold mb-4">Products</h2>
        <ul className="space-y-4">
          {orderDetails.products.map((product) => (
            <li
              key={product.productId}
              className="flex items-center p-4 border rounded-md shadow-sm hover:shadow-2xl bg-gray-50"
            >
              <div className="flex-shrink-0">
                {product.image && product.image.length > 0 && (
                  <img
                    src={product.image[0].path}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">{product.title}</h3>
                <p>Quantity: {product?.quantity}</p>
                <p>Price: Rs.{product?.price?.toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
        </div>
        <div className="flex justify-between mt-6">
          <h3 className="text-lg font-bold mt-2 p-4 rounded-2xl hover:shadow-xl">
            Payment Mode: {orderDetails?.paymentMehtod}
          </h3>
          <h3 className="text-lg font-bold mt-2 p-4 rounded-2xl hover:shadow-xl">
            Total Price: Rs.{orderDetails?.totalPrice?.toFixed(2)}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
