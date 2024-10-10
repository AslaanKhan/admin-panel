"use client";
import { CustomCarousel } from "@/components/global/carousel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCategories } from "@/services/category.service";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "@/services/porducts.services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number().positive("Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  category: z.object({
    name: z.string().min(1, "Category name is required"),
    id: z.string().min(1, "Category ID is required"),
  }),
  isAvailable: z.boolean(),
  image: z
    .array(
      z.object({
        path: z.string().url("Invalid image URL").optional(),
      })
    )
    .optional(),
});

type Props = {
  params: {
    productId: string;
  };
};

const ProductPage = ({ params: { productId } }: Props) => {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [createProductState, setCreateProduct] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<any>([]);

  const fetchCategories = async () => {
    const response = await getCategories();
    setCategories(response?.categories);
  };

  const fetchProduct = async () => {
    const response = await getProductById(productId);
    fetchCategories()
    setProduct(response?.product);
  };

  useEffect(() => {
    if (productId) {
      productId === "new"
        ? (setCreateProduct(true), fetchCategories())
        : fetchProduct();
    }
  }, [productId]);

  const handleSave = async () => {
    if (product) {
      try {
        productSchema.parse(product);
        const response = isEditing
          ? await updateProduct(productId, product)
          : await createProduct(product);
        if (response?.status === 200) {
          setProduct(response?.data.product);
          toast.success(response?.data.message);
          setIsEditing(false);
          router.push(`/dashboard/products/${response?.data.product._id}`);
        } else {
          response?.data.map((error: any) => toast.error(error.message));
        }
        setErrors({}); // Clear errors on success
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors = {};
          error.errors.forEach((e) => {
            //@ts-ignore
            newErrors[e.path[0]] = e.message;
            toast.error(`${e.path} is ${e.message}`);
          });
          setErrors(newErrors); // Set errors for highlighting
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    }
  };

  const handleCategoryChange = (selected: any) => {
    setProduct({
      ...product,
      category: {
        name: selected.name,
        id: selected._id,
      },
    });

    console.log(selected)
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
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
              Products
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {productId === "new"
                ? "Create Product"
                : product?.title || "Product Details"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl font-bold my-4">
        {(createProductState && "Create Product") ||
          (isEditing && "Edit Product") ||
          "Product Details"}
      </h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <Input
            value={product?.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
            disabled={!isEditing && !createProductState}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">
              {errors.title} (e.g., "Product Name")
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <Input
            type="number"
            value={product?.price}
            onChange={(e) =>
              setProduct({ ...product, price: Number(e.target.value) })
            }
            disabled={!isEditing && !createProductState}
            className={errors.price ? "border-red-500" : ""}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">
              {errors.price} (e.g., "10.99")
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <Textarea
            value={product?.description}
            rows={4}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
            disabled={!isEditing && !createProductState}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">
              {errors.description} (e.g., "Description of the product")
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <Select
            onValueChange={(value) => {
              const selectedCategory = categories.find(
                (cat: any) => cat._id === value
              );
              if (selectedCategory) {
                handleCategoryChange(selectedCategory); // Pass the entire selected category object
              }
            }}
            disabled={!isEditing && !createProductState}
            value={product?.category?.id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category: any) => (
                <SelectItem key={category._id} value={category._id}>
                  {category?.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && (
            <p className="text-red-500 text-sm">
              {errors.category} (e.g., "Category 1")
            </p>
          )}
        </div>

        <div className="flex items-center">
          <Checkbox
            checked={product?.isAvailable}
            onCheckedChange={(checked) =>
              setProduct({ ...product, isAvailable: checked })
            }
            disabled={!isEditing && !createProductState}
          />
          <label className="ml-2">In stock</label>
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium">Images</label>
          {product?.image && <CustomCarousel images={product?.image} />}
          <div className="grid grid-cols-2 gap-2">
            {product && product.image && product.image.length > 0 ? (
              product.image.map((image: { path: string }, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={image.path || ""}
                    onChange={(e) => {
                      const updatedImages = [...product.image];
                      updatedImages[index] = { path: e.target.value };
                      setProduct({ ...product, image: updatedImages });
                    }}
                    disabled={!isEditing && !createProductState}
                    className={errors.image ? "border-red-500" : ""}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const updatedImages = product.image.filter(
                        (_: any, i: any) => i !== index
                      );
                      setProduct({ ...product, image: updatedImages });
                    }}
                    disabled={!isEditing && !createProductState}
                  >
                    Remove
                  </Button>
                </div>
              ))
            ) : (
              <div>No images available.</div>
            )}
            <Button
              variant="outline"
              onClick={() => {
                const updatedImages = product?.image ? [...product.image] : [];
                updatedImages.push({ path: "" });
                setProduct({ ...product, image: updatedImages });
              }}
              disabled={!isEditing && !createProductState}
            >
              Add Image
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-6">
        {isEditing ? (
          <>
            <Button onClick={handleSave} className="mr-2">
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button
            onClick={() =>
              productId === "new" ? handleSave() : setIsEditing(true)
            }
          >
            {productId === "new" ? "Create" : "Edit"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
