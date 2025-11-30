import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CheckCircle,
  Clock,
  Menu,
  Plus,
  Search,
  Filter,
  LogOut,
  Loader,
} from "lucide-react";
import {
  getTasks,
  getTaskById,
  getTaskStats,
  createTask,
  updateTask,
  deleteTask,
} from "../redux/thunks/taskThunk";
import { logout } from "../redux/thunks/authThunk";
import { resetTaskState, setFilters } from "../redux/slices/taskSlice";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import DeleteModal from "../components/DeleteModal";

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { tasks, stats, pagination, filters, isLoading, isError, message } =
    useSelector((state) => state.tasks);

  const [searchText, setSearchText] = useState(filters.search);

  useEffect(() => {
    dispatch(getTasks(filters));
  }, [filters, dispatch]);

  useEffect(() => {
    dispatch(getTaskStats());
  }, [dispatch]);

  useEffect(() => {
    setSearchText(filters.search);
  }, [filters.search]);

  useEffect(() => {
    if (isError) toast.error(message);
  }, [isError, message]);

  const onLogout = () => {
    dispatch(logout());
    dispatch(resetTaskState());
    navigate("/login");
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await dispatch(
          updateTask({ id: editingTask._id, updates: taskData })
        ).unwrap();
        toast.success("Task updated successfully!");
      } else {
        await dispatch(createTask(taskData)).unwrap();
        toast.success("Task created successfully!");
      }
      setShowModal(false);
      setEditingTask(null);
      dispatch(getTasks(filters));
      dispatch(getTaskStats());
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  const handleDeleteTask = async () => {
    try {
      await dispatch(deleteTask(deletingTask._id)).unwrap();
      toast.success("Task deleted successfully!");
      setShowDeleteModal(false);
      setDeletingTask(null);
      dispatch(getTasks(filters));
      dispatch(getTaskStats());
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
    }
  };

  const handleFilterChange = (filterData) => {
    dispatch(setFilters(filterData));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setFilters({ search: searchText }));
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchText, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stats?.total || 0}
                </p>
              </div>
              <Menu className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stats?.completed || 0}
                </p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stats?.pending || 0}
                </p>
              </div>
              <Clock className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-10 pr-4 py-2 h-10 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 h-10 bg-gray-100 text-gray-700 
               rounded-lg hover:bg-gray-200 transition"
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>

            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                className="appearance-none h-10 pl-4 pr-10 border border-gray-300 
                 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Sort: Default</option>
                <option value="title:asc">Title (A → Z)</option>
                <option value="title:desc">Title (Z → A)</option>
                <option value="createdAt:asc">Oldest First</option>
                <option value="createdAt:desc">Newest First</option>
                <option value="status:asc">Status (A → Z)</option>
                <option value="status:desc">Status (Z → A)</option>
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                ▼
              </span>
            </div>

            <button
              onClick={() => {
                setEditingTask(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 h-10 bg-indigo-600 text-white 
               rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              <Plus size={18} />
              New Task
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    handleFilterChange({ status: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange({ priority: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="animate-spin text-indigo-600" size={48} />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first task to get started
            </p>
            <button
              onClick={() => {
                setEditingTask(null);
                setShowModal(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              <Plus size={18} />
              Create Task
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setShowModal(true);
                  }}
                  onDelete={(task) => {
                    setDeletingTask(task);
                    setShowDeleteModal(true);
                  }}
                />
              ))}
            </div>
            <div className="flex justify-between items-center mt-8">
              <button
                disabled={pagination.page === 1}
                onClick={() =>
                  dispatch(setFilters({ page: pagination.page - 1 }))
                }
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:bg-gray-300"
              >
                Previous
              </button>

              <span className="text-gray-700">
                Page {pagination.page} of {pagination.pages}
              </span>

              <button
                disabled={pagination.page === pagination.pages}
                onClick={() =>
                  dispatch(setFilters({ page: pagination.page + 1 }))
                }
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:bg-gray-200"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
        />
      )}

      {showDeleteModal && (
        <DeleteModal
          task={deletingTask}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingTask(null);
          }}
          onConfirm={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
