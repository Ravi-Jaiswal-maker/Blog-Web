import React from "react";
import { CheckCircle } from "lucide-react";

const SuccessBanner = ({ message }) => (
  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-3 rounded-lg shadow text-sm mt-4">
    <CheckCircle className="w-5 h-5" />
    <span>{message}</span>
  </div>
);

export default SuccessBanner;
