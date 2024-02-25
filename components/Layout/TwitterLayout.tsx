import { useCurrentUser } from "@/hooks/user";
import React, { useCallback, useMemo } from "react";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import Image from "next/image";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/garphql/query/user";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
interface TwitterlayoutProps {
  children: React.ReactNode;
}
interface TwitterSideButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

const TwitterLayout: React.FC<TwitterlayoutProps> = (props) => {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();

  const handleLoginWithGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) toast.error("Google token not found");
      const { verifyGoogleToken } = await graphqlClient.request(
        verifyUserGoogleTokenQuery,
        {
          token: googleToken,
        }
      );
      toast.success("Verified Succes");
      console.log(verifyGoogleToken);
      if (verifyGoogleToken) {
        window.localStorage.setItem("twitter_token", verifyGoogleToken);
      }
      await queryClient.invalidateQueries(["current-user"]);
    },
    [queryClient]
  );

  const SidebarMenuItems: TwitterSideButton[] = useMemo(
    () => [
      {
        title: "Home",
        icon: <BiHomeCircle />,
        link: "/",
      },
      {
        title: "Explore",
        icon: <BiHash />,
        link: "/",
      },
      {
        title: "Notifications",
        icon: <BsBell />,
        link: "/",
      },
      {
        title: "Messages",
        icon: <BsEnvelope />,
        link: "/",
      },
      {
        title: "Bookmarks",
        icon: <BsBookmark />,
        link: "/",
      },
      {
        title: "Twitter Blue",
        icon: <BiMoney />,
        link: "/",
      },
      {
        title: "Profile",
        icon: <BiUser />,
        link: `${user?.id}`,
      },
      {
        title: "More Options",
        icon: <SlOptions />,
        link: "/",
      },
    ],
    [user?.id]
  );
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen sm:px-56">
        <div className="col-span-2 sm:col-span-3  pt-1 sm:justify-end flex pr-4 relative">
          <div>
            <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
              <BsTwitter />
            </div>
            <div className="mt-1 text-xl pr-4">
              <ul>
                {SidebarMenuItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.link}
                      className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-3 py-2 w-fit cursor-pointer mt-2"
                    >
                      <span className=" text-2xl">{item.icon}</span>
                      <span className="hidden sm:inline">{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-5 px-3">
                <button className=" hidden sm:block bg-[#1d9bf0] text-lg font-semibold rounded-full w-full py-2 px-4">
                  Tweet
                </button>
                <button className="block sm:hidden bg-[#1d9bf0] text-lg font-semibold rounded-full w-full py-2 px-4">
                  <BsTwitter />
                </button>
              </div>
            </div>
          </div>

          {user && (
            <div className="absolute bottom-2 flex gap-2 items-center  px-3 py-2 rounded-full mr-10 bg-transparent hover:cursor-pointer hover:bg-slate-600 transition-all">
              {user && user.profileImageURL && (
                <Image
                  className="rounded-full"
                  src={user?.profileImageURL}
                  alt="user-profile-image"
                  height={40}
                  width={40}
                />
              )}
              <div className="hidden sm:block">
                <h3 className="text-lg">
                  {user.firstName} {user.lastName} {"     "}
                </h3>
              </div>
            </div>
          )}
        </div>

        <div
          className="col-span-10 sm:col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-y-scroll border-gray-600"
          style={{ scrollbarWidth: "none" }}
        >
          {props.children}
        </div>

        <div className="col-span-0 sm:col-span-3 p-5">
          {!user && (
            <div className="p-5 rounded-lg bg-slate-700">
              <h2 className="my-2 text-2xl">New to Twitter ?</h2>
              <GoogleLogin onSuccess={handleLoginWithGoogle} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default TwitterLayout;
