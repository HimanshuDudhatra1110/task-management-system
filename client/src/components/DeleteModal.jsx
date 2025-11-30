import React from "react";
import { AlertCircle } from "lucide-react";

const DeleteModal = ({ task, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertCircle className="text-red-600" size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Delete Task</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete "
          <span className="font-semibold">{task.title}</span>"? This action
          cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-medium"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
