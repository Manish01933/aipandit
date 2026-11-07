import React from 'react';

interface MarkdownChatRendererProps {
  content: string;
  className?: string;
}

// Helper to parse inline formatting (bold, italic, code, links)
export function parseInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match: **bold**, *italic*, `code`, [link](url)
  const regex = /(\*\*.*?\*\*|__.*?__|`.*?`|\*.*?\*|_.*?_|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text** or __text__
    if ((part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
        (part.startsWith('__') && part.endsWith('__') && part.length >= 4)) {
      const inner = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-amber-300">
          {parseInlineMarkdown(inner)}
        </strong>
      );
    }

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <code
          key={index}
          className="bg-slate-950/80 text-emerald-300 px-1.5 py-0.5 rounded text-[11px] font-mono border border-emerald-500/20"
        >
          {inner}
        </code>
      );
    }

    // Italic: *text* or _text_
    if ((part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
        (part.startsWith('_') && part.endsWith('_') && part.length >= 2)) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} className="italic text-slate-300">
          {parseInlineMarkdown(inner)}
        </em>
      );
    }

    // Links: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, linkText, linkUrl] = linkMatch;
      return (
        <a
          key={index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
        >
          {linkText}
        </a>
      );
    }

    // Plain text segment
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Strips raw markdown symbols for clean Text-To-Speech audio
 */
export function stripMarkdownForSpeech(text: string): string {
  if (!text) return '';
  return text
    .replace(/^#+\s+/gm, '') // remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
    .replace(/\*(.*?)\*/g, '$1') // remove italic
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    .replace(/`{1,3}.*?`{1,3}/g, '') // remove code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // remove links
    .replace(/^>\s+/gm, '') // remove blockquotes
    .replace(/[-*•]\s+/gm, '') // remove bullet points
    .replace(/\|.*?\|/g, '') // remove tables
    .replace(/-{3,}/g, '') // remove separators
    .replace(/[*#_~`|]/g, '') // remove any stray symbols
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Robust Markdown Chat Renderer for AI Astrologer responses
 * Safely renders headings, bold, tables, lists, blockquotes, separators without raw symbols.
 */
export const MarkdownChatRenderer: React.FC<MarkdownChatRendererProps> = ({
  content,
  className = '',
}) => {
  if (!content || !content.trim()) {
    return null;
  }

  // Split content into lines for block parsing
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  let keyIndex = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // 1. Skip completely empty lines, but allow spacing
    if (!trimmed) {
      i++;
      continue;
    }

    // 2. Horizontal Rule: --- or *** or ___
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      elements.push(
        <hr key={`hr-${keyIndex++}`} className="border-t border-slate-700/60 my-3.5" />
      );
      i++;
      continue;
    }

    // 3. Headings: #, ##, ###, ####
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2];

      if (level === 1 || level === 2) {
        elements.push(
          <div
            key={`h2-${keyIndex++}`}
            className="text-sm sm:text-base font-bold text-amber-300 mt-3.5 mb-1.5 flex items-center gap-2 border-b border-amber-500/20 pb-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>{parseInlineMarkdown(headingText)}</span>
          </div>
        );
      } else {
        elements.push(
          <div
            key={`h3-${keyIndex++}`}
            className="text-xs sm:text-sm font-bold text-emerald-300 mt-2.5 mb-1 flex items-center gap-1.5"
          >
            <span>{parseInlineMarkdown(headingText)}</span>
          </div>
        );
      }
      i++;
      continue;
    }

    // 4. Blockquotes: > text
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }
      elements.push(
        <div
          key={`quote-${keyIndex++}`}
          className="border-l-2 border-amber-500/70 bg-amber-950/20 px-3 py-2 rounded-r-xl my-2 text-xs text-amber-200/90 italic"
        >
          {quoteLines.map((ql, qidx) => (
            <p key={qidx}>{parseInlineMarkdown(ql)}</p>
          ))}
        </div>
      );
      continue;
    }

    // 5. Tables: lines starting and containing |
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|')) {
      const tableRows: string[][] = [];
      let isHeader = true;

      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        const lineContent = lines[i].trim();
        // Check if this is the separator row: |---|---|
        if (/^\|[\s-:]+(\|[\s-:]+)+\|$/.test(lineContent)) {
          isHeader = false;
          i++;
          continue;
        }

        const cells = lineContent
          .slice(1, -1)
          .split('|')
          .map((c) => c.trim());
        tableRows.push(cells);
        i++;
      }

      if (tableRows.length > 0) {
        const headerRow = tableRows[0];
        const bodyRows = tableRows.slice(1);

        elements.push(
          <div key={`table-${keyIndex++}`} className="overflow-x-auto my-3 rounded-xl border border-slate-800 shadow-inner">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/90 text-amber-300 border-b border-slate-800">
                  {headerRow.map((h, hIdx) => (
                    <th key={hIdx} className="px-3 py-2 font-bold whitespace-nowrap">
                      {parseInlineMarkdown(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {bodyRows.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-950/40'}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-slate-300">
                        {parseInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // 6. Bullet Lists: • or - or *
    if (/^([•*-]|\d+[.)]|[\u0966-\u096F]+[.)])\s+/.test(trimmed)) {
      const listItems: { prefix: string; text: string }[] = [];

      while (
        i < lines.length &&
        /^([•*-]|\d+[.)]|[\u0966-\u096F]+[.)])\s+/.test(lines[i].trim())
      ) {
        const itemLine = lines[i].trim();
        const match = itemLine.match(/^([•*-]|\d+[.)]|[\u0966-\u096F]+[.)])\s+(.*)$/);
        if (match) {
          listItems.push({ prefix: match[1], text: match[2] });
        }
        i++;
      }

      elements.push(
        <ul key={`list-${keyIndex++}`} className="space-y-1.5 my-2 pl-1">
          {listItems.map((item, lIdx) => (
            <li key={lIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
              <span className="text-amber-400 font-bold shrink-0 mt-0.5">
                {/^\d|[•*-]/.test(item.prefix) ? '•' : item.prefix}
              </span>
              <span className="flex-1 leading-relaxed">{parseInlineMarkdown(item.text)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // 7. Regular Paragraph
    // Collect contiguous lines that belong to this paragraph
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().match(/^(#{1,4}\s+|>{1,2}\s+|(-{3,}|\*{3,}|_{3,})$|\|.*\||([•*-]|\d+[.)])\s+)/)
    ) {
      paragraphLines.push(lines[i].trim());
      i++;
    }

    if (paragraphLines.length > 0) {
      const paragraphText = paragraphLines.join(' ');
      // Check if this paragraph starts with a highlighted section heading like "**सीधा जवाब:**"
      elements.push(
        <p key={`p-${keyIndex++}`} className="text-xs sm:text-sm text-slate-200 leading-relaxed my-1.5">
          {parseInlineMarkdown(paragraphText)}
        </p>
      );
    }
  }

  return <div className={`space-y-1 font-devanagari ${className}`}>{elements}</div>;
};
