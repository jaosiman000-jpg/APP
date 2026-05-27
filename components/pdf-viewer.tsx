'use client';

import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  onPageChange?: (current: number, total: number) => void;
}

export function PdfViewer({ url, onPageChange }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    onPageChange?.(1, numPages);
  }, [onPageChange]);

  const goToPrevPage = () => {
    if (pageNumber <= 1) return;
    const next = pageNumber - 1;
    setPageNumber(next);
    onPageChange?.(next, numPages);
  };

  const goToNextPage = () => {
    if (pageNumber >= numPages) return;
    const next = pageNumber + 1;
    setPageNumber(next);
    onPageChange?.(next, numPages);
  };

  return (
    <div className="flex flex-col items-center w-full bg-[#0d0709] min-h-full">
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-brand-gold border-t-transparent animate-spin" />
          <p className="text-brand-dim text-sm">Cargando PDF...</p>
        </div>
      )}

      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={null}
        className="flex justify-center w-full"
      >
        <Page
          pageNumber={pageNumber}
          width={Math.min(typeof window !== 'undefined' ? window.innerWidth : 390, 600)}
          loading={null}
          className="shadow-lg"
          renderAnnotationLayer={false}
          renderTextLayer={true}
        />
      </Document>

      {/* Pagination Footer */}
      {!loading && numPages > 0 && (
        <div className="sticky bottom-0 w-full bg-brand-bg/95 backdrop-blur-sm border-t border-brand-border px-5 py-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="w-9 h-9 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center text-brand-cream disabled:opacity-30 transition-all active:scale-[0.9]"
            >
              ‹
            </button>
            <span className="text-brand-muted text-sm">
              Página <span className="text-brand-cream font-medium">{pageNumber}</span> de <span className="text-brand-cream font-medium">{numPages}</span>
            </span>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
              className="w-9 h-9 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center text-brand-cream disabled:opacity-30 transition-all active:scale-[0.9]"
            >
              ›
            </button>
          </div>
          <div className="h-1 bg-brand-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-gold to-brand-goldDark rounded-full transition-all duration-300"
              style={{ width: `${(pageNumber / numPages) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
