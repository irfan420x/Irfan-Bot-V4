module.exports = {
    config: {
        name: 'bio',
        aliases: ['setbio', 'changebio'],
        version: '1.0',
        author: 'Irfan Ahmmed',
        countDown: 5,
        role: 2,
        shortDescription: 'Change Facebook profile bio',
        longDescription: 'Change your Facebook account bio using GraphQL API',
        category: 'admin',
        guide: '{p}bio <text>\n{p}bio --remove'
    },

    onStart: async function({ api, event, args }) {
        const bioText = args.join(' ');

        if (!bioText) {
            return api.sendMessage(
                '❌ Usage:\n' +
                '• {p}bio <text> — Set new bio\n' +
                '• {p}bio --remove — Remove bio',
                event.threadID,
                event.messageID
            );
        }

        const isRemove = bioText === '--remove';

        if (isRemove) {
            // Remove bio
            const form = {
                av: api.getCurrentUserID(),
                fb_api_caller_class: 'RelayModern',
                fb_api_req_friendly_name: 'ProfileCometSetBioMutation',
                doc_id: '2725043627607610',
                variables: JSON.stringify({
                    input: {
                        bio: '',
                        change_type: 'REMOVE',
                        should_update_bio_in_basic_info: true,
                        source: 'profile_comet'
                    }
                })
            };

            api.httpPost('https://www.facebook.com/api/graphql/', form, (err, data) => {
                if (err) {
                    return api.sendMessage('❌ Failed to remove bio: ' + err.message, event.threadID, event.messageID);
                }

                try {
                    const result = JSON.parse(data.replace('for (;;);', ''));
                    if (result.data?.profile_intro_card_set?.profile_intro_card) {
                        return api.sendMessage('✅ Bio removed successfully!', event.threadID, event.messageID);
                    }
                    if (result.errors) {
                        return api.sendMessage('❌ Error: ' + result.errors[0].message, event.threadID, event.messageID);
                    }
                    return api.sendMessage('✅ Bio removed!', event.threadID, event.messageID);
                } catch (e) {
                    return api.sendMessage('✅ Bio removed!', event.threadID, event.messageID);
                }
            });
        } else {
            // Set new bio
            const form = {
                av: api.getCurrentUserID(),
                fb_api_caller_class: 'RelayModern',
                fb_api_req_friendly_name: 'ProfileCometSetBioMutation',
                doc_id: '2725043627607610',
                variables: JSON.stringify({
                    input: {
                        bio: bioText,
                        change_type: 'ADD',
                        should_update_bio_in_basic_info: true,
                        source: 'profile_comet'
                    }
                })
            };

            api.httpPost('https://www.facebook.com/api/graphql/', form, (err, data) => {
                if (err) {
                    return api.sendMessage('❌ Failed to change bio: ' + err.message, event.threadID, event.messageID);
                }

                try {
                    const result = JSON.parse(data.replace('for (;;);', ''));

                    if (result.data?.profile_intro_card_set?.profile_intro_card) {
                        const card = result.data.profile_intro_card_set.profile_intro_card;
                        return api.sendMessage(
                            '✅ Bio changed successfully!\n\n' +
                            '📝 New Bio: ' + (card.bio || bioText),
                            event.threadID,
                            event.messageID
                        );
                    }

                    if (result.errors) {
                        return api.sendMessage('❌ Error: ' + result.errors[0].message, event.threadID, event.messageID);
                    }

                    return api.sendMessage('✅ Bio changed to: ' + bioText, event.threadID, event.messageID);
                } catch (e) {
                    return api.sendMessage('✅ Bio changed to: ' + bioText, event.threadID, event.messageID);
                }
            });
        }
    }
};
