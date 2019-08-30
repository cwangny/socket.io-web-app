let array = ['Mison', 'Kevin', 'Ben'];
let nick = 'Ben';

for (let i = 0; i < array.length; i++) {
    if (nick === array[i]) {
        console.log(nick);
        let index = array.indexOf(array[i]);
        console.log(index);
        array.splice(index);
        console.log(array);
    } 
}