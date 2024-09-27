'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";

type props = {
    params: {
        productId: string;
    };
}

const ProductPage = ({ params: { productId } }:props) => {
    const router = useRouter();

    const [product, setProduct] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);

    // useEffect(() => {
    //     // Fetch the product details
    //     const fetchProduct = async () => {
    //         const response = await fetch(`/api/products/${productId}`);
    //         const data = await response.json();
    //         setProduct(data);
    //     };

    //     if (productId) {
    //         fetchProduct();
    //     }
    // }, [productId]);

    const handleSave = async () => {
        // Implement save logic here
        const response = await fetch(`/api/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
        });
        
        if (response.ok) {
            setIsEditing(false);
            // Optionally, refetch product details or redirect
            router.push(`/products/${productId}`);
        }
    };

    // if (!product) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">{isEditing ? "Edit Product" : "Product Details"}</h1>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <Input
                        value={product?.title}
                        onChange={(e) => setProduct({ ...product, title: e.target.value })}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Price</label>
                    <Input
                        type="number"
                        value={product?.price}
                        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <Textarea
                        value={product?.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        disabled={!isEditing}
                    />
                </div>
                <div className="flex items-center">
                    <Checkbox
                        checked={product?.isAvailable}
                        onCheckedChange={(checked) => setProduct({ ...product, isAvailable: checked })}
                        disabled={!isEditing}
                    />
                    <label className="ml-2">Available</label>
                </div>
                <div>
                    <label className="block text-sm font-medium">Image URL</label>
                    <Input
                        value={product?.image[0]}
                        onChange={(e) => setProduct({ ...product, image: [e.target.value] })}
                        disabled={!isEditing}
                    />
                </div>
            </div>
            <div className="mt-6">
                {isEditing ? (
                    <>
                        <Button onClick={handleSave} className="mr-2">Save</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </>
                ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit</Button>
                )}
            </div>
        </div>
    );
};

export default ProductPage;
