const allOnEvent = global.irfbot.ncEvent;

module.exports = {
        config: {
                name: "ncEvent",
                version: "1.1",
                author: "Irfan Ahmmed",
                description: "Loop to all event in global.irfbot.ncEvent and run when have new event",
                category: "events"
        },

        onStart: async ({ api, args, message, event, threadsData, usersData, dashBoardData, threadModel, userModel, dashBoardModel, role, commandName }) => {
                for (const item of allOnEvent) {
                        if (typeof item === "string") {
                                const command = global.irfbot.eventCommands.get(item.toLowerCase());
                                if (command && typeof command.onStart === "function") {
                                        command.onStart({ api, args, message, event, threadsData, usersData, threadModel, dashBoardData, userModel, dashBoardModel, role, commandName });
                                }
                                continue;
                        }
                        item.onStart({ api, args, message, event, threadsData, usersData, threadModel, dashBoardData, userModel, dashBoardModel, role, commandName });
                }
        }
};