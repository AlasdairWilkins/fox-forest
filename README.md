# fox-forest

This JavaScript program is an adaptation of the two-player card game The Fox in the Forest. A trick-taking card game, players are dealt 13 cards from an original deck that has 3 suits with 11 cards each. The odd-numbered cards all have unique mechanics that affect gameplay. To make this game more accessible to new players, I have included a YouTube tutorial and a flipbook of the rules PDF, along with quick reference dropdown displays.

Users can log in if they have a Recurse Center account using OAuth. Otherwise, they can enter a display name. The Node server is deployed on Google Cloud, and the game is available to play at [fox-forest.alasdairwilkins.com](http://fox-forest.alasdairwilkins.com/). For now, game and player information is stored in memory on the server. A SQL database is a long-term goal, especially as the server objects do match those of a relational database model.

The game's frontend is written in vanilla JS, though over the course of its main three-month development at the Recurse Center I arrived at an original React-like framework to handle state changes and selectively re-render DOM elements. The game uses the Handlebars library with my own helper functions to create dynamic semantic templates to display trick, round, and game results.

The game is networked using Socket.io. I have added Nodemailer and Zulip integrations so that players can invite others to two-player games using email or private message.
