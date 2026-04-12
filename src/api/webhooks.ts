import type { Request, Response} from "express";
import { upgradeUserMembership } from "../db/queries/users.js"

export async function handlerMembershipUpgrade(req: Request, res: Response) {
    type parameters = {
        event: string;
        data: {
            userId: string;
        }
    }

    const params: parameters = req.body;
    if(!params.event || params.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }

    const upgrade = await upgradeUserMembership(params.data.userId);
    if (!upgrade) {
        res.status(404).send();
        return;
    }
    
    res.status(204).send();
}
