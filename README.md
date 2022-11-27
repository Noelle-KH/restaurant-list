# 我的餐廳清單
提供餐廳清單，可以新增、瀏覽、修改及刪除餐廳、查看餐廳資訊、搜尋餐廳、排序餐廳

<img src='resource/preview.png'>

## 功能
* 可以瀏覽所有餐廳
* 點擊餐廳可取得其詳細資訊
* 輸入餐廳名稱或分類的關鍵字來搜尋餐廳
* 能夠新增、修改及刪除餐廳
* 可以針對餐廳的名稱(英文字母)、分類及地區進行排序

## 開始使用
1. 請先確認已安裝 node.js 與 npm (版本請見下方開發工具)
2. 經由終端機clone或下載本專案至本地資料夾
  ```
  https://github.com/Noelle-KH/restaurant-list.git
  ```
3. 於終端機進入存放本專案的資料夾
  ```
  cd restaurant-list
  ```
4. 安裝 npm 套件
  ```
  npm install
  ```

5. 新增```.env```檔案，並設置資料庫連線字串
  ```
  MONGODB_URL=mongodb+srv://<account>:<password>@cluster0.<xxxxx>.mongodb.net/<table>?retryWrites=true&w=majority
  ```
6. 啟動專案前，請先建立種子資料，如在終端機中成功看到done，即表示種子資料建立成功
  ```
  npm run seed
  ```
7. 欲啟動專案，請繼續輸入
  ```
  npm run dev
  ```
8. 若在終端機看到下方訊息代表順利運行，於瀏覽器中輸入該網址([http://localhost:3000](http://localhost:3000))即可開始使用本網站
  ```
  Listening on http://localhost:3000
  ```
9. 如需暫停使用，請於終端機內按下ctrl + c，即可結束


## 開發工具
* Node.js 16.17.1
* Express 4.16.4
* Express-Handlebars 3.0.0
* Mongoose 5.13
* method-override 3.0.0
* dotenv 16.0.3
* Bootstrap 5.1.3
* Font Awesome 6.2.0
