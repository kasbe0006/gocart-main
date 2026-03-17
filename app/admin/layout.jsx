import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Velmora - Admin",
    description: "Velmora - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
