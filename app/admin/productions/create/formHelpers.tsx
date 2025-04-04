// Reusable Input Field Component
export const InputField = ({ id, label, required = false, errorField, formData, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}{required && <span className="text-red-600">*</span>}
    </label>
    <input
      id={id}
      name={id}
      className={`w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border ${errorField && !formData[id] ? 'border-red-500' : 'border-gray-300 dark:border-film-black-700'} focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white`}
      {...props}
    />
  </div>
);

// Reusable Textarea Field Component
export const TextareaField = ({ id, label, required = false, errorField, formData, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}{required && <span className="text-red-600">*</span>}
    </label>
    <textarea
      id={id}
      name={id}
      className={`w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border ${errorField && !formData[id] ? 'border-red-500' : 'border-gray-300 dark:border-film-black-700'} focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white`}
      {...props}
    />
  </div>
);
