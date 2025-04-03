// src/app/admin/users/page.tsx (adjust path as needed)
"use client";
import React, { useState, useEffect } from "react";
import { getAllUsers } from "@/services/user"; // Adjust import path
import { User } from "@/types/user";

const UserAdminManagementPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        console.log("Fetched users:", fetchedUsers); // Debug
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 rounded-md shadow-md bg-white">
      <h1 className="text-2xl font-bold mb-6">User Admin Management</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* User List */}
      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              {user.picture_profile && (
                <div className="relative w-12 h-12">
                  <img
                    src={user.picture_profile}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-full h-full object-cover rounded-full border border-gray-300"
                  />
                </div>
              )}
              <div>
                <p className="text-lg font-semibold">
                  {user.first_name} {user.last_name}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          {searchQuery ? "No users match your search." : "No users found."}
        </p>
      )}
    </div>
  );
};

export default UserAdminManagementPage;