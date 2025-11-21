import { InferSelectModel } from "drizzle-orm";
import { campaigns, players, sessions } from "~/server/db/schema";

export type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

// export type Player = {
//   name: string;
//   playerName: string;
//   type: "player" | "gm";
// };

export type Campaign = InferSelectModel<typeof campaigns>;
export type Player = InferSelectModel<typeof players>;
export type Session = InferSelectModel<typeof sessions>;
