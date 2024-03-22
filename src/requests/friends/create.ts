import { z } from 'zod';
import { ObjectId } from 'bson';

const PreProcessId = z.preprocess((arg) => {
    if (typeof arg == 'string' && arg.length >= 24)
        return ObjectId.createFromHexString(arg);
    else if (arg instanceof ObjectId) return arg;
    else return undefined;
}, z.instanceof(ObjectId).optional()) as z.ZodEffects<
    z.ZodTypeAny,
    ObjectId | undefined,
    ObjectId | undefined
>;

export const createScheme = z.object({
    id: PreProcessId.optional(),
    requestTo: PreProcessId,
    type: z.enum([
        'FRIEND',
        'BLOCK',
        'UNFRIEND',
        'CANCEL_REQUEST',
        'FRIEND_PENDING',
        'REJECT',
    ]),
});
