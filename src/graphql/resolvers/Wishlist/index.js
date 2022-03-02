"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistResolvers = void 0;
exports.wishlistResolvers = {
    Wishlist: {
        id: (wishlist) => {
            return wishlist._id.toString();
        },
        game: (wishlist, _args, { db }) => {
            return db.wishlist.findOne({ _id: wishlist.game.id });
        },
    },
};
