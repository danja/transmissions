// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Cheatsheet

const mini = 'keep this\n>remove this\n\n keep this'

const replied = 'for this usage.\n> My real intent is to use karma as a type of point system or game/task\n>\n>\n> I am not sure. \n>and another\nfollowed by normal, then \n>one final quoted line'

const first = '> a quote first line\nthen normal'

const regexMini = /\n>.*\n/gi

const regexFirst = /(^|\n)>.*\n/gi

const regexReplied = /((^|\n)>)+.*\n/gi



//const out = mini.replace(regexMini, '***')

//console.log('[[[\n' + out + '\n]]]\n\n')

console.log('[[[\n' + replied.replace(regexReplied, '\n') + '\n]]]\n\n')

// console.log('[[[\n' + first.replace(regexFirst, '') + '\n]]]\n\n')