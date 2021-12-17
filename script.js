// 商品リスト格納
let MST;

function init() {
  // 本日の日付を設定
  let ele = document.getElementsByClassName("setToday");
  let today = new Date();
  today =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  for (let i = 0; i < ele.length; i++) {
    ele[i].setAttribute("value", today);
  }

  // 商品情報取得＆初期設定
  fetch(
    "https://script.google.com/macros/s/AKfycbwSkhbXG8i12d6wGKmRitG9xX2PDbJ5sY-GSX5p-uoFAnJ0Mqx2UeQpeTIenwdX79j6yQ/exec" +
      "?id=1-DAni0Hnh_K94teeFW3OhSeD0b6jNeHObQvSvcp-e0A" +
      "&name=商品情報"
  )
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      MST = json;
      console.log(json);
      // フォーム初期設定
      initForm();
      // 各種イベント設定
      setEvents();
    });
}

// フォーム初期設定
function initForm() {
  // メーカーリスト生成
  let vendors = [];
  for (let i in MST) {
    if (!vendors.includes(MST[i].vendor)) {
      vendors[vendors.length] = MST[i].vendor;
      let opt = document.createElement("option");
      opt.value = MST[i].vendor;
      opt.innerHTML = MST[i].vendor;
      document.getElementById("merchandiseVendor").appendChild(opt);
    }
  }
  // 初期型番リスト設定
  changeVendor(MST[0].vendor);

  // URLクエリ取得
  let URLquery = location.search.replace("?", "");
  URLquery = URLquery.split("&");
  let query = {};
  for (let i = 0; i < URLquery.length; i++) {
    let q = URLquery[i].split("=");
    query[q[0]] = q[1];
  }
  // とりあえず初期設定
  changeVendor(MST[0].vendor);
  changeLot(MST[0].id);
  // 製品idがあればそれを設定
  if (query.id !== undefined) {
    for (let i = 0; i < MST.length; i++) {
      if (query.id === MST[i].id) {
        // vendor設定
        document.getElementById("merchandiseVendor").value = MST[i].vendor;
        // 型番設定
        changeVendor(MST[i].vendor, MST[i].lot);
        break;
      }
    }
  } else {
    // なければとりあえず初期メーカーリスト
    changeVendor(document.getElementById("merchandiseVendor").value);
  }
}

// 各種イベント設定
function setEvents() {
  // 郵便番号から住所取得
  document
    .getElementById("customerPostalcode")
    .addEventListener("keyup", (e) => {
      getAddress(e, "customer");
    });
  document
    .getElementById("deliveryPostalcode")
    .addEventListener("keyup", (e) => {
      getAddress(e, "delivery");
    });
  // 顧客情報→お届け先のコピー作成
  document
    .getElementById("copyCustomer2delivery")
    .addEventListener("click", (e) => {
      copyCustomer2delivery();
    });
  // 商品情報：メーカー
  document
    .getElementById("merchandiseVendor")
    .addEventListener("change", (e) => {
      changeVendor(e.target.value);
    });
  // 商品情報：型番
  document.getElementById("merchandiseLot").addEventListener("change", (e) => {
    changeLot(e.target.value);
  });
  // 項目別入力欄リセット
  let areas = ["customer", "delivery", "merchandise", "manager"];
  for (let i = 0; i < areas.length; i++) {
    document
      .getElementById(areas[i] + "Reset")
      .addEventListener("click", (e) => {
        formReset(areas[i]);
      });
  }
  // 登録
  document.getElementById("registBtn").addEventListener("click", (e) => {
    regist();
  });
}

// 郵便番号から住所取得
function getAddress(e, area) {
  let post = Number(e.target.value);
  // 桁数チェック
  if (post < 1000000 || 9999999 < post) {
    return;
  }
  let api = "https://zipcloud.ibsnet.co.jp/api/search?zipcode=" + post;
  console.log(e.target.value);
  fetch(api)
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      console.log(json);
      if (json.results === null) {
        return;
      }
      document.getElementById(area + "Address1").value =
        json.results[0].address1;
      document.getElementById(area + "Address2").value =
        json.results[0].address2;
      document.getElementById(area + "Address3").value =
        json.results[0].address3;
    });
}

