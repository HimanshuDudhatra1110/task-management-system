import { CheckCircle, Circle, Clock, Edit2, Trash2, User } from "lucide-react";

const TaskCard = ({ task, onEdit, onDelete }) => {
  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    todo: <Circle size={20} className="text-gray-400" />,
    "in-progress": <Clock size={20} className="text-blue-500" />,
    completed: <CheckCircle size={20} className="text-green-500" />,
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {statusIcons[task.status]}
            <h3 className="font-semibold text-gray-800 text-lg">
              {task.title}
            </h3>
          </div>
          <span className="ml-7 mt-1 text-xs font-medium text-gray-500 capitalize">
            {task.status.replace("-", " ")}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(task)}
            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority}
        </span>
        {task.tags &&
          task.tags.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
            >
              {tag}
            </span>
          ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Clock size={14} /> {formatDate(task.dueDate)}
          </span>
        )}
        {(task.assignedTo?.name || task.assignedToEmail) && (
          <span className="flex items-center gap-1">
            <User size={14} /> {task.assignedTo?.name || task.assignedToEmail}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
