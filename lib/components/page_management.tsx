'use client';

import { useState } from 'react';
import { StaticPage } from '@/lib/definitions/pages';
import PageForm from '@/lib/components/page_form';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';

interface PageManagementProps {
    pages: StaticPage[];
}

export default function PageManagement({ pages }: PageManagementProps) {
    const [selectedSlug, setSelectedSlug] = useState(pages[0]?.slug);
    const selectedPage = pages.find(p => p.slug === selectedSlug);

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-160px)]">
            {/* Sidebar / Page List */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-900 px-2">Static Pages</h2>
                <div className="space-y-2">
                    {pages.map((page) => {
                        const isSelected = selectedSlug === page.slug;
                        return (
                            <button
                                key={page.slug}
                                onClick={() => setSelectedSlug(page.slug)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group
                                    ${isSelected 
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                                        : 'bg-white border border-gray-100 text-gray-600 hover:border-primary-300 hover:bg-primary-50'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-primary-500/20' : 'bg-gray-50 group-hover:bg-white'}`}>
                                        <FileText size={20} />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold truncate max-w-[120px]">{page.title}</div>
                                        <div className={`text-xs ${isSelected ? 'text-primary-100' : 'text-gray-400'} font-mono mt-0.5`}>{page.slug}</div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className={`${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} />
                            </button>
                        );
                    })}
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <p className="text-xs text-yellow-800 leading-relaxed">
                        <strong>Pro Tip:</strong> All changes made here will be reflected immediately on the public website after saving.
                    </p>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                    {selectedPage ? (
                        <PageForm key={selectedSlug} page={selectedPage} />
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-2xl border border-gray-100 border-dashed p-20 text-center"
                        >
                            <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-400">Select a page to start editing</h3>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
