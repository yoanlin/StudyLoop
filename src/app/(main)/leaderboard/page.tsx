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
      <div className="p-10 sm:ml-20">
        <Searchbar
          route="/leaderboard"
          placeholder="Search for user"
          otherClass="max-w-2xl h-12"
        />
        <h2 className="mt-8 font-bowlbyOneSC text-2xl">LEADERBOARD</h2>

        {users && users.length > 0 ? (
          <section className="mt-8 flex max-w-3xl flex-wrap gap-5">
            {users.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </section>
        ) : (
          <p className="mt-10 text-center">No user found🥲</p>
        )}
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
