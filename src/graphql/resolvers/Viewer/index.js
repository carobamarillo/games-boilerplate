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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewerResolvers = void 0;
const crypto_1 = __importDefault(require("crypto"));
const api_1 = require("../../../api");
const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: process.env.NODE_ENV !== 'development' ? true : false,
};
const logInViaGoogle = (code, token, db, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const { user } = yield api_1.Google.logIn(code);
    if (!user)
        throw new Error(`Google logIn error`);
    /**
     * User name
     */
    const userName = ((_b = (_a = user === null || user === void 0 ? void 0 : user.names) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.displayName) || null;
    /**
     * User id
     */
    const userId = ((_f = (_e = (_d = (_c = user === null || user === void 0 ? void 0 : user.names) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.metadata) === null || _e === void 0 ? void 0 : _e.source) === null || _f === void 0 ? void 0 : _f.id) || null;
    /**
     * User avatar
     */
    const userAvatar = ((_h = (_g = user === null || user === void 0 ? void 0 : user.photos) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.url) || null;
    /**
     * User email
     */
    const userEmail = ((_k = (_j = user === null || user === void 0 ? void 0 : user.emailAddresses) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.value) || null;
    if (!userId || !userName || !userAvatar || !userEmail)
        throw new Error(`Google logIn error`);
    const update = yield db.users.findOneAndUpdate({ _id: userId }, {
        $set: {
            name: userName,
            avatar: userAvatar,
            contact: userEmail,
            token,
        },
    }, { returnDocument: 'after' });
    let viewer = update.value;
    if (!viewer) {
        const insert = yield db.users.insertOne({
            _id: userId,
            name: userName,
            avatar: userAvatar,
            contact: userEmail,
            token,
            income: 0,
            wishlist: [],
            games: [],
        });
        viewer = yield db.users.findOne({ _id: insert.insertedId });
    }
    res.cookie('viewer', userId, Object.assign(Object.assign({}, cookieOptions), { maxAge: 365 * 24 * 60 * 60 * 1000 }));
    return viewer || undefined;
});
const logInViaCookie = (token, db, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const update = yield db.users.findOneAndUpdate({
        _id: req.signedCookies.viewer,
    }, { $set: { token } }, { returnDocument: 'after' });
    const viewer = update.value;
    if (!viewer)
        res.clearCookie('viewer', cookieOptions);
    return viewer || undefined;
});
exports.viewerResolvers = {
    Query: {
        authUrl: () => {
            try {
                return api_1.Google.authUrl;
            }
            catch (e) {
                throw new Error(`Failed to query Google auth url: ${e}`);
            }
        },
    },
    Mutation: {
        logIn: (_root, { input }, { db, req, res }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const code = input ? input.code : null;
                const token = crypto_1.default.randomBytes(16).toString('hex');
                const viewer = code
                    ? yield logInViaGoogle(code, token, db, res)
                    : yield logInViaCookie(token, db, req, res);
                if (!viewer)
                    return { didRequest: true };
                return {
                    _id: viewer._id,
                    token: viewer.token,
                    avatar: viewer.avatar,
                    walletId: viewer.walletId,
                    didRequest: true,
                };
            }
            catch (e) {
                throw new Error(`Failed to logIn: ${e}`);
            }
        }),
        logOut: (_root, _args, { res }) => {
            try {
                res.clearCookie('viewer', cookieOptions);
                return { didRequest: true };
            }
            catch (e) {
                throw new Error(`Failed to logOut: ${e}`);
            }
        },
    },
    Viewer: {
        id: (viewer) => viewer._id,
        hasWallet: (viewer) => viewer.walletId ? true : undefined,
    },
};
