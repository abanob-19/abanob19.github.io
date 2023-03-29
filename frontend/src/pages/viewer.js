import { useState } from 'react';
import { Document, Page } from 'react-pdf';

function PdfViewer({ binaryData }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div>
      <Document file={binaryData} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <button disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>
        Previous
      </button>
      <button disabled={pageNumber >= numPages} onClick={() => setPageNumber(pageNumber + 1)}>
        Next
      </button>
    </div>
  );
}
export default PdfViewer;