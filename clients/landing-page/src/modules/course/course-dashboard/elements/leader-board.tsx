import React from "react";
import LeaderBoardTable from "../features/leader-board-table";
import { users } from "../features/data";

/* -------------------------------------------------------------------------- */
/*                                leader board                                */
/* -------------------------------------------------------------------------- */

type Props = {
  data: any[];
  title: string;
  ownLeaderBoard: any;
};

const LeaderBoard = ({ data, title, ownLeaderBoard }: Props) => {
  return (
    <div className="flex h-full flex-col justify-center overflow-hidden rounded-lg border bg-white px-2 py-4 text-center shadow sm:p-6">
      <h1 className="text-xl font-semibold">Leaderboard - {title}</h1>
      {/* my leaderboard position */}
      <div className="flex h-full flex-col justify-between">
        <div className="mt-10 flex w-full px-4">
          <h3 className="mb-5 border-b pb-2 text-base font-medium w-full text-left">
            Your position on the leaderboard
          </h3>
        </div>
        <LeaderBoardTable users={[ownLeaderBoard]} />
      </div>

      {/* student leaderboard */}
      <div className="flex h-full flex-col justify-between">
        <div className="mt-10 flex w-full px-4">
          <h3 className="mb-5 border-b pb-2 text-base font-medium w-full text-left">
            Leaderboard - Course name
          </h3>
        </div>
        <LeaderBoardTable users={data} />
      </div>
    </div>
  );
};
export default LeaderBoard;
