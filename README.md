# Urgent Comfort

## Demo Video

[![image-20240111235922170](../../../../AppData/Roaming/Typora/typora-user-images/image-20240111235922170.png)](https://drive.google.com/file/d/1io1dubt4TCr-6mVYkPjBoz74AdVPOvDm/view?usp=sharing)

## Description

Urgent Comfort 是陽明交大資訊工程系資料庫系統概論的實作專案，計畫 整合北台灣的廁所點位，讓大家的緊急需求能夠得到緩解，讓大家在有緊急需求的時候能查詢附近所涵蓋的公廁。

## Project setup

### Requirement

```bash
node -v ---> v20.11.0
npm -v ---> 10.2.4
```

### Execution

```
npm install
npm start
```

### Troubleshooting

1. `Error: error:0308010C:digital envelope routines::unsupported`

   + **Enable legacy OpenSSL provider.**

     On Unix-like (Linux, macOS, Git bash, etc.):

     ```bash
     export NODE_OPTIONS=--openssl-legacy-provider
     ```

     On Windows command prompt:

     ```js
     set NODE_OPTIONS=--openssl-legacy-provider
     ```

     On PowerShell:

     ```js
     $env:NODE_OPTIONS = "--openssl-legacy-provider"
     ```

## Reference

+ [Mask Map](https://github.com/0445814/mask-map/tree/master)
