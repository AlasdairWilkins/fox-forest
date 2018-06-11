Handlebars.registerHelper('plural', function(items, options) {
    let word = pluralize(items.word, items.number)
    return `${items.number} ${word}`
})

let source = `{{#plural thing}}{{number word}}{{/plural}}`
let template = Handlebars.compile(source)
let context = {thing: {number: 1, word: 'trick'}}
let html = template(context)
console.log(html)
