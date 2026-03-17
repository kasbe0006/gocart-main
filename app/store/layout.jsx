import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Velmora - Store Dashboard",
    description: "Velmora - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
