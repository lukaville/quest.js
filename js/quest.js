var text = "Next level!";
var pass = "key";

var encrypted = GibberishAES.enc(text, pass);

console.log(encrypted)