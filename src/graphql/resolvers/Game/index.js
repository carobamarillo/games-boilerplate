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
exports.gameResolvers = void 0;
const mongodb_1 = require("mongodb");
const utils_1 = require("../../../utils");
const types_1 = require("./types");
exports.gameResolvers = {
    Query: {
        game: (_root, { id }, { db, req }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const game = yield db.games.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (!game)
                    throw new Error(`Game with id[${id} can't be found]`);
                const viewer = yield (0, utils_1.auth)(db, req);
                if (viewer && viewer.token) {
                    viewer.authorized = true;
                }
                return game;
            }
            catch (e) {
                throw new Error('Failed to query game');
            }
        }),
        games: (_root, { filter, limit, page }, { db, req }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const data = {
                    total: 0,
                    result: [],
                };
                let cursor = yield db.games.find({});
                if (filter) {
                    if (filter === types_1.GameType.SLOTMACHINES) {
                        cursor = cursor.filter({ type: 'SLOTMACHINES' });
                    }
                    if (filter === types_1.GameType.VIDEOSLOT) {
                        cursor = cursor.filter({ type: 'VIDEOSLOT' });
                    }
                    if (filter === types_1.GameType.ALL) {
                        cursor = cursor.filter({
                            type: { $in: ['SLOTMACHINES', 'VIDEOSLOT'] },
                        });
                    }
                }
                cursor.skip(page > 0 ? (page - 1) * limit : 0);
                data.total = yield cursor.count();
                data.result = yield cursor.toArray();
                return data;
            }
            catch (e) {
                throw new Error(`Failed to query games ${e}`);
            }
        }),
    },
    Game: {
        id: (game) => {
            return game._id.toString();
        },
    },
};
