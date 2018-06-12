function Context(source, type) {

    switch (type) {

        case 'round':
            this.display = source.displayplayer
            this.remote = source.remoteplayer
            break

        case 'roundPlayer':
            this.name = source.name
            this.display = game.displayplayer.cookie === source.cookie
            this.trick = {number: source.tricks.length, word: 'trick'}
            this.treasure = {number: source.treasure, word: 'treasure'}
            this.score = {number: source.tricks.length + source.treasure, word: 'point'}
            break

        case 'emailsent':
            this.email = source.email
            this.code = source.code
            break

        case 'decree':
            this.image = source.image
            this.mouseover = source.mouseover
            break

        case 'trick':
        case 'leads':
            this.name = source.name
            this.display = source.cookie === game.displayplayer.cookie
            break

        case 'game':
            this.name = source.name
            this.tricks = source.tricks.length
            this.score = source.score
            break

        default:
            this.input = source
    }
}