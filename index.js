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
function importJSON(source) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield (yield fetch(source)).json();
        }
        catch (_a) {
            return null;
        }
    });
}
importJSON('https://api.github.com/search/repositories?q=topic:grakkit').then((results) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    for (const info of yield Promise.all(results.items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        return ({
            author: {
                avatar: item.owner.avatar_url,
                link: item.owner.html_url,
                name: item.owner.login
            },
            repository: {
                description: item.description,
                homepage: item.homepage,
                link: item.html_url,
                marketplace: yield importJSON(`https://raw.githubusercontent.com/${item.full_name}/${item.default_branch}/.grakkit/marketplace.json`),
                name: item.name,
                stars: item.stargazers_count,
                topics: item.topics
            }
        });
    })))) {
        console.log([
            '--------------------------------',
            `repository: ${info.repository.name} (${info.repository.link})`,
            `author: ${info.author.name} (${info.author.link})`,
            `stars: ${info.repository.stars}`,
            `description: ${info.repository.description}`,
            `homepage: ${info.repository.homepage}`,
            `topics: [ ${info.repository.topics.join(', ')} ]`,
            `platforms: [ ${(_a = info.repository.marketplace) === null || _a === void 0 ? void 0 : _a.platforms.join(', ')} ]`,
            '--------------------------------'
        ].join('\n'));
    }
}));
//# sourceMappingURL=index.js.map