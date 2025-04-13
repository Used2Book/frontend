"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/images/used2book-logo-black.png";
import useStore from "@/contexts/useStore";
import useAuthStore from "@/contexts/auth-store";
import Avatar from "./avatar";
import { Bell, ShoppingCart, MessageCircleMore, Handshake, LogOut, User, Settings } from "lucide-react";
import chatService from "@/services/chat";
import paymentService from "@/services/payment";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import { Notification } from "@/types/notification";
import { userProfile, getListingByID, getAllUsers } from "@/services/user";
import NoAvatar from "@/assets/images/no-avatar.png";
import UserSearchBar from "@/app/user/components/user-search-bar";
import offerService from "@/services/offer";
import { NotiBox } from "@/types/notification";



const NavItemString = ({ href, link_string }: { href: string; link_string: string }) => (
  <li className="p-2 hover:bg-zinc-200 rounded-full text-xs md:text-sm cursor-pointer font-sans text-gray-600">
    <Link href={href} passHref>{link_string}</Link>
  </li>
);

const NavItemIcon = ({ href, icon, count = 0 }: { href: string; icon: React.ReactNode; count?: number }) => (
  <li className="relative justify-center items-center p-2 hover:bg-zinc-200 rounded-full">
    <Link href={href} passHref>
      {icon}
      {count > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  </li>
);

const MySuccessPaymentNotiBox = ({ book_img_url, book_name, created_at }: { book_img_url: string; book_name: string; created_at: string }) => (
  <li className="p-2 hover:bg-zinc-200 text-xs md:text-sm cursor-pointer font-sans text-gray-600">
    <Link href="/user/account/purchase" className="block hover:bg-zinc-200">
      <div className="flex space-x-2">
        <div className="w-10 sm:w-10 md:w-12 lg:w-14 h-10 sm:h-10 md:h-12 lg:h-14 relative">
          <Image
            alt="Book cover"
            src={book_img_url}
            fill
            className="rounded-sm border-[1px] border-zinc-300 shadow-md object-cover"
          />
        </div>
        <div className="flex flex-col space-y-1 text-xs w-full">
          <p className="truncate text-gray-600">📚 {book_name.length > 20 ? `${book_name.slice(0, 20)}...` : book_name}</p>
          <div className="flex flex-col whitespace-nowrap space-y-1">
            <p className="font-medium text-blue-500">Payment success</p>
            <p className="font-thin text-gray-400">{created_at}</p>
          </div>
        </div>
      </div>
    </Link>
  </li>
);

const IncomingOrderNotiBox = ({
  buyer_img,
  buyer_name,
  book_name,
  created_at,
}: {
  buyer_img: string;
  buyer_name: string;
  book_name: string;
  created_at: string;
}) => (
  <li className="p-2 hover:bg-zinc-200 text-xs md:text-sm cursor-pointer font-sans text-gray-600">
    <Link href="/user/sale/my-order" className="block hover:bg-zinc-200">
      <div className="flex w-full items-center space-x-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-zinc-300 shadow-sm">
          <Image src={buyer_img || NoAvatar} alt={`${buyer_name}'s profile`} fill style={{ objectFit: "cover" }} />
        </div>
        <div className="flex flex-col justify-between w-full text-xs space-y-1">
          <p className="font-medium truncate">
            📦 Incoming order from <span className="text-blue-600 text-light">{buyer_name}</span>
          </p>
          <p className="truncate text-gray-600">📚 {book_name.length > 20 ? `${book_name.slice(0, 20)}...` : book_name}</p>
          <p className="text-xs font-thin text-gray-400">{created_at}</p>
        </div>
      </div>
    </Link>
  </li>
);

export default function NavLink() {
  const user = useStore(useAuthStore, (state) => state.user);
  const [chatCount, setChatCount] = useState(0);
  const [paymentCount, setPaymentCount] = useState(0);
  const [paymentList, setPaymentList] = useState<Notification[]>([]);
  const [offerCount, setOfferCount] = useState(0);
  const [paymentListDetail, setPaymentListDetail] = useState<NotiBox[]>([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const router = useRouter();
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);
  const notiDropdownRef = useRef<HTMLDivElement | null>(null);
  const [users, setUsers] = useState<{ id: number; first_name: string; last_name: string; picture_profile?: string }[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ type: "user"; id: number } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers.filter((user) => user.role !== "admin"));
    };
    fetchUsers();

  }, []);

  const handleUserSelect = (user: { type: "user"; id: number }) => {
    setSelectedItem(user);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
      if (notiDropdownRef.current && !notiDropdownRef.current.contains(event.target as Node)) {
        setShowNotiDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    chatService.connect();
    paymentService.connect();
    offerService.connect();
    const fetchInitialData = async () => {
      const chatCount = await chatService.getUnreadChatCount(user.id.toString());

      const paymentCount = await paymentService.getUnreadPaymentCount(user.id.toString());
      const paymentList = await paymentService.getPaymentList(user.id.toString());

      const offerCount = await offerService.getUnreadOfferCount(user.id.toString());

      setChatCount(chatCount);

      setPaymentCount(paymentCount);
      setPaymentList(paymentList);

      setOfferCount(offerCount);

      const detailList: NotiBox[] = await Promise.all(
        paymentList.map(async (payment) => {
          const userData = await userProfile(payment.buyer_id);
          const listingData = await getListingByID(payment.listing_id);
          return {
            _id: payment._id,
            seller_id: payment.seller_id,
            buyer_img: userData?.picture_profile || NoAvatar,
            buyer_name: `${userData?.first_name || "Buyer"}`,
            book_name: `${listingData?.title || "Listing"}`,
            book_img_url: listingData?.image_urls?.[0] || "/placeholder.jpg",
            create_at: new Date(payment.created_at).toLocaleString(),
          };
        })
      );
      setPaymentListDetail(detailList);
    };

    fetchInitialData();

    chatService.onChatNotification(({ chat }) => setChatCount(chat));

    paymentService.onPaymentCount(({ payments }) => setPaymentCount(payments));
    paymentService.onPaymentList(({ lists }) => {
      setPaymentList(lists);
      fetchInitialData();
    });

    offerService.onOfferCount(({ offers }) => setOfferCount(offers));

    return () => {
      chatService.disconnect();
      paymentService.disconnect();
      offerService.disconnect();
    };
  }, [user]);

  const handleOfferClick = async () => {
    if (!user?.id) return; // Guard against undefined user
    try {
      await offerService.updateReadOffer(user.id);
      const newCount = await offerService.getUnreadOfferCount(user.id.toString());
      setOfferCount(newCount);
    } catch (error) {
      console.error("Error updating offer status:", error);
    }
  };

  return (
    <nav className="top-0 left-0 w-full z-10 px-4 sm:px-8 md:px-16 py-1 text-xs md:text-sm font-medium bg-white shadow-sm">
      <div className="flex flex-row flex-nowrap items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex flex-row flex-nowrap items-center space-x-4 md:space-x-8">
          <Link href="/user/profile" className="w-auto max-w-[40px] sm:max-w-[60px] md:max-w-[80px] cursor-pointer shrink-0">
            <Image src={Logo} alt="Used2Book Logo" layout="responsive" />
          </Link>
          {user ? (
            <ul className="flex flex-row flex-nowrap space-x-4 md:space-x-6 items-center">
              <NavItemString href="/user/home" link_string="Home" />
              <NavItemString href="/user/webboard" link_string="Web board" />
              <NavItemString href="/user/sale/my-sale" link_string="Sale" />
            </ul>
          ) : null}
          {user ? (
            <div className="w-48 md:w-72 shrink-0">
              <UserSearchBar users={users} onUserSelect={handleUserSelect} />
            </div>
          ) : null}

        </div>
        <div className="flex flex-row flex-nowrap items-center">
          {user ? (
            <ul className="flex flex-row flex-nowrap space-x-2 md:space-x-4 items-center">
              <NavItemIcon href="/user/cart" icon={<ShoppingCart size={20} color="#4b5563" />} />
              <li className="relative">
                <Link href="/user/offer" passHref>
                  <div
                    className="relative p-2 hover:bg-zinc-200 rounded-full cursor-pointer"
                    onClick={handleOfferClick}
                  >
                    <Handshake size={20} color="#4b5563" />
                    {offerCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {offerCount}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
              <NavItemIcon href="/user/chat" icon={<MessageCircleMore size={20} color="#4b5563" />} count={chatCount} />
              <li className="relative" ref={notiDropdownRef}>
                <button
                  onClick={async () => {
                    await paymentService.updateReadPayment(user?.id);
                    const newCount = await paymentService.getUnreadPaymentCount(user?.id.toString());
                    setPaymentCount(newCount);
                    setShowNotiDropdown(!showNotiDropdown);
                  }}
                  className="relative p-2 hover:bg-zinc-200 rounded-full"
                >
                  <Bell size={20} color="#4b5563" />
                  {paymentCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {paymentCount}
                    </span>
                  )}
                </button>
                {showNotiDropdown && (
                  <div className="absolute right-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-md z-50 p-1">
                    <ul className="divide-y divide-gray-100 text-sm space-y-1">
                      {paymentListDetail.length === 0 ? (
                        <li className="p-4 text-center text-gray-500">No new notifications</li>
                      ) : (
                        paymentListDetail.map((noti, index) =>
                          user?.id.toString() === noti.seller_id.toString() ? (
                            <IncomingOrderNotiBox
                              key={index}
                              buyer_img={noti.buyer_img}
                              buyer_name={noti.buyer_name}
                              book_name={noti.book_name}
                              created_at={noti.create_at}
                            />
                          ) : (
                            <MySuccessPaymentNotiBox
                              key={index}
                              book_img_url={noti.book_img_url}
                              book_name={noti.book_name}
                              created_at={noti.create_at}
                            />
                          )
                        )
                      )}
                    </ul>
                  </div>
                )}
              </li>
              <li className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center justify-center bg-white w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border border-gray-300 focus:outline-none"
                >
                  <Avatar user={user} />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-sm z-50 border-2 border-gray-200">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <Link href="/user/profile" className="flex space-x-2 px-4 py-2 hover:bg-gray-100" onClick={() => setShowProfileDropdown(false)}>
                          <User size={18} />
                          <p>My Profile</p>
                        </Link>
                      </li>
                      <li>
                        <Link href="/user/account/profile" className="flex space-x-2 px-4 py-2 hover:bg-gray-100" onClick={() => setShowProfileDropdown(false)}>
                          <Settings size={18} />
                          <p>Account Settings</p>
                        </Link>
                      </li>
                    </ul>
                    <div className="py-2">
                      <button
                        className="flex space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={async (e) => {
                          e.preventDefault();
                          await logout();
                          router.push("/auth");
                        }}
                      >
                        <LogOut size={18} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            </ul>
          ) : (
            <Link href="/auth" className="bg-white text-black px-3 py-2 rounded-lg hover:bg-zinc-300 whitespace-nowrap">
              Sign in / Sign up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}