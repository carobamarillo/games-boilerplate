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
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const mongodb_1 = require("mongodb");
const database_1 = require("../database");
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('running seed');
        const db = yield (0, database_1.connectDatabase)();
        const games = [
            {
                _id: new mongodb_1.ObjectId(),
                name: 'Starburst',
                description: 'Starburst is a high paced slot with some nice new features including a Starburst Wild feature. It has 5-reels and 10-bet lines and Traditional Wilds are replaced with an innovative new Starburst Wild which appear on reels 2, 3 or 4 and expand over the entire reel and remain in place for up to 3 re-spins giving you a much better chance of hitting a HUGE win!',
                code: 'starburst',
                icon: 'images/game-icon/starburst.jpg',
                categoryId: 2,
            },
            {
                _id: new mongodb_1.ObjectId(),
                name: 'Jack Hammer',
                description: 'Jack Hammer is a 25-line, 3-row video slot using 15 independent reels set in the gritty, glamorous underworld of a crime fighting private eye.The game features Sticky Wins, Free Spins and Wild Substitutions.',
                code: 'jackhammer',
                icon: 'images/game-icon/jackhammer.jpg',
                categoryId: 1,
            },
            {
                _id: new mongodb_1.ObjectId(),
                name: 'Jack and the Beanstalk',
                description: 'We is proud to present Jack and the Beanstalk. This game has a new feature called walking wilds which you will find in the main gameplay of this amazing game When a wild symbol is placed on the reels it will travel one reel at a time unti it leaves the left most reel, hence the name walking wilds! There are also in game free spins, where the main feature is to collect keys to unlock the different wild functionalities.',
                code: 'jackandbeanstalk',
                icon: 'images/game-icon/jackandbeanstalk.jpg',
                categoryId: 1,
            },
            {
                _id: new mongodb_1.ObjectId(),
                name: 'Dead or Alive',
                description: 'The Elements slot has an Avalanche meter which increases by one for each successive fall until it reaches the maximum of 4. After 4 successive Avalanches one of the 4 Free Falls Storm modes is triggered. These are the Fire Storm mode, Air Storm mode, Earth Storm mode, and Water Storm mode. The colours of the Avalanche meter match the leading element in the current game round.',
                code: 'deadoralive',
                icon: 'images/game-icon/deadoralive.jpg',
                categoryId: 2,
            },
        ];
        for (const game of games) {
            yield db.games.insertOne(game);
        }
        console.log('seed finished');
    }
    catch (error) {
        throw new Error('Failed to seed database');
    }
});
seed();
