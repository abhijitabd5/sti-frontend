import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import AdminLayout from '@/components/common/Layouts/AdminLayout';
import courseApi from '@/services/api/courseApi';

// Icons
import { 
  EyeIcon, 
  PencilIcon, 
  Bars3Icon, 
  LanguageIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const DraggableRow = ({ course, index, moveCourse, onToggleStatus, onNavigate, onAddLanguage }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'courseRow',
    item: { index, id: course.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'courseRow',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCourse(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const getLanguageFlag = (language) => {
    const flags = {
      'en': '🇺🇸',
      'hi': '🇮🇳', 
      'mar': '🇮🇳'
    };
    return flags[language] || '🌐';
  };

  return (
    <tr
      ref={(node) => drag(drop(node))}
      className={`border-b border-gray-200 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100">{course.id}</td>
      <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-100 font-medium">{course.display_order}</td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getLanguageFlag(course.language)}</span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{course.title}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() => onToggleStatus(course.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
            course.is_active
              ? 'bg-green-600'
              : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              course.is_active ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center space-x-2">
          {/* View */}
          <button
            onClick={() => onNavigate(`/admin/courses/${course.id}`)}
            className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="View Course"
          >
            <EyeIcon className="h-4 w-4" />
          </button>
          
          {/* Edit */}
          <button
            onClick={() => onNavigate(`/admin/courses/edit/${course.id}`)}
            className="p-1 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            title="Edit Course"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          
          {/* Drag Handle */}
          <button
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-move"
            title="Change Course Order"
          >
            <Bars3Icon className="h-4 w-4" />
          </button>
          
          {/* Add Language */}
          <button
            onClick={() => onAddLanguage(course.id)}
            // onClick={() => onNavigate(`/admin/courses/add-language/${course.id}`)}
            className="p-1 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            title="Add Course Language"
          >
            <LanguageIcon className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState({});
  const [saveOrderLoading, setSaveOrderLoading] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  // Load courses
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await courseApi.getCourses({ language: 'en' });
      if (response.success) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (courseId) => {
    setStatusLoading(prev => ({ ...prev, [courseId]: true }));
    
    try {
      const response = await courseApi.toggleCourseStatus(courseId);
      if (response.success) {
        setCourses(prev => 
          prev.map(course => 
            course.id === courseId 
              ? { ...course, is_active: response.data.is_active }
              : course
          )
        );
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    } finally {
      setStatusLoading(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const moveCourse = (dragIndex, hoverIndex) => {
    const draggedCourse = courses[dragIndex];
    const updatedCourses = [...courses];
    
    // Remove dragged course and insert at new position
    updatedCourses.splice(dragIndex, 1);
    updatedCourses.splice(hoverIndex, 0, draggedCourse);
    
    // Update display order locally
    const reorderedCourses = updatedCourses.map((course, index) => ({
      ...course,
      display_order: index + 1
    }));
    
    // Optimistic update
    setCourses(reorderedCourses);
    setHasOrderChanged(true);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const handleAddLanguage = (courseId) => {
    navigate(`/admin/courses/add-language/${courseId}`);
  };

  const handleSaveOrder = async () => {
    try {
      setSaveOrderLoading(true);
      const courseOrders = courses.map((course, index) => ({
        id: course.id,
        display_order: index + 1
      }));
      
      const response = await courseApi.reorderCourses(courseOrders);
      if (response.success) {
        setHasOrderChanged(false);
        // Show success message (you can add a toast notification here)
        console.log('Course order saved successfully');
      }
    } catch (error) {
      console.error('Error saving course order:', error);
      // Revert on error
      loadCourses();
      setHasOrderChanged(false);
    } finally {
      setSaveOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Course Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your training courses and their content
          </p>
        </div>

        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {hasOrderChanged && (
            <button
              onClick={handleSaveOrder}
              disabled={saveOrderLoading}
              className="btn bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg disabled:opacity-50"
            >
              {saveOrderLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <CheckIcon className="h-4 w-4 mr-2" />
              )}
              Save Order
            </button>
          )}
          <button
            onClick={() => navigate('/admin/courses/create')}
            className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Course
          </button>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700/60">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700/60">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            All Courses ({courses.length})
          </h3>
        </div>

        {courses.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No courses found</p>
            <button
              onClick={() => navigate('/admin/courses/create')}
              className="btn bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Your First Course
            </button>
          </div>
        ) : (
          <DndProvider backend={HTML5Backend}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Display Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700/60">
                  {courses.map((course, index) => (
                    <DraggableRow
                      key={course.id}
                      course={course}
                      index={index}
                      moveCourse={moveCourse}
                      onToggleStatus={handleToggleStatus}
                      onNavigate={handleNavigate}
                      onAddLanguage={handleAddLanguage}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </DndProvider>
        )}
      </div>
    </AdminLayout>
  );
}

export default Courses;
