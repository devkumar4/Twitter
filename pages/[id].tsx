import { useRouter } from "next/router";
import FeedCard from "@/components/FeedCard";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import { Tweet, User } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import Image from "next/image";
import { BsArrowLeftShort } from "react-icons/bs";
import { GetServerSideProps, NextPage } from "next";
import { graphqlClient } from "@/clients/api";
import { getUserByIdQuery } from "@/garphql/query/user";

interface ServerProps {
  userInfo?: User;
}
const UserProfilePage: NextPage<ServerProps> = (props) => {
  const { user } = useCurrentUser();

  return (
    <div>
      <TwitterLayout>
        <div>
          <nav className="flex items-center gap-3 py-3 px-3">
            <BsArrowLeftShort className="text-4xl" />
            <div>
              <h1 className="font-bold text-2xl">
                {props.userInfo?.firstName} {props.userInfo?.lastName}
              </h1>
              <h1 className="font-bold text-md text-slate-500">
                {props.userInfo?.tweets?.length} Tweets
              </h1>
            </div>
          </nav>
          <div className="p-4 border-b border-slate-800">
            {props.userInfo?.profileImageURL && (
              <Image
                src={props.userInfo?.profileImageURL}
                alt="user-image"
                className="rounded-full"
                width={100}
                height={100}
              />
            )}
            <h1 className="font-bold text-2xl mt-5">
              {props.userInfo?.firstName}
              {props.userInfo?.lastName}
            </h1>
          </div>
          <div>
            {props.userInfo?.tweets?.map((tweet) => (
              <FeedCard data={tweet as Tweet} key={tweet?.id} />
            ))}
          </div>
        </div>
      </TwitterLayout>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const id = context.query.id as string | undefined;
  if (!id) return { notFound: true, props: { userInfo: undefined } };
  const userInfo = await graphqlClient.request(getUserByIdQuery, { id });
  if (!userInfo.getUserById) return { notFound: true };

  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  };
};
export default UserProfilePage;
