import React from "react";
import Image from "next/image";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { Tweet } from "@/gql/graphql";
import Link from "next/link";

interface FeedCardProps {
  data: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = (props) => {
  const { data } = props;

  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-slate-900 transition-all cursor-pointer">
      <div className="grid grid-cols-12 gap-3 ">
        <div className="col-span-1">
          {data.author?.profileImageURL && (
            <Image
              src={data.author.profileImageURL}
              alt="user-image"
              height={40}
              width={40}
              className="rounded-full"
            />
          )}
        </div>

        <div className="col-span-11">
          <h5>
            <Link href={`/${data.author?.id}`}>
              {data.author?.firstName} {data.author?.lastName}
            </Link>
          </h5>
          <p>{data.content}</p>
          {data.imageURL && (
            <Image
              src={data.imageURL}
              alt="tweet-image"
              height={400}
              width={400}
            />
          )}

          <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
            <div className="group hover:bg-green-100 hover:shadow-lg rounded-full p-2 transition duration-500 ease-linear ">
              <BiMessageRounded className="group-hover:text-green-500 text-gray-500" />
            </div>

            <div className="group hover:bg-blue-100 hover:shadow-lg rounded-full p-2 transition duration-500 ease-linear">
              <FaRetweet className="group-hover:text-blue-500 text-gray-500" />
            </div>
            <div className="group hover:bg-rose-100 hover:shadow-lg rounded-full p-2 transition duration-500 ease-linear">
              <AiOutlineHeart className="group-hover:text-rose-500 text-gray-500" />
            </div>
            <div className="group hover:bg-blue-100 hover:shadow-lg rounded-full p-2 transition duration-500 ease-linear ">
              <BiUpload className="group-hover:text-blue-500 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;
