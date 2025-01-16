# UTD (УПД) to 1C (VUE refactoring)

This repository is a practice in VUE3 and refactoring of existing code. [Link](https://github.com/dar-ju/tool.upd-to-1c.converter) to the JavaScript repository.

Converter from Universal transfer document (Универсальный Передаточный Документ) formed in Excel formats .xls, .xlsx and .csv to upload for 1C by using clipboard buffer.

Interface has changelable control fields with "code", "quantity" and "sum" which dafaults storages in code, and customs in the localstorage.

Used:

- VUE3
- Vite
- Bootstrap interface
- XLSX module

Result is in 3 clicks: review button, choose file, confirm.

3 real users )

Link: http://upd-to-1c-vue.host1438437.hostland.pro/

Converter screen:
![Converter screen](http://_github-images.host1438437.hostland.pro/converter-screen1.jpg)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
