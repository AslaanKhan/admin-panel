"use client";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createOffer, getOfferById, updateOfferById } from "@/services/offer.service";
import { getAllProducts } from "@/services/porducts.services";
// import { createOffer, getOfferById, updateOffer } from "@/services/offer.services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const offerSchema = z.object({
    productIds: z.array(
        z.object({
            product: z.string().min(1, "Product ID is required"),
        }).required()
    ),
    discountPercentage: z.number().optional(),
    flatDiscount: z.number().optional(),
    conditions: z
        .object({
            minQuantity: z.number().optional(),
            discountPerVal: z.number().optional(),
        })
        .optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    code: z.string().optional(),
    isActive: z.boolean(),
});

type Props = {
    params: {
        offerId: string;
    };
};

const OfferPage = ({ params: { offerId } }: Props) => {
    const router = useRouter();
    const [offer, setOffer] = useState<any>({
        productIds: [{ product: "", productName: "" }],
        discountPercentage: 0,
        flatDiscount: 0,
        conditions: {},
        isActive: true,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [products, setProducts] = useState<any>([]);

    const fetchOffer = async () => {
        const response = await getOfferById(offerId);
        setOffer(response?.offer);
    };

    const fetchProducts = async () => {
        const response = await getAllProducts();
        setProducts(response?.products);
    };

    useEffect(() => {
        fetchProducts();
        if (offerId !== 'new') {
            fetchOffer();
        }
        setIsEditing(true); // Set editing mode if offerId is provided
    }, [offerId]);

    const handleSave = async () => {
        try {
            console.log(offer)
            offerSchema.parse(offer);
            const response = offerId !== 'new' ? await updateOfferById(offerId, offer)
            : await createOffer(offer);
            if (response?.status == 200) {
                toast.success(response?.message);
                router.push(`/dashboard/offers/`);
            } else {
                response?.data.map((error: any) => toast.error(error.message));
            }
            setErrors({}); // Clear errors on success
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors = {};
                error.errors.forEach((e) => {
                    //   newErrors[e.path[0]] = e.message;
                    toast.error(`${e.path} is ${e.message}`);
                });
                setErrors(newErrors);
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    };

    const handleProductChange = (index: number, field: string, value: any) => {
        const updatedProducts = [...offer.productIds];
        if (field === "product") {
            updatedProducts[index].product = value._id
            updatedProducts[index].productName = value.title;
            console.log(offer)
        } else {
            updatedProducts[index][field] = value;
        }
        setOffer({ ...offer, productIds: updatedProducts });
    };

    const handleConditionChange = (index: number, field: string, value: any) => {
        const updatedProducts = [...offer.productIds];
        updatedProducts[index].conditions = {
            ...updatedProducts[index].conditions,
            [field]: value,
        };
        setOffer({ ...offer, productIds: updatedProducts });
    };

    const handleAddProduct = () => {
        setOffer((prevOffer: any) => ({
            ...prevOffer,
            productIds: [
                ...prevOffer.productIds,
                { product: "", discountPercentage: undefined, flatDiscount: undefined, conditions: {} },
            ],
        }));
    };

    const handleRemoveProduct = (index: number) => {
        const updatedProducts = offer.productIds.filter((_: any, i: any) => i !== index);
        setOffer({ ...offer, productIds: updatedProducts });
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink className="cursor-pointer" onClick={() => router.push("/dashboard")}>
                            Home
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink className="cursor-pointer" onClick={() => router.push("/dashboard/offers")}>
                            Offers
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            {isEditing ? "Edit Offer" : "Create Offer"}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-bold my-4">{isEditing ? "Edit Offer" : "Create Offer"}</h1>
            <div className="space-y-4">
                {offer?.productIds.map((product: any, index: any) => (
                    <div key={index} className="space-y-2">
                        <label className="block text-sm font-medium">Product</label>
                        <Select
                            onValueChange={(value) => {
                                const selectedProduct = products.find(
                                    (pro: any) => pro._id === value
                                );
                                if (selectedProduct) {
                                    handleProductChange(index, "product", selectedProduct) // Pass the entire selected category object
                                }
                            }}
                            value={product.product}
                            disabled={!isEditing}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                            </SelectTrigger>
                            <SelectContent>
                                {products?.map((productItem: any) => (
                                    <SelectItem key={productItem._id} value={productItem._id}>
                                        {productItem.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {/* {errors.productIds && errors.productIds[index]?.product && (
              <p className="text-red-500 text-sm">{errors.productIds[index].product}</p>
            )} */}                        
                        { offer?.productIds?.length > 1 && <Button variant="destructive" onClick={() => handleRemoveProduct(index)} disabled={!isEditing}>
                            Remove Product
                        </Button>}
                    </div>
                ))}
                <Button onClick={handleAddProduct} disabled={!isEditing}>
                    Add Another Product
                </Button>

                <div>
                <label className="block text-sm font-medium">Discount Percentage</label>
                        <Input
                            type="number"
                            value={offer?.discountPercentage || ""}
                            onChange={(e) => setOffer({ ...offer, discountPercentage: parseFloat(e.target.value)})}
                            disabled={!isEditing || offer?.flatDiscount && offer?.flatDiscount !== ''}
                        />

                        <label className="block text-sm font-medium">Flat Discount</label>
                        <Input
                            type="number"
                            value={offer?.flatDiscount || ""}
                            onChange={(e) => setOffer({ ...offer, flatDiscount: parseFloat(e.target.value)})}
                            disabled={!isEditing || offer?.discountPercentage && offer?.discountPercentage !== ''}
                        />

                        <label className="block text-sm font-medium">Minimum Quantity</label>
                        <Input
                            type="number"
                            value={offer?.conditions?.minQuantity || ""}
                            onChange={(e) => setOffer({ ...offer, minQuantity: parseInt(e.target.value)})}
                            disabled={!isEditing}
                        />

                        <label className="block text-sm font-medium">Discount per Value</label>
                        <Input
                            type="number"
                            value={offer?.conditions?.discountPerVal || ""}
                            onChange={(e) => setOffer({ ...offer, discountPerVal: parseFloat(e.target.value)})}
                            disabled={!isEditing}
                        />

                    <label className="block text-sm font-medium">Start Date</label>
                    <Input
                        type="date"
                        value={offer?.startDate instanceof Date && offer?.startDate?.toISOString()?.split("T")[0]}
                        onChange={(e) => setOffer({ ...offer, startDate: e.target.value !== '' ? new Date(e.target.value) : '' })}
                        disabled={!isEditing}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">End Date</label>
                    <Input
                        type="date"
                        value={offer?.endDate instanceof Date && offer?.endDate?.toISOString()?.split("T")[0]}
                        onChange={(e) => setOffer({ ...offer, endDate: e.target.value !== '' ? new Date(e.target.value) : '' })}
                        disabled={!isEditing}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Code</label>
                    <Input
                        value={offer?.code}
                        onChange={(e) => setOffer({ ...offer, code: e.target.value })}
                        disabled={!isEditing}
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={offer?.isActive}
                        onChange={(e) => setOffer({ ...offer, isActive: e.target.checked })}
                        disabled={!isEditing}
                    />
                    <label className="ml-2">Is Active</label>
                </div>

                <Button onClick={handleSave} disabled={!isEditing}>
                    {isEditing ? "Update Offer" : "Create Offer"}
                </Button>
            </div>
        </div>
    );
};

export default OfferPage;
