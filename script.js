const MST = {
  メーカーA: [
    {
      name: "A1",
      price: 100000,
    },
    {
      name: "A2",
      price: 110000,
    },
  ],
  メーカーB: [
    {
      name: "B1",
      price: 200000,
    },
    {
      name: "B2",
      price: 210000,
    },
  ],
  メーカーC: [
    {
      name: "C1",
      price: 300000,
    },
    {
      name: "C2",
      price: 310000,
    },
  ],
};

function init() {
  // 本日の日付を設定
  let ele = document.getElementsByClassName("setToday");
  let today = new Date();
  today =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  for (let i = 0; i < ele.length; i++) {
    ele[i].setAttribute("value", today);
  }

  // 各種イベント設定
  // 郵便番号から住所取得
  document
    .getElementById("customerPostalcode")
    .addEventListener("keyup", (e) => {
      getAddress(e);
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

function setLot(val) {
  document.getElementById("merchandiseLot").innerHTML = "";
  for (let i = 0; i < MST[val].length; i++) {
    let opt = document.createElement("option");
    opt.value = MST[val][i].name;
    opt.innerHTML = MST[val][i].name;
    document.getElementById("merchandiseLot").appendChild(opt);
  }
  setPrice(MST[val][0].name);
}

function setPrice(lot) {}

function getAddress(e) {
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
      document.getElementById("customerAddress1").value =
        json.results[0].address1;
      document.getElementById("customerAddress2").value =
        json.results[0].address2;
      document.getElementById("customerAddress3").value =
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
