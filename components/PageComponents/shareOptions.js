// components/PageComponents/shareOptions.jsx
"use client";

import React, { useState } from "react";
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  LinkedinShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
  LinkedinIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";
import { X, Link2 } from "lucide-react";

const ShareOptions = ({ url, title, onClose }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        className="bg-white/90 backdrop-blur-lg rounded-xl p-6 max-w-md w-full relative border border-gray-200/50 shadow-lg"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Share this listing
        </h3>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <WhatsappShareButton url={url} title={title}>
            <div className="flex flex-col items-center">
              <WhatsappIcon size={40} round />
              <span className="text-xs mt-1 text-gray-700">WhatsApp</span>
            </div>
          </WhatsappShareButton>

          <FacebookShareButton url={url} quote={title}>
            <div className="flex flex-col items-center">
              <FacebookIcon size={40} round />
              <span className="text-xs mt-1 text-gray-700">Facebook</span>
            </div>
          </FacebookShareButton>

          <TwitterShareButton url={url} title={title}>
            <div className="flex flex-col items-center">
              <TwitterIcon size={40} round />
              <span className="text-xs mt-1 text-gray-700">Twitter</span>
            </div>
          </TwitterShareButton>

          <EmailShareButton url={url} subject={title}>
            <div className="flex flex-col items-center">
              <EmailIcon size={40} round />
              <span className="text-xs mt-1 text-gray-700">Email</span>
            </div>
          </EmailShareButton>

          <LinkedinShareButton url={url} title={title}>
            <div className="flex flex-col items-center">
              <LinkedinIcon size={40} round />
              <span className="text-xs mt-1 text-gray-700">LinkedIn</span>
            </div>
          </LinkedinShareButton>

          <TelegramShareButton url={url} title={title}>
            <div className="flex flex-col items-center">
              <TelegramIcon size={40} round />
              <span className="text-xs mt-1 text-gray-700">Telegram</span>
            </div>
          </TelegramShareButton>
        </div>

        <div className="flex items-center border border-gray-300/50 rounded-lg overflow-hidden bg-white/50">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 px-3 py-2 text-sm border-none outline-none bg-transparent text-gray-700"
          />
          <button
            onClick={copyToClipboard}
            className="px-3 py-2 text-sm flex items-center bg-gray-100/70 hover:bg-gray-100 transition-colors text-gray-700"
          >
            <Link2 size={16} className="mr-1" />
            {copySuccess ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareOptions;
