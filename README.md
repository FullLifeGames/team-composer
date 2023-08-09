# Team Composer

Can generate teams for draft league and evaluate given teams.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn dev
```

### Compiles and minifies for production
```
yarn build
```

### Runs the minified production build
```
yarn preview
```

### Lints files
```
yarn lint
```

### Lints and fixes files (do this before every commit)
```
yarn lint:fix
```

## How to get translations

* Go to [https://bulbapedia.bulbagarden.net/wiki/List_of_German_Pok%C3%A9mon_names](https://bulbapedia.bulbagarden.net/wiki/List_of_German_Pok%C3%A9mon_names)
* Execute the following code in console:

```javascript
var listEn = [];
var listDe = [];
$('#mw-content-text > div > table > tbody > tr > td:nth-child(3) > a').each((el, val) => listEn.push($(val)[0].text.trim()))
$('#mw-content-text > div > table > tbody > tr > td:nth-child(4) > a').each((el, val) => listDe.push($(val)[0].text.trim()))

var mons = {}

for (var i = 0; i < listEn.length; i++) {
	mons[listDe[i]] = listEn[i];
}

mons
```
