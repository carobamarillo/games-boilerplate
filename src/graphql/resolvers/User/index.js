"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
const utils_1 = require("../../../utils");
exports.userResolvers = {
    Query: {
        user: (_root, { id }, { db, req }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const user = yield db.users.findOne({ _id: id });
                if (!user)
                    throw new Error(`User with id[${id}] not found`);
                const viewer = yield (0, utils_1.auth)(db, req);
                if (viewer && viewer._id === user._id)
                    user.authorized = true;
                return user;
            }
            catch (e) {
                throw new Error(`Failed to query user ${e}`);
            }
        }),
    },
    User: {
        id: (user) => user._id,
        games: (user, { limit, page }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const data = {
                    total: 0,
                    result: [],
                };
                const cursor = yield db.games.find({
                    _id: { $in: user.games },
                });
                cursor.skip(page > 0 ? (page - 1) * limit : 0);
                data.total = yield cursor.count();
                data.result = yield cursor.toArray();
                return data;
            }
            catch (e) {
                throw new Error(`Failed to query user games ${e}`);
            }
        }),
        wishlist: (user, { limit, page }, { db }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                if (!user.authorized)
                    return null;
                const data = {
                    total: 0,
                    result: [],
                };
                const cursor = yield db.wishlist.find({
                    _id: { $in: user.wishlist },
                });
                cursor.skip(page > 0 ? (page - 1) * limit : 0);
                data.total = yield cursor.count();
                data.result = yield cursor.toArray();
                return data;
            }
            catch (e) {
                throw new Error(`Failed to query user wishlist ${e}`);
            }
        }),
    },
};
