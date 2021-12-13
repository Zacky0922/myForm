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
