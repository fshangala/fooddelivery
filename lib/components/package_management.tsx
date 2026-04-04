'use client';

import { useState } from 'react';
import { Package } from '@/lib/definitions/packages';
import PackageForm from '@/lib/components/package_form';
import { deletePackage } from '@/lib/actions/packages';

interface PackageManagementProps {
    initialPackages: Package[];
}

export default function PackageManagement({ initialPackages }: PackageManagementProps) {
    const [editingPackage, setEditingPackage] = useState<Package | null>(null);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this package?')) {
            try {
                await deletePackage(id);
            } catch {
                alert('Failed to delete package.');
            }
        }
    };

    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="order-2 md:order-1">
                <h2 className="text-2xl font-bold mb-4">{editingPackage ? 'Edit Package' : 'Create New Package'}</h2>
                <PackageForm 
                    pkg={editingPackage} 
                    onCancel={() => setEditingPackage(null)} 
                />
            </div>

            <div className="order-1 md:order-2">
                <h2 className="text-2xl font-bold mb-4">Existing Packages</h2>
                <div className="space-y-4">
                    {initialPackages.length === 0 ? (
                        <p className="text-gray-500 bg-white p-6 rounded-lg border border-dashed border-gray-300 text-center">
                            No packages created yet.
                        </p>
                    ) : (
                        initialPackages.map((pkg) => (
                            <div key={pkg.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                                            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {pkg.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-primary-600">
                                            ZMW {Number(pkg.price).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setEditingPackage(pkg)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                            title="Edit Package"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(pkg.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete Package"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Includes:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {pkg.vegetables.map(v => (
                                            <span key={v} className="inline-block px-2 py-1 rounded text-xs bg-gray-50 text-gray-600 border border-gray-100">
                                                {v}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
