const baseUrl = "https://dummyjson.com";

const loader = document.getElementById("loader");
const products = document.getElementById("products")
const categories = document.getElementById("categories")
const totalCount = document.getElementById("totalCount")
const paginations = document.getElementById("paginations")
const searchInput = document.getElementById("searchInput")
const quickBasket = document.getElementById("quickBasket");
const basketBtn = document.getElementById("basketBtn");
const cartListElem = document.getElementById("cartList");
const countElem = document.getElementById("count")
const totalPrice = document.getElementById("totalPrice")


let allData = [];
let cartList = [];



const getAllProducts = async () => {
  try {
    const [res1, res2, res3] = await Promise.allSettled([
      fetch(`${baseUrl}/products?limit=12&skip=0`),
      fetch(`${baseUrl}/products/categories`),
      fetch(`${baseUrl}/products?limit=194`)
    ])


    const [data1, data2, data3] = await Promise.allSettled([
      res1.value.json(),
      res2.value.json(),
      res3.value.json()
    ]);




    renderProducts(data1.value.products);
    renderCategories(data2.value);
    allData = data3.value.products

    totalCount.innerHTML = data1.value.total;
    generatePaginations(Math.ceil(data1.value.total / 12))
  } catch (error) {
    alert("Server Error", error.message)
  }
  finally {
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 1000)
  }
}
getAllProducts()



const renderProducts = (list) => {
  products.innerHTML = ""
  list?.forEach(item => {
    products.innerHTML += `
     <div
  class="group relative bg-white rounded-3xl overflow-hidden shadow-md
         hover:shadow-2xl transition duration-300 hover:-translate-y-2"
>

  <!-- glow effect -->
  <div class="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-300
              opacity-0 group-hover:opacity-20 blur-2xl transition"></div>

  <!-- IMAGE -->
  <div class="overflow-hidden bg-gray-100">
    <img
      src="${item.thumbnail}"
      alt="${item.title}"
      class="w-full h-[280px] object-cover
             group-hover:scale-110 transition duration-500"
    />
  </div>

  <!-- CONTENT -->
  <div class="p-5 flex flex-col gap-3 relative">

    <!-- TITLE -->
    <h2 class="text-lg font-bold line-clamp-2 min-h-[56px]
               group-hover:text-purple-600 transition">
      ${item.title}
    </h2>

    <!-- PRICE + BUTTON -->
    <div class="flex items-center justify-between">

      <!-- PRICE (BOYUYUB-KICILIR) -->
      <span class="
        text-2xl font-black
        text-transparent bg-clip-text
        bg-gradient-to-r from-purple-900 via-pink-900 to-yellow-900

        inline-block
        animate-[pulse_1.5s_ease-in-out_infinite]
        group-hover:scale-125
        transition-transform duration-300
      ">
        $${item.price}
      </span>

      <!-- BUY BUTTON -->
      <button
  onclick="addToCart(${item.id})"
  class="
    relative overflow-hidden
    px-4 py-2 rounded-xl
    font-semibold text-white

    bg-gradient-to-r from-black via-gray-900 to-black
    border border-red-500/30

    shadow-[0_0_20px_rgba(239,68,68,0.2)]

    transition-all duration-300
    hover:scale-110
    hover:shadow-[0_0_35px_rgba(239,68,68,0.6)]
    hover:border-red-500
    active:scale-95
    group
  "
>
  <!-- text -->
  <span class="
    relative z-10
    inline-block
    animate-[pulse_1.2s_ease-in-out_infinite]
    group-hover:animate-bounce
    transition
  ">
    Buy
  </span>

  <!-- fire glow -->
  <span class="
    absolute inset-0
    bg-gradient-to-r from-transparent via-red-500/20 to-transparent
    -translate-x-full
    group-hover:translate-x-full
    transition duration-700
  "></span>
</button>
    </div>

  </div>
</div>

`
  });
}

const renderCategories = (list) => {
  list.forEach(item => {
    categories.innerHTML += `
    <button
      onclick="getCategoryProducts('${item.url}')"
      class="
        whitespace-nowrap
        px-6 py-3
        rounded-2xl
        bg-white
        border border-gray-200
        shadow-sm
        hover:bg-black
        hover:text-white
        hover:scale-105
        transition
        duration-300
        cursor-pointer
        font-semibold
      "
    >
      ${item.name}
    </button>`
  })
}

