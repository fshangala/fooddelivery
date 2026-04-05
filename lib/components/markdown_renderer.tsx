'use client';

import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-slate prose-lg max-w-none 
                prose-headings:text-gray-900 prose-headings:font-bold 
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-strong:text-gray-900 prose-strong:font-bold
                prose-ul:list-disc prose-ol:list-decimal
                prose-li:text-gray-600
                prose-a:text-primary-600 prose-a:font-semibold hover:prose-a:text-primary-700
                prose-hr:border-gray-100
            "
        >
            <ReactMarkdown>{content}</ReactMarkdown>
        </motion.div>
    );
}
