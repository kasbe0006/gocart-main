'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import SimilarProducts from "@/components/SimilarProducts";
import { addRecentProduct } from "@/lib/features/recent/recentSlice";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState();
    const [isHydrated, setIsHydrated] = useState(false);
    const dispatch = useDispatch()
    const products = useSelector(state => state.product?.list || []);

    const fetchProduct = async () => {
        const product = products.find((product) => product.id === productId);
        setProduct(product);
    }

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    useEffect(() => {
        if (products.length > 0 && isHydrated) {
            fetchProduct()
        }
        scrollTo(0, 0)
    }, [productId, products, isHydrated]);

    useEffect(() => {
        if (product?.id) {
            dispatch(addRecentProduct(product.id))
        }
    }, [product?.id, dispatch])

    if (!isHydrated) {
        return <div className="mx-6 min-h-screen flex items-center justify-center">Loading...</div>
    }

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">

                {/* Breadcrums */}
                <div className="  text-gray-600 text-sm mt-8 mb-5">
                    Home / Products / {product?.category}
                </div>

                {/* Product Details */}
                {product && (<ProductDetails product={product} />)}

                {/* Description & Reviews */}
                {product && (<ProductDescription product={product} />)}

                {/* Similar Products */}
                {product && (<SimilarProducts currentProduct={product} />)}
            </div>
        </div>
    );
}