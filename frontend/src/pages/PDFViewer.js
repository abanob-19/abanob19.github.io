import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PDFViewer({ attachment }) {
  const courseName = attachment.courseName;
  const qb_id = attachment.qb_id;
  const q_id = attachment.q_id;
  const [pdfData, setPdfData] = useState(null);
  const [base64STR, setBase64STR] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`/instructor/viewPdf/${courseName}&${qb_id}&${q_id}`, {
          responseType: 'arraybuffer',
        });
        const base64 = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );
        setBase64STR(base64);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [courseName, qb_id, q_id]);

  return (
    <div>
      {base64STR && <embed src={`data:application/pdf;base64,${base64STR}`} />}
    </div>
  );
}

export default PDFViewer;
