'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { ClusterService } from '@/lib/services/cluster_service';
import { useAuth, useProfile } from '@/lib/components/auth_provider';
import { Cluster } from '@/lib/definitions';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type AvailableCluster = Cluster & {
    pendingOrdersCount: number;
    representativeAddress?: string;
    isPreferred?: boolean;
    distanceFromHome?: number;
};

export default function AvailableOrdersPage() {
    const session = useAuth();
    const profile = useProfile();
    const router = useRouter();
    const supabase = useMemo(() => createClient(), []);
    const [availableClusters, setAvailableClusters] = useState<AvailableCluster[]>([]);
    const [loading, setLoading] = useState(true);

    const userId = session?.user?.id;
    const role = profile?.role;

    useEffect(() => {
        if (session && profile && role !== 'driver') {
            router.replace('/');
        }
    }, [session, profile, role, router]);

    const fetchData = useCallback(async () => {
        if (!userId || role !== 'driver') return;
        const clusters = await ClusterService.getAvailableClusters(supabase, profile);
        setAvailableClusters(clusters);
        setLoading(false);
    }, [userId, role, supabase, profile]);

    useEffect(() => {
        if (userId && role === 'driver' && profile) {
            Promise.resolve().then(() => fetchData());
        }
    }, [fetchData, userId, role, profile]);

    const handleAcceptCluster = async (clusterId: string) => {
        if (!session?.user?.id) return;
        setLoading(true);
        const success = await ClusterService.assignDriverToCluster(supabase, clusterId, session.user.id);
        if (success) {
            fetchData();
        } else {
            alert('Failed to accept cluster. It might have been taken by another driver.');
            fetchData();
        }
    };

    const handleNavigate = (lat: number, lon: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
        window.open(url, '_blank');
    };

    if (!session) {
        if (!loading) return <div className="p-8 text-center">Please log in to view available clusters.</div>;
        return null;
    }

    if (role !== 'driver') return null;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4 py-12">
            <div className="max-w-4xl w-full">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Available Clusters</h1>
                    <p className="text-gray-600">Accept a cluster and deliver every order inside it.</p>
                </header>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div>
                        {availableClusters.length === 0 ? (
                            <div className="bg-white p-8 rounded-lg shadow-sm text-center text-gray-500 border border-gray-200">
                                <p>No new clusters available right now. Check back later!</p>
                            </div>
                        ) : (
                            availableClusters.map(cluster => (
                                <div key={cluster.id} className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition mb-4 border-2 ${cluster.isPreferred ? 'border-primary-500 bg-primary-50/10' : 'border-gray-100'}`}>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-gray-500">Delivery Date: {cluster.delivery_date ? new Date(cluster.delivery_date).toLocaleDateString() : 'N/A'}</span>
                                            {cluster.isPreferred && (
                                                <span className="px-2 py-0.5 bg-primary-600 text-white text-[10px] font-bold rounded uppercase tracking-wider">Preferred</span>
                                            )}
                                        </div>
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">{cluster.pendingOrdersCount} orders</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{cluster.representativeAddress ?? 'Cluster delivery area'}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                        <p>Centroid: {cluster.centroid_lat.toFixed(5)}, {cluster.centroid_lon.toFixed(5)}</p>
                                        {cluster.distanceFromHome !== undefined && (
                                            <p className="flex items-center gap-1 font-medium text-primary-700">
                                                <span>🏠</span>
                                                {cluster.distanceFromHome.toFixed(1)} km away
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <button onClick={() => handleAcceptCluster(cluster.id)} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-medium transition">Accept Cluster</button>
                                        <button onClick={() => handleNavigate(cluster.centroid_lat, cluster.centroid_lon)} className="flex-1 border border-primary-600 text-primary-600 py-3 rounded-lg font-medium transition hover:bg-primary-50">Navigate to Cluster</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

