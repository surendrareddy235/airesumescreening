import React from "react";

const Dashboard = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-indigo-600">
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome to Your Dashboard ??
                </h1>
                <p className="text-gray-600">
                    You’ve successfully logged in! Explore your account or continue building your app.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
