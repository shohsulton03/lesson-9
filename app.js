const wrapper = document.querySelector(".wrapper");
const seeMoreBtn = document.querySelector(".see-more");
const loading = document.querySelector(".loading");
let ofset = 1;
let perPageCount = 4;

const API_URL = "https://dummyjson.com";

async function fetchData(api) {
  const response = await fetch(api);
  response
    .json()
    .then((res) => createCard(res))
    .catch((err) => console.log(err))
    .finally(() => {
      loading.style.display = "none";
      seeMoreBtn.removeAttribute("disabled");
    });
}

fetchData(`${API_URL}/products?limit=${perPageCount}`);

seeMoreBtn.addEventListener("click", () => {
  seeMoreBtn.setAttribute("disabled", true);
  //   wrapper.innerHTML = "";
  loading.style.display = "flex";
  ofset++;

  let categoryActive = false;

  document.querySelectorAll(".category").forEach((btn) => {
    if (btn.classList.contains("active")) {
      categoryActive = true;
      console.log("Class list active");
      fetchData(
        `${API_URL}/products/category/${btn.textContent}?limit=${
          ofset * perPageCount
        }`
      );
    }
  });

  if (!categoryActive) {
    fetchData(`${API_URL}/products?limit=${ofset * perPageCount}`);
  }
});

function createCard(data) {
  if (data.total <= ofset * perPageCount) {
    console.log(data.total, ofset * perPageCount);
    seeMoreBtn.style.display = "none";
  }
  console.log(data.total, ofset * perPageCount);

  while (wrapper.firstChild) {
    wrapper.firstChild.remove();
  }

  data.products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <img src=${product.images[0]} alt="">
            <h3>${product.title}</h3>
            <strong>${product.price} USD</strong>
            <br>
            <button>Buy now</button>
        `;
    wrapper.appendChild(card);
  });
  window.scrollTo(0, wrapper.scrollHeight);
}

const categoryEl = document.querySelector(".categories");

async function fetchCategory() {
  const categoriyes = await fetch(
    "https://dummyjson.com/products/category-list"
  );
  categoriyes
    .json()
    .then((res) => createCategoryBtn(res, "cat"))
    .catch((err) => console.log(err));
}

fetchCategory();

function createCategoryBtn(data) {
  data.forEach((categoty) => {
    const button = document.createElement("button");
    button.className = "category";
    button.textContent = categoty;
    button.addEventListener("click", () => {
      seeMoreBtn.style.display = "block";
      document.querySelectorAll(".category").forEach((btn) => {
        btn.classList.remove("active");
      });
      ofset = 1;
      console.log(button.textContent);
      button.classList.add("active");
      fetchData(
        `${API_URL}/products/category/${button.textContent}?limit=${
          ofset * perPageCount
        }`
      );
    });
    categoryEl.appendChild(button);
  });
}
