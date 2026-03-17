'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import RecentlyViewed from "@/components/RecentlyViewed";
import TrendingItems from "@/components/TrendingItems";
import RecommendedProducts from "@/components/RecommendedProducts";

export default function Home() {
    return (
        <div>
            <Hero />
            <LatestProducts />
            <TrendingItems />
            <RecentlyViewed />
            <RecommendedProducts />
            <BestSelling />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
