import { Head } from '@inertiajs/react';
import CatalogIndex from '@/components/khaslana/catalog/catalog-index';
import UserLayout from '@/layouts/user-layout'; 

export default function Catalog() {
    return (
        <UserLayout>
            <Head title="Katalog" />
            
            <CatalogIndex />
        </UserLayout>
    );
}