'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addProduct } from "@/lib/features/product/productSlice"

export default function StoreAddProduct() {

    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Health', 'Toys & Games', 'Sports & Outdoors', 'Books & Media', 'Food & Drink', 'Hobbies & Crafts', 'Others']
    const dispatch = useDispatch()

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})


    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
        setErrors((previous) => ({ ...previous, [e.target.name]: '' }))
    }

    const validateForm = () => {
        const nextErrors = {}

        if (!productInfo.name.trim()) nextErrors.name = 'Product name is required'
        if (!productInfo.description.trim()) nextErrors.description = 'Product description is required'
        if (!productInfo.category) nextErrors.category = 'Category is required'
        if (!productInfo.price || Number(productInfo.price) <= 0) nextErrors.price = 'Enter a valid offer price'
        if (!productInfo.mrp || Number(productInfo.mrp) <= 0) nextErrors.mrp = 'Enter a valid actual price'
        if (Number(productInfo.price) > Number(productInfo.mrp)) nextErrors.price = 'Offer price cannot be greater than actual price'

        setErrors(nextErrors)
        return Object.keys(nextErrors).length === 0
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            toast.error('Please fix the highlighted fields')
            return
        }

        setLoading(true)
        
        try {
            // Convert images to base64
            const imagePromises = Object.values(images)
                .filter(img => img !== null)
                .map(img => {
                    return new Promise((resolve) => {
                        const reader = new FileReader()
                        reader.onloadend = () => resolve(reader.result)
                        reader.readAsDataURL(img)
                    })
                })

            const convertedImages = await Promise.all(imagePromises)

            const newProduct = {
                id: `product_${Date.now()}`,
                name: productInfo.name,
                description: productInfo.description,
                category: productInfo.category,
                price: Number(productInfo.price),
                mrp: Number(productInfo.mrp),
                images: convertedImages,
                rating: [],
                storeName: "Store Name", // You can get this from user profile
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }

            console.log('Adding product:', newProduct)
            dispatch(addProduct(newProduct))
            
            toast.success('Product added successfully')
            
            // Reset form
            setProductInfo({
                name: "",
                description: "",
                mrp: 0,
                price: 0,
                category: "",
            })
            setImages({ 1: null, 2: null, 3: null, 4: null })
        } catch (error) {
            console.error('Error adding product:', error)
            toast.error('Failed to add product. Please try again.')
        } finally {
            setLoading(false)
        }
    }


    return (
        <form onSubmit={onSubmitHandler} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-7">Product Images</p>

            <div htmlFor="" className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image width={300} height={300} className='h-15 w-auto border border-slate-200 rounded cursor-pointer' src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} alt="" />
                        <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                    </label>
                ))}
            </div>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className={`w-full max-w-sm p-2 px-4 outline-none border rounded ${errors.name ? 'border-red-400' : 'border-slate-200'}`} required />
                {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
            </label>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className={`w-full max-w-sm p-2 px-4 outline-none border rounded resize-none ${errors.description ? 'border-red-400' : 'border-slate-200'}`} required />
                {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
            </label>

            <div className="flex gap-5">
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Actual Price ($)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" rows={5} className={`w-full max-w-45 p-2 px-4 outline-none border rounded resize-none ${errors.mrp ? 'border-red-400' : 'border-slate-200'}`} required />
                    {errors.mrp && <span className="text-xs text-red-500">{errors.mrp}</span>}
                </label>
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Offer Price ($)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" rows={5} className={`w-full max-w-45 p-2 px-4 outline-none border rounded resize-none ${errors.price ? 'border-red-400' : 'border-slate-200'}`} required />
                    {errors.price && <span className="text-xs text-red-500">{errors.price}</span>}
                </label>
            </div>

            <select onChange={e => {
                setProductInfo({ ...productInfo, category: e.target.value })
                setErrors((previous) => ({ ...previous, category: '' }))
            }} value={productInfo.category} className={`w-full max-w-sm p-2 px-4 my-6 outline-none border rounded ${errors.category ? 'border-red-400' : 'border-slate-200'}`} required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>
            {errors.category && <p className="-mt-4 mb-2 text-xs text-red-500">{errors.category}</p>}

            <br />

            <button disabled={loading} className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Adding...' : 'Add Product'}
            </button>
        </form>
    )
}