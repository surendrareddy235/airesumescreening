export const Loader = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-200 dark:border-gray-600"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 font-medium">Loading...</p>
    </div>
);