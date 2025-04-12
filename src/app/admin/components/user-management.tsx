// src/app/admin/users/page.tsx (adjust path as needed)
"use client";
import React, { useState, useEffect } from "react";
import { getAllUsers } from "@/services/user"; // Adjust import path
import { User } from "@/types/user";
import NoAvatar from "@/assets/images/no-avatar.png";
import Image from "next/image";
import { ChevronDown, Search } from "lucide-react";

const UserAdminManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const uniqueRoles = Array.from(new Set(users.map((user) => user.role))).sort();

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

  
  const filteredUsers = users.filter((user) => {
    const matchesName = `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesName && matchesRole;
  });
  


  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-6 px-5">User Admin Management</h1>


      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 px-5">

        <div className="relative w-full max-w-sm flex">
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search users by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="relative w-full max-w-md flex-1">

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none w-full text-xs border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:outline-none"
          >
            <option value="all">All Roles</option>
            {uniqueRoles.map((role) => (
              <option key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 ml-3 pointer-events-none">
            <ChevronDown className="h-3 w-3 text-gray-600" />
          </div>
        </div>
      </div>



      <hr className="text-gray-500 mb-2 px-5" />
      <div className="flex justify-between text-xs font-semibold px-5 text-gray-500">
        <p>
          User
        </p>
        <p>
          Role
        </p>
      </div>
      <hr className="text-gray-500 mt-2 px-5" />
      {/* User List */}
      {loading ? (
        <p className="text-gray-500 mt-2">Loading users...</p>
      ) : filteredUsers.length > 0 ? (
          <div className="min-h-[200px] overflow-y-auto space-y-2 mt-2 divide-y-2">
          {filteredUsers.map((user) => (
            <div className="flex justify-between items-center px-5" key={user.id}>
              <div
                className="flex items-center space-x-4 py-4"
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={user.picture_profile || NoAvatar.src}
                    alt={`${user.first_name} ${user.last_name}'s profile`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <p className="text-sm text-blue-500">{user.role}</p>
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

export default UserAdminManagement;