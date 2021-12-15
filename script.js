const MST = [
  {
    id: "A1",
    vendor: "メーカーA",
    lot: "A1",
    price: 100000,
  },
  {
    id: "A2",
    vendor: "メーカーA",
    lot: "A2",
    price: 110000,
  },
  {
    id: "B1",
    vendor: "メーカーB",
    lot: "B1",
    price: 200000,
  },
  {
    id: "B2",
    vendor: "メーカーB",
    lot: "B2",
    price: 210000,
  },
  {
    id: "C1",
    vendor: "メーカーC",
    lot: "C1",
    price: 300000,
  },
  {
    id: "C2",
    vendor: "メーカーC",
    lot: "C2",
    price: 310000,
  },
];

function init() {
  // 本日の日付を設定
  let ele = document.getElementsByClassName("setToday");
  let today = new Date();
  today =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  for (let i = 0; i < ele.length; i++) {
    ele[i].setAttribute("value", today);
  }

  // メーカー初期設定
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

  // ;

  // URLクエリ取得
  let URLquery = location.search.replace("?", "");
  URLquery = URLquery.split("&");
  let query = {};
  for (let i = 0; i < URLquery.length; i++) {
    let q = URLquery[i].split("=");
    query[q[0]] = q[1];
  }
  // 製品idがあればそれを設定
  if (query.id !== undefined) {
    // alert(query.id);
    for (let i = 0; i < MST.length; i++) {
      if (query.id === MST[i].id) {
        // vendor設定
        document.getElementById("merchandiseVendor").value = MST[i].vendor;
        // 型番設定
        setLot(MST[i].vendor,MST[i].lot);
        break;
      }
    }
  }
  // なければとりあえず初期メーカーリスト
  else {
    setLot(document.getElementById("merchandiseVendor").value);
  }

  // 各種イベント設定
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
  // 商品情報
  document
    .getElementById("merchandiseVendor")
    .addEventListener("change", (e) => {
      setLot(e.target.value);
    });
  // 登録
  document.getElementById("regist").addEventListener("click", (e) => {
    regist();
  });
}

function changeVendor(e) {
  console.log(e);
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

function setLot(val,defalt = false) {
  document.getElementById("merchandiseLot").innerHTML = "";
  let flag = false;
  for (let i = 0; i < MST.length; i++) {
    if (MST[i].vendor === val) {
      let opt = document.createElement("option");
      opt.value = MST[i].lot;
      opt.innerHTML = MST[i].lot;
      if (MST[i].lot === defalt) {
        opt.selected = true;
      }
      document.getElementById("merchandiseLot").appendChild(opt);
    }
    if (flag) {
      setPrice(MST[i].lot);
    }
  }
}

function setPrice(lot) {}

function getAddress(e,area) {
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
      document.getElementById(area+"Address1").value =
        json.results[0].address1;
      document.getElementById(area+"Address2").value =
        json.results[0].address2;
      document.getElementById(area+"Address3").value =
        json.results[0].address3;
    });
}

// スプシ書き込み
function regist() {
  let GAS =
    "https://script.google.com/macros/s/AKfycbwauCquwHoxmbnmHa7dkvLvSRDKHYylHD5EllOVW25f7YO3z-qPkoRJ999cN9xUx1Vm/exec" +
    "?id=1-DAni0Hnh_K94teeFW3OhSeD0b6jNeHObQvSvcp-e0A" +
    "&name=販売情報";
  let areaIds = ["customerArea", "deliveryArea", "merchandise", "manager"];
  let query = "";
  let q = 1;
  for (let i = 0; i < areaIds.length; i++) {
    if (i == 2) {
      query +=
        "&col" + q + "=" + document.getElementById("merchandiseVendor").value;
      q++;
      query +=
        "&col" + q + "=" + document.getElementById("merchandiseLot").value;
      q++;
    }
    let ele = document.getElementById(areaIds[i]).getElementsByTagName("input");
    for (let j = 0; j < ele.length; j++) {
      query += "&col" + q + "=" + ele[j].value;
      q++;
    }
  }
  fetch(encodeURI(GAS + query));
  alert("登録完了");
}
