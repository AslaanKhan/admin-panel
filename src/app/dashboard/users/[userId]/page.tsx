"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getUserById } from "@/services/user.services";
import { User } from "../page";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

type props = {
  params:{ 
    userId: string
  }
} 
const UserDetails = ({ params }: props) => {
  const { userId } = params;
  const router = useRouter();
  const [userData, setUserData] = useState<User>();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(userId);
        const data = response?.data.user
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    }  
    fetchUserData();
  },[])

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    userData && setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    // Call API to save the updated user data
    await fetch(`/api/users/${userData?._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    setIsEditing(false);
    // Optionally, you can redirect or show a success message here
  };

  return (
    <div className="max-w-lg mx-auto p-4">
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
              Users
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              User Details
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-bold my-4">{isEditing ? "Edit User" : "User Details"}</h1>
      <Separator className="mb-4" />
      <div className="space-y-4">
        <Input
          name="name"
          aria-label="Name"
          value={userData?.name}
          onChange={handleInputChange}
          readOnly={!isEditing}
        />
        <Input
          name="email"
          aria-label="Email"
          value={userData?.email}
          onChange={handleInputChange}
          readOnly={!isEditing}
        />
        <Input
          name="number"
          aria-label="Phone Number"
          value={userData?.number}
          onChange={handleInputChange}
          readOnly={!isEditing}
        />
        {/* Note: Password field is not included for security reasons */}
      </div>
      <div className="mt-4">
        {isEditing ? (
          <>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={() => setIsEditing(false)} variant="outline" className="ml-2">Cancel</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </div>
    </div>
  );
};

// Fetch user data based on userId
// export async function getServerSideProps(context) {
//   const { userId } = context.params;
//   const res = await fetch(`https://api.example.com/users/${userId}`); // Replace with your API endpoint
//   const user = await res.json();

//   return {
//     props: { user }, // Will be passed to the page component as props
//   };
// }

export default UserDetails;
