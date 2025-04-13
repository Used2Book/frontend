// src/app/user/cart/page.tsx
"use client";
import { getBookRequest } from "@/services/user";
import { useEffect, useState } from "react";
import { BookRequest } from "@/types/admin_request";
import { BookAIcon } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "@/app/loading";
import Image from "next/image";
import NoAvatar from "@/assets/images/no-avatar.png";

export default function BookRequestPage() {
    const [requests, setRequests] = useState<BookRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<BookRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchRequests = async () => {
        try {
            const allRequest = await getBookRequest();
            setRequests(allRequest || []);
        } catch (error) {
            console.error("Error fetching requests:", error);
            toast.error("Failed to load request items");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const openModal = (request: BookRequest) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setIsModalOpen(false);
    };

    if (loading) return <Loading />;

    return (
        <div className="w-full h-screen px-32 py-10">
            <div className="flex items-center space-x-3 mb-5">
                <BookAIcon size={25} />
                <div className="text-2xl font-bold">Book Request</div>
            </div>

            <hr className="text-gray-500 mb-2 px-5" />
            <div className="flex justify-between text-xs font-semibold px-5 text-gray-500">
                <p>Book</p>
                <p className="text-gray-500">View Detail</p>
            </div>
            <hr className="text-gray-500 mt-2 px-5" />

            <div className="flex flex-col space-y-1">
                {requests.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">No requests found</p>
                ) : (
                    requests.map((req) => (
                        <div
                            key={req.id}
                            className="text-sm font-medium transition-all duration-200"
                        >
                            <div className="flex justify-between items-center px-5">
                                <div className="flex items-center space-x-4 py-4">
                                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                        <Image
                                            src={req.user_picture_profile || NoAvatar.src}
                                            alt={`${req.user_first_name} ${req.user_last_name}'s profile`}
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">
                                            {req.user_first_name} {req.user_last_name}
                                        </p>
                                        <p className="text-xs text-gray-500">{req.user_email}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end items-end space-y-1 ">
                                <button
                                    onClick={() => openModal(req)}
                                    className="text-sm text-blue-500 hover:underline"
                                >
                                    view
                                </button>
                                    <p className="text-xs font-light text-gray-400">{new Date(req.created_at).toLocaleString()}</p>

                                </div>

                            </div>
                            <hr className="text-gray-400 mt-2 px-5" />
                            
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div
                        className="relative bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all duration-300"
                    >
                        <div className="space-y-4">
                            {/* User Details */}
                            <div className="flex items-center space-x-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-blue-200">
                                    <Image
                                        src={selectedRequest.user_picture_profile || NoAvatar.src}
                                        alt={`${selectedRequest.user_first_name} ${selectedRequest.user_last_name}'s profile`}
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-lg font-medium text-gray-800">
                                        {selectedRequest.user_first_name} {selectedRequest.user_last_name}
                                    </h2>
                                    <p className="text-xs text-gray-500">{selectedRequest.user_email}</p>
                                </div>
                            </div>
                            {/* Other Details */}
                            <div className="space-y-2 text-sm text-gray-700">  
                                <div>
                                    <span className="font-medium text-gray-600">Title:</span>
                                    <p className="w-full px-2 py-1 bg-gray-200 rounded-md">{selectedRequest.title || "Untitled"}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">ISBN:</span>
                                    <p className="w-full px-2 py-1 bg-gray-200 rounded-md">{selectedRequest.isbn || "N/A"}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Note:</span>
                                    <p className="w-full px-2 py-1 bg-gray-200 rounded-md truncate">{selectedRequest.note || "No note provided"}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Created:</span>
                                    <p className="w-full px-2 py-1 bg-gray-200 rounded-md">{new Date(selectedRequest.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}