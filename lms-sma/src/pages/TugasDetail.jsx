import React, { useState } from "react";

const TugasDetail = () => {
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleUploadSuccess = () => {
    setShowSuccessPopup(true);
  };

  return (
    <div>
      {/* ...existing code for TugasDetail... */}

      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <div className="mb-4 text-green-600 font-semibold">
              Tugas berhasil dikumpulkan!
            </div>
            {/* ...jika ada info lain tampilkan di sini... */}
            <button
              className="mt-4 px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
              onClick={() => setShowSuccessPopup(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TugasDetail;