const renderCartList = (list = cartList) => {
  cartListElem.innerHTML = "";
  list.forEach(product => {
    cartListElem.innerHTML += `
     <div class="
  group relative
  bg-white/10
  backdrop-blur-xl
  border border-white/10
  rounded-3xl
  p-4
  flex gap-4
  transition-all duration-300
  hover:scale-[1.03]
  hover:bg-white/15
  hover:shadow-[0_15px_50px_rgba(168,85,247,0.25)]
">

  <!-- glow effect -->
  <div class="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/20 blur-2xl rounded-full"></div>

  <!-- IMAGE -->
  <div class="
    min-w-[90px]
    w-[90px]
    h-[90px]
    rounded-2xl
    overflow-hidden
    bg-white/10
    border border-white/10
    shadow-inner
  ">
    <img src="${product.thumbnail}"
      class="
        w-full h-full object-cover
        group-hover:scale-110
        transition duration-500
      " />
  </div>

  <!-- CONTENT -->
  <div class="flex-1 flex flex-col justify-between">

    <!-- TOP -->
    <div class="flex justify-between items-start">

      <div>
        <h3 class="
          text-sm font-bold text-white
          line-clamp-2
          group-hover:text-purple-200
          transition
        ">
          ${product.title.slice(0, 22)} ...
        </h3>

        <p class="text-xs text-purple-300 mt-1">
          ${product.category}
        </p>
      </div>

      <!-- DELETE -->
      <button onclick="removeFromCartList(${product.id})"
        class="
          text-white/50
          hover:text-red-400
          hover:scale-125
          transition
        ">
        ✕
      </button>

    </div>

    <!-- BOTTOM -->
    <div class="flex items-center justify-between mt-3">

      <!-- PRICE -->
      <span class="
  text-lg font-black
  text-transparent bg-clip-text
  bg-gradient-to-r from-purple-300 via-pink-400 to-yellow-300

  animate-pulse
  group-hover:scale-110
  transition
  inline-block
">
  $${(product.price * product.count).toFixed(2)}
</span>

      <!-- COUNTER -->
      <div class="
        flex items-center
        bg-black/20
        border border-white/10
        rounded-2xl
        overflow-hidden
        backdrop-blur-md
        shadow-md
      ">

        <button class="
          w-9 h-9
          text-lg
          hover:bg-red-500/20
          hover:text-red-300
          active:scale-90
          transition
        "
        onclick="decreaseCount(${product.id},this)">
          −
        </button>

        <span class="
          w-10
          text-center
          font-bold
          text-white
        ">
          ${product.count}
        </span>

        <button class="
          w-9 h-9
          text-lg
          hover:bg-green-500/20
          hover:text-green-300
          active:scale-90
          transition
        "
        onclick="increaseCount(${product.id})">
          +
        </button>

      </div>

    </div>

  </div>
</div>
    
    `
  })
  renderCountElem();
  totalPrice.innerHTML = "$" + cartList.reduce((acc, item) => acc + (item.price * item.count), 0).toFixed(2)
}

const renderCountElem = () => {
  if (!cartList.length) {
    countElem.classList.add("hidden")
  } else {
    countElem.classList.remove("hidden")
  }
  countElem.innerHTML = cartList.reduce((acc, item, index, arr) => acc + item.count, 0)
}

renderCountElem();


const getCategoryProducts = async (url) => {
  loader.classList.remove("hidden")
  try {
    const data = await (await fetch(`${url}?limit=12`)).json()
    renderProducts(data.products)
    totalCount.innerHTML = data.total;
    generatePaginations(Math.ceil(data.total / 12), url)
  } catch (error) {
    alert("Server Error", error.message)
  } finally {
    loader.classList.add("hidden")
  }
}

const generatePaginations = (pagesCount, url = `${baseUrl}/products`) => {
  paginations.innerHTML = ""
  if (pagesCount > 1) {
    for (let i = 1; i <= pagesCount; i++) {
      paginations.innerHTML += `
     <button
      onclick="getPage(${i},'${url}')"
      class="
        whitespace-nowrap
        px-6 py-3
        rounded-2xl
        bg-white
        border border-gray-200
        shadow-sm
        hover:bg-black
        hover:text-white
        hover:scale-105
        transition
        duration-300
        cursor-pointer
        font-semibold
      "
    >
      ${i}
    </button>`
    }
  }
}


const getPage = async (pageNum, url) => {
  loader.classList.remove('hidden');
  try {
    let skip = (pageNum - 1) * 12;
    const data = await (await fetch(`${url}?limit=12&skip=${skip}`)).json();
    renderProducts(data.products)
  } catch (error) {
    alert("Server error", error.message)
  }
  finally {
    loader.classList.add('hidden')
  }
}

const addToCart = (id) => {
  const productInCartList = cartList.find(pro => pro.id === id)
  if (productInCartList) {
    productInCartList.count++
  } else {
    const foundPro = allData.find(pro => pro.id === id);
    cartList.push({
      ...foundPro,
      count: 1
    })
  }
  renderCartList()
}
const decreaseCount = (id) => {
  const product = cartList.find(pro => pro.id === id);
  if (product.count !== 1) {
    product.count--;
  } else {
    this.disabled = true
  }
  renderCartList()
}
const increaseCount = (id) => {
  const product = cartList.find(pro => pro.id === id);
  product.count++;
  renderCartList()
}

const removeFromCartList = (id) => {
  cartList = cartList.filter(pro => pro.id !== id);
  renderCartList()
}

searchInput.addEventListener("input", () => {
  let value = searchInput.value.toLowerCase().trim();
  const filteredList = allData.filter(product => product.title.toLowerCase().includes(value));
  renderProducts(filteredList)
})


basketBtn.addEventListener("click", () => {
  quickBasket.classList.remove("hidden")
  document.body.style.overflowY = "hidden"
})

quickBasket.addEventListener("click", (e) => {
  if (e.target === quickBasket) {
    quickBasket.classList.add("hidden")
    document.body.style.overflowY = "auto"
  }
})



const closeBasket = () => {
  quickBasket.classList.add("hidden");
  document.body.style.overflowY = "auto";
};

const goToCheckout = () => {
  window.location.href = "checkout.html";
}