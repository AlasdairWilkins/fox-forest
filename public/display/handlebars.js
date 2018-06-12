Handlebars.registerHelper('plural', function(items, options) {
    let word = pluralize(items.word, items.number)
    return `${items.number} ${word}`
})

Handlebars.registerHelper('roundPlayer', function(input, options) {
    let source = `<p>{{#if display}}You{{else}}{{name}}{{/if}} won {{#plural trick}}{{/plural}}{{#if treasure.number}}, collected {{#plural treasure}}{{/plural}},{{/if}} and scored {{#plural score}}{{/plural}}.</p>`
    let template = Handlebars.compile(source)
    console.log(input)
    let context = new Context(input, 'roundPlayer')
    return template(context)
})

// let source = `{{#round displayPlayer}}{{/round}}`
// let template = Handlebars.compile(source)
// let context = {displayPlayer:
//         {name: 'Alasdair',
//             display: false,
//             trick: {number: 2, word: 'trick'},
//             treasure: {number: 2, word: 'treasure'},
//             score: {number: 8, word: 'point'}}}
// let html = template(context)
// console.log(html)
