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