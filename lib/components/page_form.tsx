'use client';

import { useState, useActionState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import { StaticPage } from '@/lib/definitions/pages';
import { updatePage } from '@/lib/actions/pages';
import { motion } from 'framer-motion';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PageFormProps {
    page: StaticPage;
}

export default function PageForm({ page }: PageFormProps) {
    const [content, setContent] = useState(page.content);
    const updatePageWithSlug = updatePage.bind(null, page.slug);
    const [state, action] = useActionState(updatePageWithSlug, {});

    return (
        <motion.div
            key={page.slug}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
            <form action={action} className="flex flex-col h-[calc(100vh-200px)]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <input
                            type="text"
                            name="title"
                            defaultValue={page.title}
                            className="text-2xl font-bold bg-transparent border-none focus:ring-0 text-gray-900 p-0 w-full"
                            placeholder="Page Title"
                        />
                        <p className="text-sm text-gray-500 mt-1">Slug: <span className="font-mono text-primary-600">{page.slug}</span></p>
                    </div>
                    
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-primary-200 active:scale-95"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>

                {/* Status Messages */}
                {state.message && (
                    <div className={`px-6 py-3 flex items-center gap-2 text-sm ${state.errors ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {state.errors ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                        {state.message}
                    </div>
                )}

                {/* Editor Area */}
                <div className="flex-1 overflow-hidden relative">
                    <input type="hidden" name="content" value={content} />
                    <MdEditor
                        modelValue={content}
                        onChange={setContent}
                        language="en-US"
                        theme="light"
                        className="h-full !border-none"
                        toolbars={[
                            'bold',
                            'underline',
                            'italic',
                            '-',
                            'title',
                            'strikeThrough',
                            'sub',
                            'sup',
                            'quote',
                            'unorderedList',
                            'orderedList',
                            'task',
                            '-',
                            'codeRow',
                            'code',
                            'link',
                            'image',
                            'table',
                            'mermaid',
                            'katex',
                            '-',
                            'revoke',
                            'next',
                            'save',
                            '=',
                            'pageFullscreen',
                            'fullscreen',
                            'preview',
                            'htmlPreview',
                            'catalog',
                            'github'
                        ]}
                    />
                </div>
            </form>
        </motion.div>
    );
}
