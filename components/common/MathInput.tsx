
import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    className?: string;
    rows?: number;
}

const MATH_BUTTONS = [
    { label: 'x²', latex: '^2', tooltip: '제곱' },
    { label: '√', latex: '\\sqrt{}', tooltip: '루트' },
    { label: '분수', latex: '\\frac{}{}', tooltip: '분수' },
    { label: '×', latex: '\\times', tooltip: '곱하기' },
    { label: '÷', latex: '\\div', tooltip: '나누기' },
    { label: '±', latex: '\\pm', tooltip: '플러스마이너스' },
    { label: '≤', latex: '\\le', tooltip: '작거나 같다' },
    { label: '≥', latex: '\\ge', tooltip: '크거나 같다' },
    { label: '≠', latex: '\\ne', tooltip: '같지 않다' },
    { label: 'π', latex: '\\pi', tooltip: '파이' },
    { label: '°', latex: '^\\circ', tooltip: '도' },
    { label: '△', latex: '\\triangle', tooltip: '삼각형' },
    { label: '∠', latex: '\\angle', tooltip: '각' },
];

export const MathInput: React.FC<MathInputProps> = ({ value, onChange, placeholder, disabled, onKeyDown, className = '', rows = 3 }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertLatex = (latex: string) => {
        if (!textareaRef.current) return;

        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = value;
        
        // Wrap with $ for display
        const prefix = '$';
        const suffix = '$';
        const insertion = `${prefix}${latex}${suffix}`;
        
        const newValue = text.substring(0, start) + insertion + text.substring(end);
        
        onChange(newValue);
        
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                
                // If latex contains {}, put cursor inside first {}
                // 'latex' starts at 'start + prefix.length'.
                const firstBraceIndex = latex.indexOf('{}');
                let newCursorPos;
                if (firstBraceIndex !== -1) {
                    // +1 to be inside {}
                    newCursorPos = start + prefix.length + firstBraceIndex + 1;
                } else {
                    // At end of insertion
                    newCursorPos = start + insertion.length;
                }
                
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    return (
        <div className={`w-full ${className}`}>
             <div className="flex flex-wrap gap-1 mb-2 p-1 bg-slate-100 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                {MATH_BUTTONS.map((btn) => (
                    <button
                        key={btn.label}
                        type="button"
                        onClick={() => insertLatex(btn.latex)}
                        disabled={disabled}
                        className="px-2 py-1 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 min-w-[32px] font-medium transition-colors"
                        title={btn.tooltip}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
                className="w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-neon-blue focus:border-neon-blue text-base leading-snug placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-y"
            />
            {value && (
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">수식 미리보기 (Preview)</p>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-snug break-words">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[[rehypeKatex, { output: 'html' }]]}
                        >
                            {value}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
};