// 顧客情報→お届け先のコピー作成
function copyCustomer2delivery() {
  let ele0 = document
    .getElementById("customerArea")
    .getElementsByTagName("input");
  let ele1 = document
    .getElementById("deliveryArea")
    .getElementsByTagName("input");
  for (let i = 0; i < ele0.length; i++) {
    ele1[i].value = ele0[i].value;
  }
}

function changeVendor(val, defalt = false) {
  document.getElementById("merchandiseLot").innerHTML = "";
  let flag = false;
  for (let i = 0; i < MST.length; i++) {
    if (MST[i].vendor === val) {
      let opt = document.createElement("option");
      opt.value = MST[i].id;
      opt.innerHTML = MST[i].lot;
      // リスト先頭をとりあえず価格設定
      if (!flag) {
        document.getElementById("merchandiseVendorPrice").value = MST[i].price;
        flag = true;
      }
      if (MST[i].lot === defalt) {
        opt.selected = true;
        document.getElementById("merchandiseVendorPrice").value = MST[i].price;
      }
      document.getElementById("merchandiseLot").appendChild(opt);
    }
  }
}

function changeLot(id) {
  for (let i = 0; i < MST.length; i++) {
    if (MST[i].id == id) {
      document.getElementById("merchandiseVendorPrice").value = MST[i].price;
      return;
    }
  }
}

// 項目リセット
function formReset(id) {
  let ele = document.getElementById(id + "Area").getElementsByTagName("input");
  for (let i = 0; i < ele.length; i++) {
    // 例外処理
    switch (ele[i].id) {
      case "merchandiseVendor":
      case "merchandiseLot":
      case "merchandiseVendorPrice":
        break;
      case "merchandiseQuantity":
        ele[i].value = 1;
        break;
      case "merchandiseDate":
        let today = new Date();
        ele[i].value = `${today.getFullYear()}-${
          today.getMonth() + 1
        }-${today.getDate()}`;
        break;
      default:
        ele[i].value = "";
    }
  }
}

// スプシ書き込み
function regist() {
  let GAS =
    "https://script.google.com/macros/s/AKfycbwauCquwHoxmbnmHa7dkvLvSRDKHYylHD5EllOVW25f7YO3z-qPkoRJ999cN9xUx1Vm/exec" +
    "?id=1-DAni0Hnh_K94teeFW3OhSeD0b6jNeHObQvSvcp-e0A" +
    "&name=販売情報";
  let areaIds = [
    "customerName",
    "customerFurigana",
    "customerMob",
    "customerTel",
    "customerPostalcode",
    "customerAddress1",
    "customerAddress2",
    "customerAddress3",
    "customerAddress4",
    "deliveryName",
    "deliveryFurigana",
    "deliveryMob",
    "deliveryTel",
    "deliveryPostalcode",
    "deliveryAddress1",
    "deliveryAddress2",
    "deliveryAddress3",
    "deliveryAddress4",
    "merchandiseVendor",
    "merchandiseLot",
    "merchandiseVendorPrice",
    "merchandiseQuantity",
    "merchandiseSellingPrice",
    "merchandiseSpecialPrice",
    "merchandiseDate",
    "merchandiseFare",
    "merchandiseOtherCost",
    "managerStaff",
    "managerSales",
    "manegerText",
  ];
  let query = "";
  let q = 1;
  for (let i = 0; i < areaIds.length; i++) {
    switch (areaIds[i]) {
      default:
        // console.log(document.getElementById(areaIds[i]).value);
        query += `&col${i + 1}=${encodeURI(
          String(document.getElementById(areaIds[i]).value)
        )}`;
    }
  }
  fetch(GAS + query).then((res) => {
    console.log(res);
  });
  document.getElementById("debug").innerText = query;
  alert("データ送信完了");
}

// 禁則処理
function errorText(val) {
  let errorLetters = ["#", "&", "="];
  for (let i = 0; i < errorLetters.length; i++) {
    if (val.indexOf(errorLetters[i]) > 0) {
      alert(`半角「${errorLetters[i]}」は使用できません`);
    }
  }
}
