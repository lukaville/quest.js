quest.js
========

Quest.js library. Every next question encrypted with AES algorithm.

Usage
-----

1) Generate quest object:

```javascript
var encryptedQuestObject = Quest.generateQuest(notEncryptedQuestObject);
console.log(encryptedQuestObject);
```
2) Create instance of Quest:

```javascript
var mQuest = new Quest(JSON.parse(encryptedQuestObject));
```
3) Start quest!

```javascript
mQuest.startQuest();
```

Look [demo file](https://github.com/lukaville/quest.js/blob/master/js/test.js).
