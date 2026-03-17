'use client'
import { Suspense, useEffect, useState } from "react"
import ProductCard from "@/components/ProductCard"
import Loading from "@/components/Loading"
import { MoveLeftIcon, Search, SlidersHorizontal, Sparkles } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

 function ShopContent() {

    // get query params ?search=abc
    const searchParams = useSearchParams()
    const search = searchParams.get('search') || ''
    const router = useRouter()
    const [isHydrated, setIsHydrated] = useState(false)
    const [searchInput, setSearchInput] = useState(search)
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [minRating, setMinRating] = useState('0')
    const [inStockOnly, setInStockOnly] = useState(false)
    const [sortBy, setSortBy] = useState('newest')
    const [showFilters, setShowFilters] = useState(false)
    const [selectedColor, setSelectedColor] = useState('All')
    const [selectedSize, setSelectedSize] = useState('All')
    const [selectedBrand, setSelectedBrand] = useState('All')

    const products = useSelector(state => state.product?.list || [])

    const categories = ['All', ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))]
    const colors = ['All', ...Array.from(new Set(products.flatMap((product) => product.colors || [])))]
    const sizes = ['All', ...Array.from(new Set(products.flatMap((product) => product.sizes || [])))]
    const brands = ['All', ...Array.from(new Set(products.map((product) => product?.store?.name).filter(Boolean)))]

    useEffect(() => {
        // Mark as hydrated after first render
        setIsHydrated(true)
        console.log('🛒 Shop page - Products from Redux:', products.length)
    }, [])

    useEffect(() => {
        setSearchInput(search)
    }, [search])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(searchInput.trim())
        }, 350)

        return () => clearTimeout(timeout)
    }, [searchInput])

    useEffect(() => {
        console.log('🛒 Shop page products updated:', products.length, products)
    }, [products])

    if (!isHydrated) {
        return <div className="min-h-[70vh] mx-6 flex items-center justify-center">Loading...</div>
    }

    const getAverageRating = (product) => {
        if (!product?.rating?.length) return 0
        const total = product.rating.reduce((acc, item) => acc + (item?.rating || 0), 0)
        return total / product.rating.length
    }

    const filteredProducts = products
        .filter((product) => {
            const keyword = debouncedSearch.toLowerCase()
            const name = product?.name?.toLowerCase() || ''
            const description = product?.description?.toLowerCase() || ''
            const matchesSearch = !keyword || name.includes(keyword) || description.includes(keyword)

            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory

            const numericMinPrice = minPrice === '' ? null : Number(minPrice)
            const numericMaxPrice = maxPrice === '' ? null : Number(maxPrice)
            const productPrice = Number(product.price || 0)
            const matchesPrice = (numericMinPrice === null || productPrice >= numericMinPrice) &&
                (numericMaxPrice === null || productPrice <= numericMaxPrice)

            const rating = getAverageRating(product)
            const matchesRating = rating >= Number(minRating)

            const matchesStock = !inStockOnly || Boolean(product.inStock)

            const productColors = product.colors || []
            const productSizes = product.sizes || []
            const matchesColor = selectedColor === 'All' || productColors.includes(selectedColor)
            const matchesSize = selectedSize === 'All' || productSizes.includes(selectedSize)
            const matchesBrand = selectedBrand === 'All' || product?.store?.name === selectedBrand

            return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock && matchesColor && matchesSize && matchesBrand
        })
        .sort((firstProduct, secondProduct) => {
            if (sortBy === 'price_low') return Number(firstProduct.price || 0) - Number(secondProduct.price || 0)
            if (sortBy === 'price_high') return Number(secondProduct.price || 0) - Number(firstProduct.price || 0)
            if (sortBy === 'best_rated') return getAverageRating(secondProduct) - getAverageRating(firstProduct)

            const firstDate = new Date(firstProduct.createdAt || 0).getTime()
            const secondDate = new Date(secondProduct.createdAt || 0).getTime()
            return secondDate - firstDate
        })

    const hasFiltersApplied = Boolean(
        debouncedSearch ||
        selectedCategory !== 'All' ||
        minPrice !== '' ||
        maxPrice !== '' ||
        Number(minRating) > 0 ||
        inStockOnly
        || selectedColor !== 'All'
        || selectedSize !== 'All'
        || selectedBrand !== 'All'
    )

    const searchSuggestions = searchInput.trim()
        ? products
            .filter((product) => product?.name?.toLowerCase().includes(searchInput.toLowerCase()))
            .slice(0, 6)
        : []

    const suggestionProducts = products
        .filter((product) => product.inStock)
        .sort((firstProduct, secondProduct) => getAverageRating(secondProduct) - getAverageRating(firstProduct))
        .slice(0, 4)

    const clearAllFilters = () => {
        setSearchInput('')
        setDebouncedSearch('')
        setSelectedCategory('All')
        setMinPrice('')
        setMaxPrice('')
        setMinRating('0')
        setInStockOnly(false)
        setSelectedColor('All')
        setSelectedSize('All')
        setSelectedBrand('All')
        setSortBy('newest')
    }

    return (
        <div className="min-h-[70vh] mx-6">
            <div className=" max-w-7xl mx-auto">
                <h1 onClick={() => {
                    window.dispatchEvent(new Event('app:navigation-start'))
                    router.push('/shop')
                }} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"> {search && <MoveLeftIcon size={20} />}  All <span className="text-slate-700 font-medium">Products</span></h1>

                <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                        <div className="flex-1 flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-lg">
                            <Search size={18} className="text-slate-500" />
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(event) => setSearchInput(event.target.value)}
                                    className="w-full bg-transparent outline-none text-sm"
                                    placeholder="Search by product name or description"
                                />
                                {searchSuggestions.length > 0 && (
                                    <div className="absolute left-0 right-0 top-8 z-20 rounded-lg border border-slate-200 bg-white shadow-sm max-h-56 overflow-y-auto">
                                        {searchSuggestions.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => {
                                                    setSearchInput(item.name)
                                                    setDebouncedSearch(item.name)
                                                }}
                                                className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                            >
                                                {item.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full lg:w-auto">
                            <button
                                onClick={() => setShowFilters((previous) => !previous)}
                                className="px-4 py-2.5 text-sm rounded-lg border border-slate-300 text-slate-700 flex items-center justify-center gap-2"
                            >
                                <SlidersHorizontal size={16} /> Filters
                            </button>

                            <select
                                value={sortBy}
                                onChange={(event) => setSortBy(event.target.value)}
                                className="px-3 py-2.5 text-sm rounded-lg border border-slate-300 outline-none w-full"
                            >
                                <option value="newest">Newest</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="best_rated">Best Rated</option>
                            </select>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-3 mt-4">
                            <select
                                value={selectedCategory}
                                onChange={(event) => setSelectedCategory(event.target.value)}
                                className="px-3 py-2.5 text-sm rounded-lg border border-slate-300 outline-none"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <select
                                value={selectedColor}
                                onChange={(event) => setSelectedColor(event.target.value)}
                                className="px-3 py-2.5 text-sm rounded-lg border border-slate-300 outline-none"
                            >
                                {colors.map((color) => (
                                    <option key={color} value={color}>{color === 'All' ? 'All Colors' : color}</option>
                                ))}
                            </select>

                            <select
                                value={selectedSize}
                                onChange={(event) => setSelectedSize(event.target.value)}
                                className="px-3 py-2.5 text-sm rounded-lg border border-slate-300 outline-none"
                            >
                                {sizes.map((size) => (
                                    <option key={size} value={size}>{size === 'All' ? 'All Sizes' : size}</option>
                                ))}
                            </select>

                            <select
                                value={selectedBrand}
                                onChange={(event) => setSelectedBrand(event.target.value)}
                                className="px-3 py-2.5 text-sm rounded-lg border border-slate-300 outline-none"
                            >
                                {brands.map((brand) => (
                                    <option key={brand} value={brand}>{brand === 'All' ? 'All Brands' : brand}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                min="0"
                                value={minPrice}
                                onChange={(event) => setMinPrice(event.target.value)}
                                placeholder="Min Price"
                                className="px-3 py-2.5 text-sm rounded-lg border border-slate-300 outline-none"
                            />

                            <input
                                type="number"
                                min="0"
                                value={maxPrice}
                                onChange={(event) => setMaxPrice(event.target.value)}
                                placeholder="Max Price"
                                className="px-3 py-2.5 text-sm rounded-lg border border-slate-300 outline-none"
                            />

                            <select
                                value={minRating}
                                onChange={(event) => setMinRating(event.target.value)}
                                className="px-3 py-2.5 text-sm rounded-lg border border-slate-300 outline-none"
                            >
                                <option value="0">Any Rating</option>
                                <option value="4">4★ and above</option>
                                <option value="3">3★ and above</option>
                                <option value="2">2★ and above</option>
                                <option value="1">1★ and above</option>
                            </select>

                            <label className="flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg border border-slate-300">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(event) => setInStockOnly(event.target.checked)}
                                    className="accent-green-600"
                                />
                                In Stock only
                            </label>
                        </div>
                    )}
                </div>

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-32">
                        {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                ) : (
                    <div className="mb-32 rounded-xl border border-slate-200 bg-slate-50 p-8">
                        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                            <Sparkles size={18} className="text-indigo-500" />
                            No products found
                        </h2>
                        <p className="text-slate-600 mt-2">
                            Try adjusting your filters or search terms.
                        </p>

                        {hasFiltersApplied && (
                            <button
                                onClick={clearAllFilters}
                                className="mt-4 px-4 py-2 text-sm rounded-lg bg-slate-800 text-white"
                            >
                                Clear all filters
                            </button>
                        )}

                        <div className="mt-7">
                            <h3 className="font-medium text-slate-700 mb-4">Suggested for you</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {suggestionProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}


export default function Shop() {
  return (
        <Suspense fallback={<Loading />}>
      <ShopContent />
    </Suspense>
  );
}