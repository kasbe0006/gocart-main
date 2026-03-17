import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "Velmora - Shop smarter",
    description: "Velmora - Shop smarter",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${outfit.className} antialiased`}>
                <StoreProvider>
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            duration: 2600,
                            style: {
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                color: '#0f172a',
                                background: '#ffffff',
                            },
                        }}
                    />
                    <PageTransition>
                        {children}
                    </PageTransition>
                </StoreProvider>
            </body>
        </html>
    );
}
