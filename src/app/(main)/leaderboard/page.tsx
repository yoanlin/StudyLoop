import { getUsers } from "@/lib/actions/user.action";
import React from "react";
import { SearchParams } from "../../../../types/global";
import UserCard from "@/components/cards/UserCard";
import Searchbar from "@/components/navigation/Searchbar";

const LeaderboardPage = async ({ searchParams }: SearchParams) => {
  const { query } = await searchParams;
  const { data, success, error } = await getUsers({
    query: query || "",
  });

  const { users } = data || {};
  if (success) {
    return (
      <div className="flex flex-col p-10 sm:ml-20">
        <Searchbar
          route="/leaderboard"
          placeholder="Search for user"
          otherClass="max-w-3xl h-12"
        />
        <h2 className="mt-8 font-bowlbyOneSC text-2xl">LEADERBOARD</h2>

        <div className="w-full max-w-3xl self-center lg:self-start">
          {users && users.length > 0 ? (
            <section className="mt-8 flex w-full flex-wrap gap-5">
              {users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </section>
          ) : (
            <p className="mt-10 w-full max-w-3xl text-center font-markaziText text-2xl">
              No user found🥲
            </p>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <p>{error?.message || "Failed to fetch user"}</p>
      </div>
    );
  }
};

export default LeaderboardPage;
